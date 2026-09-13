import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtemp,mkdir,readFile,writeFile,cp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCandidateDirectory} from './lib/combination-release.mjs';
const repository=path.resolve(import.meta.dirname,'..');

test('service candidates rebuild identical bytes from committed sources without an installer',async()=>{
 const temporary=await mkdtemp(path.join(tmpdir(),'crystra-builder-fixture-'));
 const fixture=path.join(temporary,'repo');await mkdir(fixture);
 const git=(...args)=>execFileSync('git',args,{cwd:fixture,encoding:'utf8'}).trim();
 try{
  await cp(path.join(repository,'scripts'),path.join(fixture,'scripts'),{recursive:true});
  git('init','--quiet');git('config','user.email','fixture@example.invalid');git('config','user.name','Crystra fixture');
  const source=path.join(repository,'crystra-dsh');
  const revision=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
  git('clone','--quiet','--no-hardlinks',source,'crystra-dsh');
  git('update-index','--add','--cacheinfo',`160000,${revision},crystra-dsh`);
  await mkdir(path.join(fixture,'release/services'),{recursive:true});
  const request={schemaVersion:'crystra.release-request@1.0.0',kind:'services',version:'0.1.0',candidateTag:'crystra-services-v0.1.0-rc.1',manifest:'release/services/0.1.0-rc.1.json'};
  // Synthetic coordinates test packaging only; this fixture never pulls images or claims qualification.
  const manifest={schemaVersion:'crystra.compose-release@1.0.0',version:'0.1.0',dshSource:{repository:'firestige/crystra-dsh',revision},supportedPlatforms:['linux/amd64','linux/arm64'],schemaCompatibility:{evidenceRevision:'fixture',reads:['fixture']},hostIntegration:{schemaVersion:'crystra.loopback-host@1.0.0',evidenceQueryRevision:'0.1.0',evidenceTaskQueryRevision:'1.0.0',evolutionComputeRevision:'1'},images:Object.fromEntries(['postgres','evidence','evolution'].map(name=>[name,{coordinate:`ghcr.io/fixture/${name}:0.1.0@sha256:${'a'.repeat(64)}`,source:'https://example.invalid/source',provenance:'https://example.invalid/provenance'}]))};
  await writeFile(path.join(fixture,'release/request.json'),JSON.stringify(request));await writeFile(path.join(fixture,request.manifest),JSON.stringify(manifest));
  git('add','scripts','release');git('commit','--quiet','-m','immutable packaging fixture');
  const outputs=[path.join(temporary,'first'),path.join(temporary,'second')];
  for(const out of outputs)execFileSync(process.execPath,[path.join(fixture,'scripts/build-combination-candidate.mjs'),out],{cwd:fixture,stdio:'pipe'});
  const archive=await readFile(path.join(outputs[0],'crystra-services-0.1.0.tar.gz'));
  assert.deepEqual(archive,await readFile(path.join(outputs[1],'crystra-services-0.1.0.tar.gz')));
  assert.equal((await verifyCandidateDirectory(outputs[0])).metadata.kind,'services');
  const replaced=path.join(outputs[1],'crystra-services-0.1.0.tar.gz');
  await writeFile(replaced,'replaced');
  await assert.rejects(verifyCandidateDirectory(outputs[1]),/CANDIDATE_FILE_DIGEST_MISMATCH/);
  const descriptor=JSON.parse(await readFile(path.join(outputs[0],'service-descriptor.json'),'utf8'));
  assert.equal(descriptor.sha256,createHash('sha256').update(archive).digest('hex'));
  const inventory=execFileSync('tar',['-tzf',path.join(outputs[0],'crystra-services-0.1.0.tar.gz')],{encoding:'utf8'});
  assert.match(inventory,/crystra-compose/);assert.doesNotMatch(inventory,/product-operations|bin\/wsr/);
  await writeFile(path.join(fixture,'uncommitted-input'),'dirty');
  assert.throws(()=>execFileSync(process.execPath,[path.join(fixture,'scripts/build-combination-candidate.mjs'),path.join(temporary,'dirty')],{cwd:fixture,stdio:'pipe'}),error=>/CANDIDATE_SOURCE_DIRTY/.test(error.stderr.toString()));
 }finally{await rm(temporary,{recursive:true,force:true});}
});

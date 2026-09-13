import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {verifyCandidateDirectory} from './lib/combination-release.mjs';
import * as policy from './lib/combination-release.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const request={schemaVersion:'crystra.release-request@1.0.0',kind:'services',version:'0.1.0',candidateTag:'crystra-services-v0.1.0-rc.1',manifest:'release/services/0.1.0-rc.1.json'};
test('RC manifest identity is explicit and agrees with the request, not just its filename',()=>{
 assert.doesNotThrow(()=>policy.validateCandidateManifest(request,{release:'0.1.0-rc.1',version:'0.1.0'}));
 for(const release of [undefined,'0.1.0','0.1.0-rc.2'])assert.throws(()=>policy.validateCandidateManifest(request,{release,version:'0.1.0'}),/CANDIDATE_MANIFEST_IDENTITY/);
});
test('candidate admission rejects a checksummed arbitrary file instead of a complete release set',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'crystra-incomplete-candidate-'));
 try{
  await writeFile(join(directory,'unrelated.txt'),'unrelated');
  await writeFile(join(directory,'release-metadata.json'),JSON.stringify({schemaVersion:'crystra.release-metadata@1.0.0',repository:'firestige/crystra',commit:'a'.repeat(40),kind:request.kind,version:request.version,candidateTag:request.candidateTag,manifestPath:request.manifest,manifestSha256:'b'.repeat(64),files:[{file:'unrelated.txt',sha256:hash('unrelated')}]}));
  await assert.rejects(verifyCandidateDirectory(directory),/CANDIDATE_FILE_SET/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('PR governance validates a release request as a candidate request, not a GA manifest',async()=>{
 const {mkdir}=await import('node:fs/promises');
 const {execFileSync}=await import('node:child_process');
 const directory=await mkdtemp(join(tmpdir(),'crystra-request-governance-'));
 try{
  await mkdir(join(directory,'release/services'),{recursive:true});
  await writeFile(join(directory,'release/request.json'),JSON.stringify(request));
  await writeFile(join(directory,request.manifest),JSON.stringify({release:'0.1.0-rc.1',version:'0.1.0'}));
  const script=new URL('./check-ga-manifest.mjs',import.meta.url).pathname;
  const run=()=>execFileSync(process.execPath,[script,'release/request.json'],{cwd:directory,encoding:'utf8',stdio:'pipe'});
  assert.match(run(),/candidate request/);
  await writeFile(join(directory,request.manifest),JSON.stringify({release:'0.1.0',version:'0.1.0'}));
  assert.throws(run);
 }finally{await rm(directory,{recursive:true,force:true});}
});

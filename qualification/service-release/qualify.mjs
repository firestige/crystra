#!/usr/bin/env node
// Qualification-only tool; never distributed as an installer.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtemp,mkdir,readFile,rm,writeFile,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {verifyCandidateDirectory} from '../../scripts/lib/combination-release.mjs';
const repository=path.resolve(import.meta.dirname,'../..');
const candidate=path.resolve(process.argv[2]);
const {metadata,metadataBytes}=await verifyCandidateDirectory(candidate);
if(metadata.kind!=='services')throw new Error('SERVICE_CANDIDATE_REQUIRED');
const descriptor=JSON.parse(await readFile(path.join(candidate,'service-descriptor.json'),'utf8'));
if(descriptor.schemaVersion!=='crystra.services@1.0.0'||descriptor.directory!==`crystra-services-${metadata.version}`||descriptor.url!==`https://github.com/firestige/crystra/releases/download/${metadata.candidateTag}/${descriptor.directory}.tar.gz`)throw new Error('SERVICE_DESCRIPTOR_BINDING_INVALID');
const archive=await readFile(path.join(candidate,`${descriptor.directory}.tar.gz`));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
if(hash(archive)!==descriptor.sha256)throw new Error('SERVICE_ARCHIVE_DIGEST_MISMATCH');
const manifest=JSON.parse(await readFile(path.join(candidate,`${descriptor.directory}.release.json`),'utf8'));
for(const image of Object.values(manifest.images)){
 const raw=execFileSync('docker',['buildx','imagetools','inspect',image.coordinate,'--raw'],{encoding:'utf8',maxBuffer:8*1024*1024});
 const index=JSON.parse(raw);
 const platforms=new Set((index.manifests??[]).map(item=>`${item.platform?.os}/${item.platform?.architecture}`));
 if(!['linux/amd64','linux/arm64'].every(p=>platforms.has(p)))throw new Error('SERVICE_IMAGE_PLATFORM_MATRIX_INVALID');
}
const cache=path.join(import.meta.dirname,'node_modules','.cache');await mkdir(cache,{recursive:true});
const sources=await mkdtemp(path.join(cache,'crystra-source-'));
await writeFile(path.join(sources,'package.json'),JSON.stringify({type:'module'}));
const stateRoot=await realpath(await mkdtemp(path.join(tmpdir(),'crystra-candidate-services-')));
let lifecycle,namespace;
try{
 const dsh=path.join(repository,'crystra-dsh');
 const selected=execFileSync('git',['ls-tree','HEAD','crystra-dsh'],{cwd:repository,encoding:'utf8'}).trim().split(/\s+/)[2];
 if(manifest.dshSource?.revision!==selected)throw new Error('SERVICE_QUALIFIER_SOURCE_MISMATCH');
 const sourceTar=path.join(sources,'source.tar');
 execFileSync('git',['archive','--format=tar',`--output=${sourceTar}`,selected,'modules/initialization/src'],{cwd:dsh});
 execFileSync('tar',['-xf',sourceTar,'-C',sources]);
 const modules=path.join(sources,'modules/initialization/src');
 const {createComposeAdapter,serviceNamespace}=await import(pathToFileURL(path.join(modules,'compose-adapter.js')));
 const {createServiceLifecycle}=await import(pathToFileURL(path.join(modules,'service-lifecycle.js')));
 namespace=serviceNamespace(stateRoot);
 const adapter=createComposeAdapter({stateRoot,ports:{evidence:25318,evolution:29000},descriptor,fetchImpl:async(url,options)=>url===descriptor.url?new Response(archive):fetch(url,options)});
 lifecycle=createServiceLifecycle({stateRoot,descriptor,adapter});
 for(const [action,status] of [['setup','READY'],['doctor','READY'],['stop','STOPPED'],['doctor','DEGRADED'],['start','READY']]){
  const result=await lifecycle[action]();
  if(result.status!==status)throw new Error(`SERVICE_QUALIFICATION_FAILED: ${action}: ${JSON.stringify(result)}`);
  if(action==='stop')execFileSync('docker',['volume','inspect',namespace.volume],{stdio:'ignore'});
 }
 await lifecycle.dispose();
 if(!(await adapter.inspect()).ready)throw new Error('SERVICE_DISPOSE_STOPPED_STACK');
 const receipt={schemaVersion:'crystra.services.qualification@1.0.0',status:'PASS',candidateTag:metadata.candidateTag,commit:metadata.commit,artifactMetadataSha256:hash(metadataBytes),archiveSha256:descriptor.sha256,images:manifest.images,checks:['platform-matrix','setup','doctor','stop','preserve-volume','restart','dispose-preserve-running']};
 await writeFile(path.join(candidate,'service-qualification.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(receipt,null,2));
}catch(error){
 try{console.error(await readFile(path.join(stateRoot,'services-last-error.log'),'utf8'));}catch{}
 throw error;
}finally{
 await lifecycle?.dispose();
 if(namespace){
  const ids=execFileSync('docker',['ps','-aq','--filter',`label=com.docker.compose.project=${namespace.project}`],{encoding:'utf8'}).trim().split(/\s+/).filter(Boolean);
  if(ids.length)execFileSync('docker',['rm','-f',...ids],{stdio:'ignore'});
  const networks=execFileSync('docker',['network','ls','-q','--filter',`label=com.docker.compose.project=${namespace.project}`],{encoding:'utf8'}).trim().split(/\s+/).filter(Boolean);
  if(networks.length)execFileSync('docker',['network','rm',...networks],{stdio:'ignore'});
  try{execFileSync('docker',['volume','rm',namespace.volume],{stdio:'ignore'});}catch{}
 }
 await rm(stateRoot,{recursive:true,force:true});await rm(sources,{recursive:true,force:true});
}

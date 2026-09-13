#!/usr/bin/env node
import {readFile,writeFile,mkdir,mkdtemp,rm,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {validateReleaseRequest,verifyCombinationArtifacts} from './lib/combination-release.mjs';
const root=process.cwd();
function run(command,args,cwd=root){const r=spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:16*1024*1024});if(r.error||r.status!==0)throw new Error(`CANDIDATE_BUILD_FAILED: ${r.error?.message??r.stderr}`);return r.stdout.trim();}
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
try{
 const request=validateReleaseRequest(JSON.parse(await readFile(resolve(root,'release/request.json'),'utf8')));
 const commit=run('git',['rev-parse','HEAD']);
 if(run('git',['status','--porcelain','--untracked-files=normal']))throw new Error('CANDIDATE_SOURCE_DIRTY');
 const manifestBytes=await readFile(resolve(root,request.manifest));
 const manifest=JSON.parse(manifestBytes);
 const output=resolve(process.argv[2]??'artifacts/candidate');await mkdir(output); // fresh output only
 const metadata={schemaVersion:'crystra.release-metadata@1.0.0',repository:'firestige/crystra',commit,kind:request.kind,version:request.version,candidateTag:request.candidateTag,manifestPath:request.manifest,manifestSha256:digest(manifestBytes),files:[]};
 if(request.kind==='combination'){
  if(manifest.release!==request.version)throw new Error('COMBINATION_REQUEST_VERSION_MISMATCH');
  const downloads=await verifyCombinationArtifacts(manifest);
  await writeFile(join(output,`crystra-${request.version}.release.json`),manifestBytes,{flag:'wx'});
  await writeFile(join(output,'verified-inputs.json'),JSON.stringify({downloads},null,2)+'\n',{flag:'wx'});
 }else{
  if(manifest.version!==request.version)throw new Error('SERVICES_REQUEST_VERSION_MISMATCH');
  const selected=run('git',['ls-tree','HEAD','crystra-dsh']).split(/\s+/)[2];
  if(!/^[0-9a-f]{40}$/.test(selected)||manifest.dshSource?.repository!=='firestige/crystra-dsh'||manifest.dshSource?.revision!==selected||run('git',['rev-parse','HEAD'],join(root,'crystra-dsh'))!==selected)throw new Error('SERVICES_SOURCE_BINDING_MISMATCH');
  const temporary=await mkdtemp(join(tmpdir(),'crystra-service-source-'));
  try{
   // Build exclusively from the selected committed service source, never a dirty mount.
   const archive=join(temporary,'source.tar');
   run('git',['archive','--format=tar',`--output=${archive}`,selected,'services'],join(root,'crystra-dsh'));
   run('tar',['-xf',archive,'-C',temporary]);
   const directory=`crystra-services-${request.version}`;
   run('python3',[join(temporary,'services/build-bundle.py'),resolve(root,request.manifest),join(temporary,directory)]);
   const asset=`${directory}.tar.gz`;
   run('python3',['-c',`import gzip,tarfile,sys,pathlib
root=pathlib.Path(sys.argv[1]);name=sys.argv[2]
with open(sys.argv[3],'xb') as f:
 with gzip.GzipFile(filename='',mode='wb',fileobj=f,mtime=0) as g:
  with tarfile.open(fileobj=g,mode='w') as t:
   for p in [root/name,*sorted((root/name).rglob('*'))]:
    info=t.gettarinfo(str(p),str(p.relative_to(root)));info.mtime=0;info.uid=info.gid=0;info.uname=info.gname=''
    if p.is_file():
     with p.open('rb') as src:t.addfile(info,src)
    else:t.addfile(info)
`,temporary,directory,join(output,asset)]);
   const descriptor={schemaVersion:'crystra.services@1.0.0',directory,url:`https://github.com/firestige/crystra/releases/download/${request.candidateTag}/${asset}`,sha256:digest(await readFile(join(output,asset)))};
   await writeFile(join(output,'service-descriptor.json'),JSON.stringify(descriptor,null,2)+'\n',{flag:'wx'});
   await writeFile(join(output,`${directory}.release.json`),manifestBytes,{flag:'wx'});
  }finally{await rm(temporary,{recursive:true,force:true});}
 }
 for(const file of (await readdir(output)).sort())metadata.files.push({file,sha256:digest(await readFile(join(output,file)))});
 await writeFile(join(output,'release-metadata.json'),JSON.stringify(metadata,null,2)+'\n',{flag:'wx'});
 const sums=[...metadata.files,{file:'release-metadata.json',sha256:digest(await readFile(join(output,'release-metadata.json')))}];
 await writeFile(join(output,'SHA256SUMS'),sums.map(x=>`${x.sha256}  ${x.file}`).join('\n')+'\n',{flag:'wx'});
 console.log(JSON.stringify({candidateTag:request.candidateTag,kind:request.kind,output,qualification:'requires service or combination acceptance'},null,2));
}catch(error){console.error(error.message);process.exitCode=1;}

import {createHash} from 'node:crypto';
const VERSION=/^\d+\.\d+\.\d+$/;
const COMMIT=/^[0-9a-f]{40}$/;
const DIGEST=/^[0-9a-f]{64}$/;
const IDS=['contracts','execution','ui','evidence','evolution','workflow-package','dsh'];
const fail=code=>{throw new Error(code);};
export function validateArtifact(artifact,repository,{services=false}={}) {
 if(!artifact||!DIGEST.test(artifact.sha256))fail('COMBINATION_ARTIFACT_DIGEST_INVALID');
 let url;try{url=new URL(artifact.url);}catch{fail('COMBINATION_COORDINATE_INVALID');}
 const prefix=`/${repository}/releases/download/`;
 if(url.origin!=='https://github.com'||url.username||url.password||url.search||url.hash||!url.pathname.startsWith(prefix))fail('COMBINATION_COORDINATE_INVALID');
 const tail=url.pathname.slice(prefix.length).split('/');
 if(tail.length<2||!tail.at(-1))fail('COMBINATION_COORDINATE_INVALID');
 let tag;try{tag=decodeURIComponent(tail.slice(0,-1).join('/'));}catch{fail('COMBINATION_COORDINATE_INVALID');}
 const stem=services?'crystra-services':repository.split('/')[1];
 const exact=new RegExp(`^${stem}-v\\d+\\.\\d+\\.\\d+(?:-rc\\.[1-9]\\d*)?$`);
 const workflow=repository==='firestige/crystra-workflow-package'&&/^crystra-workflow-package\/[a-z0-9][a-z0-9._-]*\/v\d+\.\d+\.\d+(?:-rc\.[1-9]\d*)?$/.test(tag);
 if(!exact.test(tag)&&!workflow)fail('COMBINATION_COORDINATE_TAG_INVALID');
}
export function validateCombination(manifest) {
 if(manifest?.schema!=='crystra.compatibility@1.0.0'||manifest.plugin!=='dsh-crystra'||!VERSION.test(manifest.release)||manifest.dsh!=='0.1.1-rc.2')fail('COMBINATION_IDENTITY_INVALID');
 if(!Array.isArray(manifest.components)||JSON.stringify(manifest.components.map(x=>x.id).sort())!==JSON.stringify([...IDS].sort()))fail('COMBINATION_COMPONENT_SET_INVALID');
 for(const component of manifest.components){
  if(component.repository!==`firestige/crystra-${component.id}`||!COMMIT.test(component.revision))fail('COMBINATION_SOURCE_INVALID');
  if(!Array.isArray(component.artifacts)||!component.artifacts.length)fail('COMBINATION_ARTIFACTS_REQUIRED');
  const seen=new Set();
  for(const artifact of component.artifacts){validateArtifact(artifact,component.repository);if(seen.has(artifact.url))fail('COMBINATION_ARTIFACT_DUPLICATE');seen.add(artifact.url);}
 }
 validateArtifact(manifest.services,'firestige/crystra',{services:true});
 return manifest;
}
export async function verifyCombinationArtifacts(manifest,fetchImpl=fetch){
 validateCombination(manifest);
 const receipts=[];
 for(const artifact of [...manifest.components.flatMap(c=>c.artifacts),manifest.services]){
  const response=await fetchImpl(artifact.url,{signal:AbortSignal.timeout(120000)});
  if(!response.ok||!response.body)fail('COMBINATION_DOWNLOAD_FAILED');
  const hash=createHash('sha256');let size=0;
  for await(const chunk of response.body){size+=chunk.length;if(size>512*1024*1024)fail('COMBINATION_ARTIFACT_TOO_LARGE');hash.update(chunk);}
  if(hash.digest('hex')!==artifact.sha256)fail('COMBINATION_ARTIFACT_DIGEST_MISMATCH');
  receipts.push({...artifact,size});
 }
 return receipts;
}
export function validateReleaseRequest(request){
 if(request?.schemaVersion!=='crystra.release-request@1.0.0'||!['services','combination'].includes(request.kind))fail('RELEASE_REQUEST_KIND_INVALID');
 if(!VERSION.test(request.version))fail('RELEASE_REQUEST_VERSION_INVALID');
 const stem=request.kind==='services'?'crystra-services':'crystra';
 const version=request.version.replaceAll('.','\\.');
 if(!new RegExp(`^${stem}-v${version}-rc\\.[1-9]\\d*$`).test(request.candidateTag))fail('RELEASE_REQUEST_TAG_INVALID');
 const folder=request.kind==='services'?'services':'combinations';
 if(!new RegExp(`^release/${folder}/${version}-rc\\.[1-9]\\d*\\.json$`).test(request.manifest))fail('RELEASE_REQUEST_PATH_INVALID');
 if(request.manifest.split('/').at(-1)!==request.candidateTag.slice(stem.length+2)+'.json')fail('RELEASE_REQUEST_TAG_PATH_MISMATCH');
 return request;
}

export async function verifyCandidateDirectory(directory){
 const {readFile}=await import('node:fs/promises');
 const {resolve,basename}=await import('node:path');
 const metadataBytes=await readFile(resolve(directory,'release-metadata.json'));
 const metadata=JSON.parse(metadataBytes);
 if(metadata.schemaVersion!=='crystra.release-metadata@1.0.0'||metadata.repository!=='firestige/crystra'||!COMMIT.test(metadata.commit))fail('CANDIDATE_METADATA_INVALID');
 validateReleaseRequest({schemaVersion:'crystra.release-request@1.0.0',kind:metadata.kind,version:metadata.version,candidateTag:metadata.candidateTag,manifest:metadata.manifestPath});
 if(!Array.isArray(metadata.files)||!metadata.files.length)fail('CANDIDATE_FILES_REQUIRED');
 const names=new Set();
 for(const asset of metadata.files){
  if(typeof asset.file!=='string'||basename(asset.file)!==asset.file||asset.file==='release-metadata.json'||asset.file==='SHA256SUMS'||!DIGEST.test(asset.sha256)||names.has(asset.file))fail('CANDIDATE_FILE_INVALID');
  names.add(asset.file);
  const bytes=await readFile(resolve(directory,asset.file));
  if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256)fail('CANDIDATE_FILE_DIGEST_MISMATCH');
 }
 return {metadata,metadataBytes};
}

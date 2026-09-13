import {isDeepStrictEqual} from 'node:util';
import {isThirdPartyPrereleaseField} from '../release-content-policy.mjs';
export function checkPromotion({metadata,manifest,gaManifest,publishedRelease,publishedCommit,repositoryManifestBytes,manifestBytes}){
 const fail=detail=>{throw new Error(`PROMOTION_INVALID: ${detail}`);};
 if(publishedRelease?.tagName!==metadata.candidateTag||publishedRelease.isPrerelease!==true||publishedRelease.isDraft!==false||publishedCommit!==metadata.commit)fail('published predecessor');
 if(!repositoryManifestBytes.equals(manifestBytes))fail('published manifest differs from repository');
 if(gaManifest.release!==metadata.version||(metadata.kind==='services'&&gaManifest.version!==metadata.version))fail('GA identity');
 const content=value=>Object.fromEntries(Object.entries(value).filter(([key])=>!['release','version'].includes(key)));
 if(!isDeepStrictEqual(content(manifest),content(gaManifest)))fail('GA content drift');
 const visit=(value,segments=[])=>{
  if(typeof value==='string'&&/-(rc|dev|alpha|beta|canary|snapshot|preview)\b/i.test(value)&&!isThirdPartyPrereleaseField(gaManifest,segments))fail(`prerelease reference ${segments.join('.')}`);
  if(Array.isArray(value))value.forEach((item,index)=>visit(item,[...segments,String(index)]));
  else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))visit(item,[...segments,key]);
 };
 visit(gaManifest);
 return `${metadata.kind==='services'?'crystra-services':'crystra'}-v${metadata.version}`;
}

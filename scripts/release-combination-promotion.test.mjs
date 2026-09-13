import assert from 'node:assert/strict';
import test from 'node:test';
import {checkPromotion} from './lib/combination-promotion.mjs';
function fixture(){
 const metadata={kind:'services',version:'0.1.0',candidateTag:'crystra-services-v0.1.0-rc.1',commit:'a'.repeat(40)};
 const manifest={release:'0.1.0-rc.1',version:'0.1.0',images:{evidence:{coordinate:'registry/crystra-evidence:0.1.0@sha256:'+'b'.repeat(64)}},platforms:['linux/amd64','linux/arm64']};
 const manifestBytes=Buffer.from(JSON.stringify(manifest));
 return {metadata,manifest,manifestBytes,repositoryManifestBytes:manifestBytes,gaManifest:{...structuredClone(manifest),release:'0.1.0'},publishedRelease:{tagName:metadata.candidateTag,isPrerelease:true,isDraft:false},publishedCommit:metadata.commit};
}
test('promotion permits only root identity changes from exact published qualified source',()=>{
 assert.equal(checkPromotion(fixture()),'crystra-services-v0.1.0');
 for(const change of [x=>{x.publishedRelease.isPrerelease=false},x=>{x.publishedRelease.isDraft=true},x=>{x.publishedCommit='c'.repeat(40)},x=>{x.repositoryManifestBytes=Buffer.from('{}')},x=>{x.gaManifest.platforms.pop()},x=>{x.gaManifest.images.evidence.coordinate='registry/changed'},x=>{x.gaManifest.release='0.2.0'}]){
  const x=fixture();change(x);assert.throws(()=>checkPromotion(x),/PROMOTION_INVALID/);
 }
});
test('lower layer candidates cannot enter GA even when the selected RC used them',()=>{
 const x=fixture();x.manifest.images.evidence.coordinate='registry/crystra-evidence:0.1.0-rc.1';x.gaManifest.images=structuredClone(x.manifest.images);
 assert.throws(()=>checkPromotion(x),/prerelease reference/);
});

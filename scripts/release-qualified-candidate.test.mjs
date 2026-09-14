import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import * as policy from './lib/qualified-candidate.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
function fixture(kind){
 const metadata={kind,commit:'a'.repeat(40),candidateTag:`crystra-${kind}-v0.1.0-rc.1`,files:[{file:'crystra-services-0.1.0.tar.gz',sha256:'b'.repeat(64)}]};
 const metadataBytes=Buffer.from(JSON.stringify(metadata));
 const manifest={images:{postgres:{coordinate:'postgres@sha256:example'}}};
 const record={schemaVersion:`crystra.${kind}.qualification@1.0.0`,status:'PASS',commit:metadata.commit,candidateTag:metadata.candidateTag,artifactMetadataSha256:hash(metadataBytes),archiveSha256:'b'.repeat(64),images:manifest.images,checks:kind==='services'?['platform-matrix','setup','doctor','stop','preserve-volume','restart','dispose-preserve-running']:['all-remote-artifacts','plugin-execution-receipts','service-lifecycle-receipt','installed-dependencies','installed-service-binding']};
 return {metadata,metadataBytes,manifest,record};
}
test('publish admission requires a PASS record bound to exact candidate metadata and complete checks',()=>{
 for(const kind of ['services','combination']){
  const x=fixture(kind);
  assert.doesNotThrow(()=>policy.checkCandidateQualification(x));
  for(const change of [r=>{r.status='FAIL'},r=>{r.commit='c'.repeat(40)},r=>{r.candidateTag+='x'},r=>{r.artifactMetadataSha256='d'.repeat(64)},r=>{r.checks=[]}]){
   const y=fixture(kind);change(y.record);assert.throws(()=>policy.checkCandidateQualification(y),/CANDIDATE_QUALIFICATION/);
  }
 }
});
test('service qualification must bind actual archive and selected image coordinates',()=>{
 for(const change of [r=>{r.archiveSha256='e'.repeat(64)},r=>{r.images={}}]){
  const x=fixture('services');change(x.record);assert.throws(()=>policy.checkCandidateQualification(x),/CANDIDATE_QUALIFICATION/);
 }
});

import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {verifyCandidateDirectory} from './combination-release.mjs';
import {serviceChecks} from './combination-qualification.mjs';
export const combinationChecks=['all-remote-artifacts','plugin-execution-receipts','service-lifecycle-receipt','installed-dependencies','installed-service-binding'];
export function checkCandidateQualification({metadata,metadataBytes,manifest,record}){
 const fail=detail=>{throw new Error(`CANDIDATE_QUALIFICATION_INVALID: ${detail}`);};
 if(!['services','combination'].includes(metadata.kind))fail('kind');
 const checks=metadata.kind==='services'?serviceChecks:combinationChecks;
 if(record?.schemaVersion!==`crystra.${metadata.kind}.qualification@1.0.0`||record.status!=='PASS'||record.commit!==metadata.commit||record.candidateTag!==metadata.candidateTag||record.artifactMetadataSha256!==createHash('sha256').update(metadataBytes).digest('hex')||!checks.every(check=>record.checks?.includes(check)))fail('receipt binding');
 if(metadata.kind==='services'){
  const archive=metadata.files.find(asset=>asset.file.endsWith('.tar.gz'));
  if(!archive||record.archiveSha256!==archive.sha256||!isDeepStrictEqual(record.images,manifest.images))fail('service bytes or images');
 }
 return record;
}
export async function verifyQualifiedCandidate(directory){
 const candidate=await verifyCandidateDirectory(directory);
 const qualificationFile=`${candidate.metadata.kind==='services'?'service':'combination'}-qualification.json`;
 const qualificationBytes=await readFile(resolve(directory,qualificationFile));
 const qualification=checkCandidateQualification({...candidate,record:JSON.parse(qualificationBytes)});
 return {...candidate,qualification,qualificationFile,qualificationBytes};
}

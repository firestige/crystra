#!/usr/bin/env node
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyQualifiedCandidate} from './lib/qualified-candidate.mjs';
import {verifyCombinationArtifacts} from './lib/combination-release.mjs';
import {checkPromotion} from './lib/combination-promotion.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
try{
 const [candidatePath,gaPath,outputPath,candidateTag]=process.argv.slice(2);
 const candidate=resolve(candidatePath),output=resolve(outputPath);
 const checked=await verifyQualifiedCandidate(candidate);
 const {metadata,manifest,manifestBytes,qualificationFile}=checked;
 if(candidateTag!==metadata.candidateTag)throw new Error('PROMOTION_REQUEST_TAG_MISMATCH');
 const folder=metadata.kind==='services'?'services':'combinations';
 if(gaPath!==`release/${folder}/${metadata.version}.json`)throw new Error('PROMOTION_MANIFEST_PATH_INVALID');
 const gaBytes=await readFile(resolve(gaPath)),gaManifest=JSON.parse(gaBytes);
 const gh=args=>execFileSync('gh',args,{encoding:'utf8'}).trim();
 const publishedRelease=JSON.parse(gh(['release','view',candidateTag,'--repo','firestige/crystra','--json','tagName,isPrerelease,isDraft']));
 const publishedCommit=gh(['api',`repos/firestige/crystra/commits/${candidateTag}`,'--jq','.sha']);
 const repositoryManifestBytes=await readFile(resolve(metadata.manifestPath));
 const tag=checkPromotion({metadata,manifest,manifestBytes,gaManifest,publishedRelease,publishedCommit,repositoryManifestBytes});
 // Also enforce the shared GA policy; preserve its diagnostic output on failure.
 execFileSync(process.execPath,['scripts/check-ga-manifest.mjs',gaPath,'--from-rc',metadata.manifestPath],{stdio:'inherit'});
 if(metadata.kind==='combination')await verifyCombinationArtifacts(gaManifest);
 await mkdir(output);
 const files=[...metadata.files.map(asset=>asset.file),'release-metadata.json',qualificationFile,'release-preview.md','SHA256SUMS'];
 for(const file of files)await copyFile(resolve(candidate,file),resolve(output,file));
 // Preserve all candidate bytes and receipt bindings. GA identity is a separate projection.
 await writeFile(resolve(output,'promotion-manifest.json'),gaBytes,{flag:'wx'});
 const promotion={schemaVersion:'crystra.promotion@1.0.0',tag,candidateTag,commit:metadata.commit,candidateMetadataSha256:hash(checked.metadataBytes),manifestSha256:hash(gaBytes),candidateManifestSha256:hash(manifestBytes)};
 await writeFile(resolve(output,'promotion.json'),JSON.stringify(promotion,null,2)+'\n',{flag:'wx'});
 if(metadata.kind==='services'){
  const descriptor=JSON.parse(await readFile(resolve(candidate,'service-descriptor.json'),'utf8'));
  descriptor.url=descriptor.url.replace(`/download/${candidateTag}/`,`/download/${tag}/`);
  await writeFile(resolve(output,'ga-service-descriptor.json'),JSON.stringify(descriptor,null,2)+'\n',{flag:'wx'});
  files.push('ga-service-descriptor.json');
 }
 files.push('promotion-manifest.json','promotion.json');
 const sums=[];for(const file of files)sums.push(`${hash(await readFile(resolve(output,file)))}  ${file}`);
 await writeFile(resolve(output,'PROMOTION-SHA256SUMS'),sums.join('\n')+'\n',{flag:'wx'});
 console.log(JSON.stringify(promotion,null,2));
}catch(error){console.error(error.message);process.exitCode=1;}

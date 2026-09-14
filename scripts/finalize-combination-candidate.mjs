#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {verifyQualifiedCandidate} from './lib/qualified-candidate.mjs';
import {renderReleasePreview} from './render-release-preview.mjs';
try{
 const directory=resolve(process.argv[2]);
 const {metadata,manifest,qualificationFile}=await verifyQualifiedCandidate(directory);
 await writeFile(resolve(directory,'release-preview.md'),renderReleasePreview(manifest),{flag:'wx'});
 const files=[...metadata.files.map(asset=>asset.file),'release-metadata.json',qualificationFile,'release-preview.md'];
 const sums=[];
 for(const file of files)sums.push(`${createHash('sha256').update(await readFile(resolve(directory,file))).digest('hex')}  ${file}`);
 await writeFile(resolve(directory,'SHA256SUMS'),sums.join('\n')+'\n');
 console.log(JSON.stringify({candidateTag:metadata.candidateTag,files:[...files,'SHA256SUMS']}));
}catch(error){console.error(error.message);process.exitCode=1;}

#!/usr/bin/env node
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyCandidateDirectory,verifyCombinationArtifacts} from './lib/combination-release.mjs';
import {checkCombinationQualification,pluginGates} from './lib/combination-qualification.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function download(url,limit=4*1024*1024){
 const response=await fetch(url,{signal:AbortSignal.timeout(120000)});
 if(!response.ok||!response.body)throw new Error('QUALIFICATION_DOWNLOAD_FAILED');
 let size=0;const chunks=[];
 for await(const chunk of response.body){size+=chunk.length;if(size>limit)throw new Error('QUALIFICATION_DOWNLOAD_TOO_LARGE');chunks.push(chunk);}
 return Buffer.concat(chunks);
}
try{
 const directory=resolve(process.argv[2]);
 const {metadata,metadataBytes,manifest}=await verifyCandidateDirectory(directory);
 if(metadata.kind!=='combination')throw new Error('COMBINATION_CANDIDATE_REQUIRED');
 await verifyCombinationArtifacts(manifest);
 const plugin=manifest.components.find(c=>c.id==='dsh').artifacts.filter(a=>/\/dsh-crystra-\d+\.\d+\.\d+\.tgz$/.test(a.url));
 if(plugin.length!==1)throw new Error('ONE_PLUGIN_ARTIFACT_REQUIRED');
 const pluginBase=plugin[0].url.slice(0,plugin[0].url.lastIndexOf('/')+1);
 const serviceBase=manifest.services.url.slice(0,manifest.services.url.lastIndexOf('/')+1);
 const [pluginMetadata,pluginQualification,serviceMetadata,serviceQualification]=await Promise.all([pluginBase+'release-metadata.json',pluginBase+'release-qualification.json',serviceBase+'release-metadata.json',serviceBase+'service-qualification.json'].map(url=>download(url)));
 const evidence=await download(pluginBase+'qualification-evidence.tar.gz',32*1024*1024);
 const pluginLogs=Object.fromEntries(pluginGates.map(gate=>[gate,execFileSync('tar',['-xzOf','-',`qualification-evidence/${gate}.log`],{input:evidence,maxBuffer:16*1024*1024})]));
 const archive=await download(plugin[0].url,128*1024*1024);
 if(hash(archive)!==plugin[0].sha256)throw new Error('QUALIFICATION_PLUGIN_DIGEST_MISMATCH');
 const extract=name=>JSON.parse(execFileSync('tar',['-xzOf','-',`package/${name}`],{input:archive,encoding:'utf8',maxBuffer:2*1024*1024}));
 const closure=checkCombinationQualification({manifest,pluginLogs,pluginMetadata,pluginQualification:JSON.parse(pluginQualification),serviceMetadata,serviceQualification:JSON.parse(serviceQualification),packageJson:extract('package.json'),serviceDescriptor:extract('modules/initialization/src/service-descriptor.json')});
 const record={schemaVersion:'crystra.combination.qualification@1.0.0',status:'PASS',candidateTag:metadata.candidateTag,commit:metadata.commit,artifactMetadataSha256:hash(metadataBytes),closure,receiptSha256:{plugin:hash(pluginQualification),services:hash(serviceQualification)},checks:['all-remote-artifacts','plugin-execution-receipts','service-lifecycle-receipt','installed-dependencies','installed-service-binding']};
 await writeFile(resolve(directory,'combination-qualification.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(record,null,2));
}catch(error){console.error(error.message);process.exitCode=1;}

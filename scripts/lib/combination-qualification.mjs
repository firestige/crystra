import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export const pluginGates=['cleanProfile','lifecycle','realHarness','loopbackOutage','providerRouting','remoteArtifacts'];
export const serviceChecks=['platform-matrix','setup','doctor','stop','preserve-volume','restart','dispose-preserve-running'];
const fail=detail=>{throw new Error(`COMBINATION_QUALIFICATION_INVALID: ${detail}`);};
export function checkCombinationQualification({manifest,pluginMetadata,pluginQualification,serviceMetadata,serviceQualification,packageJson,serviceDescriptor,pluginLogs}){
 const pm=JSON.parse(pluginMetadata),sm=JSON.parse(serviceMetadata);
 const pq=pluginQualification,sq=serviceQualification;
 const dsh=manifest.components.find(c=>c.id==='dsh');
 const pmHash=`sha256:${hash(pluginMetadata)}`,smHash=hash(serviceMetadata);
 if(pm.schemaVersion!=='crystra.dsh.release-metadata@1.0.0'||pm.repository!=='firestige/crystra-dsh'||pm.commit!==dsh?.revision||pm.packages?.length!==1)fail('plugin metadata source');
 const asset=pm.packages[0];
 if(!/^\d+\.\d+\.\d+$/.test(pm.packageVersion)||!new RegExp(`^crystra-dsh-v${pm.packageVersion.replaceAll('.','\\.')}-rc\\.[1-9]\\d*$`).test(pm.candidateTag))fail('plugin candidate identity');
 const pluginUrls=[pm.candidateTag,`crystra-dsh-v${pm.packageVersion}`].map(tag=>`https://github.com/firestige/crystra-dsh/releases/download/${tag}/${asset.file}`);
 const pluginUrl=dsh.artifacts.find(a=>pluginUrls.includes(a.url)&&`sha256:${a.sha256}`===asset.sha256)?.url;
 if(!pluginUrl||asset.package!=='dsh-crystra'||asset.version!==pm.packageVersion||!dsh.artifacts.some(a=>a.url===pluginUrl&&`sha256:${a.sha256}`===asset.sha256))fail('plugin artifact');
 if(pq?.schemaVersion!=='crystra.dsh.release-qualification@1.0.0'||pq.packageVersion!==pm.packageVersion||pq.commit!==pm.commit||pq.candidateTag!==pm.candidateTag||pq.artifactMetadataSha256!==pmHash)fail('plugin receipt binding');
 for(const gate of pluginGates){
  const receipt=pq.receipts?.[gate];
  if(receipt?.schemaVersion!=='crystra.dsh.gate-receipt@1.0.0'||!Array.isArray(receipt.command)||!receipt.command.length||receipt.log!==`${gate}.log`||!Buffer.isBuffer(pluginLogs?.[gate])||receipt.logSha256!==`sha256:${hash(pluginLogs[gate])}`)fail(`plugin log ${gate}`);
  if(pq.gates?.[gate]!=='PASS'||receipt?.gate!==gate||receipt.status!=='PASS'||receipt.exitCode!==0||receipt.commit!==pm.commit||receipt.candidateTag!==pm.candidateTag||receipt.artifactMetadataSha256!==pmHash)fail(`plugin gate ${gate}`);
 }
 if(sm.schemaVersion!=='crystra.release-metadata@1.0.0'||sm.repository!=='firestige/crystra'||sm.kind!=='services'||!/^[0-9a-f]{40}$/.test(sm.commit))fail('service metadata');
 const filename=`crystra-services-${sm.version}.tar.gz`;
 if(!/^\d+\.\d+\.\d+$/.test(sm.version)||!new RegExp(`^crystra-services-v${sm.version.replaceAll('.','\\.')}-rc\\.[1-9]\\d*$`).test(sm.candidateTag))fail('service candidate identity');
 const serviceUrls=[sm.candidateTag,`crystra-services-v${sm.version}`].map(tag=>`https://github.com/firestige/crystra/releases/download/${tag}/${filename}`);
 const serviceUrl=manifest.services.url;
 if(!serviceUrls.includes(serviceUrl)||!sm.files?.some(a=>a.file===filename&&a.sha256===manifest.services.sha256))fail('service artifact');
 if(sq?.schemaVersion!=='crystra.services.qualification@1.0.0'||sq.status!=='PASS'||sq.commit!==sm.commit||sq.candidateTag!==sm.candidateTag||sq.artifactMetadataSha256!==smHash||sq.archiveSha256!==manifest.services.sha256||!serviceChecks.every(c=>sq.checks?.includes(c)))fail('service receipt binding');
 if(packageJson.name!=='dsh-crystra'||packageJson.version!==pm.packageVersion)fail('installed package identity');
 for(const [id,name] of [['execution','crystra-execution'],['ui','crystra-ui-core']]){
  const component=manifest.components.find(c=>c.id===id);
  if(!component?.artifacts.some(a=>a.url===packageJson.dependencies?.[name]))fail(`installed dependency ${id}`);
 }
 if(serviceDescriptor.url!==manifest.services.url||serviceDescriptor.sha256!==manifest.services.sha256)fail('installed service descriptor');
 return {plugin:{commit:pm.commit,url:pluginUrl,sha256:asset.sha256.slice(7),metadataSha256:pmHash.slice(7)},services:{commit:sm.commit,url:serviceUrl,sha256:manifest.services.sha256,metadataSha256:smHash}};
}

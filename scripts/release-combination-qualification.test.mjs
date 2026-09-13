import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import * as policy from './lib/combination-qualification.mjs';
const digest=value=>createHash('sha256').update(value).digest('hex');
function fixture(){
 const commit='a'.repeat(40), pluginSha='b'.repeat(64),serviceSha='c'.repeat(64);
 const pluginTag='crystra-dsh-v0.1.0-rc.1',serviceTag='crystra-services-v0.1.0-rc.1';
 const pluginUrl=`https://github.com/firestige/crystra-dsh/releases/download/${pluginTag}/dsh-crystra-0.1.0.tgz`;
 const services={url:`https://github.com/firestige/crystra/releases/download/${serviceTag}/crystra-services-0.1.0.tar.gz`,sha256:serviceSha};
 const metadata={schemaVersion:'crystra.dsh.release-metadata@1.0.0',repository:'firestige/crystra-dsh',commit,candidateTag:pluginTag,packageVersion:'0.1.0',packages:[{package:'dsh-crystra',version:'0.1.0',file:'dsh-crystra-0.1.0.tgz',sha256:`sha256:${pluginSha}`} ]};
 const pluginMetadata=Buffer.from(JSON.stringify(metadata));
 const gates=Object.fromEntries(['cleanProfile','lifecycle','realHarness','loopbackOutage','providerRouting','remoteArtifacts'].map(g=>[g,'PASS']));
 const pluginLogs=Object.fromEntries(Object.keys(gates).map(g=>[g,Buffer.from(`${g} completed`)]));
 const receipts=Object.fromEntries(Object.keys(gates).map(g=>[g,{schemaVersion:'crystra.dsh.gate-receipt@1.0.0',command:['node',`qualify-${g}.mjs`],log:`${g}.log`,logSha256:`sha256:${digest(pluginLogs[g])}`,gate:g,status:'PASS',exitCode:0,commit,candidateTag:pluginTag,artifactMetadataSha256:`sha256:${digest(pluginMetadata)}`} ]));
 const pluginQualification={schemaVersion:'crystra.dsh.release-qualification@1.0.0',packageVersion:'0.1.0',commit,candidateTag:pluginTag,artifactMetadataSha256:`sha256:${digest(pluginMetadata)}`,gates,receipts};
 const serviceMetadata=Buffer.from(JSON.stringify({schemaVersion:'crystra.release-metadata@1.0.0',repository:'firestige/crystra',kind:'services',commit,candidateTag:serviceTag,version:'0.1.0',files:[{file:'crystra-services-0.1.0.tar.gz',sha256:serviceSha}]}));
 const serviceQualification={schemaVersion:'crystra.services.qualification@1.0.0',status:'PASS',commit,candidateTag:serviceTag,artifactMetadataSha256:digest(serviceMetadata),archiveSha256:serviceSha,checks:['platform-matrix','setup','doctor','stop','preserve-volume','restart','dispose-preserve-running']};
 const components=[{id:'dsh',revision:commit,artifacts:[{url:pluginUrl,sha256:pluginSha}]},...['execution','ui'].map(id=>({id,artifacts:[{url:`https://github.com/firestige/crystra-${id}/releases/download/crystra-${id}-v0.1.0-rc.1/lib.tgz`,sha256:'d'.repeat(64)}]}))];
 const packageJson={name:'dsh-crystra',version:'0.1.0',dependencies:{'crystra-execution':components[1].artifacts[0].url,'crystra-ui-core':components[2].artifacts[0].url}};
 return {manifest:{components,services},pluginLogs,pluginMetadata,pluginQualification,serviceMetadata,serviceQualification,packageJson,serviceDescriptor:services};
}
test('combination admission binds independently qualified plugin and service bytes to one installation closure',()=>{
 assert.doesNotThrow(()=>policy.checkCombinationQualification(fixture()));
 for(const mutate of [
  x=>{x.pluginLogs.cleanProfile=Buffer.from('tampered log')},
  x=>{x.pluginQualification.commit='f'.repeat(40)},
  x=>{x.pluginQualification.receipts.cleanProfile.exitCode=1},
  x=>{x.serviceQualification.archiveSha256='e'.repeat(64)},
  x=>{x.serviceDescriptor={...x.serviceDescriptor,sha256:'e'.repeat(64)}},
  x=>{x.packageJson.dependencies['crystra-execution']='file:unpublished.tgz'},
  x=>{x.serviceQualification.checks=['setup']},
 ]){const x=fixture();mutate(x);assert.throws(()=>policy.checkCombinationQualification(x),/COMBINATION_QUALIFICATION/);}
});
test('GA assets retain exact RC metadata and receipts under stable publication coordinates',()=>{
 const x=fixture();
 x.manifest.components[0].artifacts[0].url=x.manifest.components[0].artifacts[0].url.replace('-rc.1/','/');
 x.manifest.services.url=x.manifest.services.url.replace('-rc.1/','/');
 assert.doesNotThrow(()=>policy.checkCombinationQualification(x));
});

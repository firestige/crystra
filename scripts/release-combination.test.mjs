import assert from 'node:assert/strict';
import test from 'node:test';
import {validateCombination,verifyCombinationArtifacts,validateReleaseRequest} from './lib/combination-release.mjs';
import {createHash} from 'node:crypto';
const bytes=Buffer.from('exact candidate artifact');
const digest=createHash('sha256').update(bytes).digest('hex');
function fixture(){
 const components=['contracts','execution','ui','evidence','evolution','workflow-package','dsh'].map(id=>({id,repository:`firestige/crystra-${id}`,revision:'a'.repeat(40),artifacts:[{url:`https://github.com/firestige/crystra-${id}/releases/download/crystra-${id}-v0.1.0-rc.1/asset.tgz`,sha256:digest}]}));
 return {schema:'crystra.compatibility@1.0.0',release:'0.1.0',plugin:'dsh-crystra',dsh:'0.1.1-rc.2',components,services:{url:'https://github.com/firestige/crystra/releases/download/crystra-services-v0.1.0-rc.1/crystra-services-0.1.0.tar.gz',sha256:digest}};
}
test('a combination fixes all seven component sources and the service bytes',async()=>{
 const manifest=fixture();
 assert.doesNotThrow(()=>validateCombination(manifest));
 const fetched=[];
 await verifyCombinationArtifacts(manifest,async url=>{fetched.push(url);return new Response(bytes);});
 assert.equal(fetched.length,8);
 await assert.rejects(verifyCombinationArtifacts(manifest,async()=>new Response('replacement')),/DIGEST_MISMATCH/);
});
test('incomplete, old-brand, moving or duplicated combination inputs fail closed',()=>{
 const missing=fixture();missing.components.pop();assert.throws(()=>validateCombination(missing),/COMPONENT_SET/);
 const duplicate=fixture();duplicate.components[1]=duplicate.components[0];assert.throws(()=>validateCombination(duplicate),/COMPONENT_SET/);
 const old=fixture();old.components[0].artifacts[0].url=old.components[0].artifacts[0].url.replace('/crystra-contracts/','/wsr-contracts/');assert.throws(()=>validateCombination(old),/COORDINATE/);
 const latest=fixture();latest.components[0].revision='main';assert.throws(()=>validateCombination(latest),/SOURCE/);
 const plugin=fixture();plugin.plugin='dsh-wsr';assert.throws(()=>validateCombination(plugin),/IDENTITY/);
});
test('release requests cannot publish an old installer or escape immutable request paths',()=>{
 const base={schemaVersion:'crystra.release-request@1.0.0',kind:'combination',version:'0.1.0',candidateTag:'crystra-v0.1.0-rc.1',manifest:'release/combinations/0.1.0-rc.1.json'};
 assert.doesNotThrow(()=>validateReleaseRequest(base));
 assert.throws(()=>validateReleaseRequest({...base,kind:'product'}),/KIND/);
 assert.throws(()=>validateReleaseRequest({...base,manifest:'../secret.json'}),/PATH/);
 assert.throws(()=>validateReleaseRequest({...base,candidateTag:'product-0.1.0'}),/TAG/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('lib/eon/story-state.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {storyState}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('reverse and interrupted journeys reproduce identical states',()=>{const points=[0,.12,.21,.35,.44,.55,.66,.73,.85,.92,1];const forward=points.map(storyState);[1,.02,.77,.13,1,0].forEach(storyState);assert.deepEqual(points.slice().reverse().map(storyState).reverse(),forward);});
test('geometry remains assembled at both ends and holds open through cleaning',()=>{assert.equal(storyState(0).open,0);assert.equal(storyState(1).open,0);assert.equal(storyState(.35).open,1);assert.equal(storyState(.73).open,1);assert.equal(storyState(.44).cleaning,0);assert.equal(storyState(.66).cleaning,1);assert.ok(storyState(.55).cleaning>.45&&storyState(.55).cleaning<.55);});
test('progress clamps and transformations have no frame-rate dependency',()=>{assert.deepEqual(storyState(-1),storyState(0));assert.deepEqual(storyState(2),storyState(1));for(let i=0;i<=1000;i++){const s=storyState(i/1000);assert.ok(Object.values(s).every(Number.isFinite));assert.ok(s.open>=0&&s.open<=1);assert.ok(s.cleaning>=0&&s.cleaning<=1);}});

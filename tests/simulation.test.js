import test from 'node:test';
import assert from 'node:assert/strict';
import {Sand,SIZE,RES} from '../src/sand.js';
import {drive,scoop,release} from '../src/simulation.js';
const toy=(kind,x=0,z=0)=>({kind,x,z,angle:0,active:false,cargo:0,arm:0});
test('scooping and releasing conserve sand',()=>{const s=new Sand(),t=toy(1);const mass=s.mass();scoop(t,s);assert.ok(t.cargo>0);assert.ok(Math.abs(s.mass()+t.cargo-mass)<.001);release(t,[t],s);assert.equal(t.cargo,0);assert.ok(Math.abs(s.mass()-mass)<.001);});
test('blade moves sand forward without creating it',()=>{const s=new Sand(),t=toy(0);t.active=true;const before=s.heights.slice(),mass=s.mass();drive(t,[t],s,new Set(['w']),.04);assert.ok(s.heights.some((v,i)=>v!==before[i]));assert.ok(Math.abs(s.mass()-mass)<.001);});
test('vehicles stay bounded and parked toys stay still',()=>{const s=new Sand(),t=toy(0),parked=toy(1,4,4);for(let i=0;i<500;i++)drive(t,[t,parked],s,new Set(['w']),.04);assert.equal(t.z,-(SIZE/2-1.75));assert.equal(parked.x,4);assert.equal(parked.z,4);});
test('truck collects and unloads with conservation',()=>{const s=new Sand(),t=toy(2);const mass=s.mass();for(let i=0;i<60;i++)drive(t,[t],s,new Set(['w']),.04);assert.ok(t.cargo>0);t.active=true;for(let i=0;i<100;i++)drive(t,[t],s,new Set(),.04);assert.equal(t.cargo,0);assert.ok(Math.abs(s.mass()-mass)<.002);});
test('digger can transfer a scoop into a parked truck',()=>{const s=new Sand(),d=toy(1),truck=toy(2,0,-1.62);scoop(d,s);const load=d.cargo;release(d,[d,truck],s);assert.equal(truck.cargo,load);assert.equal(d.cargo,0);});
test('vehicles cannot drive through another toy',()=>{const s=new Sand(),d=toy(0),other=toy(1,0,-2);for(let i=0;i<100;i++)drive(d,[d,other],s,new Set(['w']),.04);assert.ok(Math.hypot(d.x-other.x,d.z-other.z)>=1.5);});

test('larger sandbox keeps the original terrain cell size',()=>{assert.equal(SIZE,28);assert.equal(SIZE/RES,14/80);});
test('fresh sand has reproducible seeded piles across all four quadrants',()=>{
 const seeded=()=>{let seed=42;return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};};
 const s=new Sand(seeded()),same=new Sand(seeded());
 assert.deepEqual(s.heights,same.heights);
 assert.equal(s.piles.length,16);
 for(const x of [-1,1])for(const z of [-1,1])assert.ok(s.piles.some(p=>Math.sign(p.x)===x&&Math.sign(p.z)===z));
 for(const p of s.piles)assert.ok(s.sample(p.x,p.z)>.6);
 assert.ok(s.heights.every(h=>Number.isFinite(h)&&h>=.045));
 const before=s.heights.slice();s.reset();assert.notDeepEqual(s.heights,before);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {bindDriveButtons,bindGameAction} from '../src/touch-input.js';
const button=key=>Object.assign(new EventTarget(),{dataset:{key},setPointerCapture(){}});
const emit=(target,type,id=1,detail=1)=>{const e=Object.assign(new Event(type,{cancelable:true}),{pointerId:id,button:0,detail});target.dispatchEvent(e);return e;};
test('each driving finger releases independently and cancelled input stops',()=>{
 const forward=button('w'),left=button('a');const input=bindDriveButtons([forward,left],()=>true);
 assert.ok(emit(forward,'pointerdown',1).defaultPrevented);
 emit(forward,'pointerdown',2);emit(left,'pointerdown',3);emit(forward,'pointerup',1);
 assert.deepEqual([...input.keys()],['w','a']);
 emit(forward,'pointercancel',2);assert.deepEqual([...input.keys()],['a']);
 emit(left,'lostpointercapture',3);assert.equal(input.keys().size,0);
 emit(forward,'pointerdown');input.clear();assert.equal(input.keys().size,0);
});
test('touch action fires once on press, suppresses duplicate click, retains keyboard activation',()=>{
 const action=button();let count=0;bindGameAction(action,()=>count++,()=>true,()=>true);
 assert.ok(emit(action,'pointerdown').defaultPrevented);assert.equal(count,1);
 emit(action,'click');assert.equal(count,1);
 emit(action,'click',1,0);assert.equal(count,2);
});
test('desktop actions use clicks and paused controls do not activate',()=>{
 const desktop=button();let count=0;bindGameAction(desktop,()=>count++,()=>false,()=>true);
 emit(desktop,'pointerdown');assert.equal(count,0);emit(desktop,'click');assert.equal(count,1);
 const paused=button();bindGameAction(paused,()=>count++,()=>true,()=>false);
 emit(paused,'pointerdown');emit(paused,'click',1,0);assert.equal(count,1);
});

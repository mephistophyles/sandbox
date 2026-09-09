import test from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3 } from 'three';
import {createFollowCamera} from '../src/follow-camera.js';
const sand={sample:()=>.25};
const toy={x:2,z:3,angle:0};
test('third-person camera moves with the vehicle and stays behind after steering',()=>{
 const camera=new PerspectiveCamera(52,1.5,.1,200),follow=createFollowCamera(camera,sand);
 const vehicle={...toy};follow.update(vehicle,0);
 assert.ok(camera.position.z>vehicle.z);assert.ok(camera.position.y>.25);
 vehicle.x+=3;follow.update(vehicle,1/60);assert.equal(camera.position.x,vehicle.x);
 vehicle.angle=Math.PI/2;for(let i=0;i<120;i++)follow.update(vehicle,1/60);
 assert.ok(camera.position.x>vehicle.x+6);assert.ok(Math.abs(camera.position.z-vehicle.z)<.01);
 const direction=camera.getWorldDirection(new Vector3());assert.ok(direction.x<0);
});
test('switching toys immediately attaches the camera to the new toy',()=>{
 const camera=new PerspectiveCamera(),follow=createFollowCamera(camera,sand);
 follow.update(toy,0);const next={x:-9,z:-8,angle:Math.PI};follow.update(next,1/60);
 assert.ok(camera.position.z<next.z);assert.ok(Math.abs(camera.position.x-next.x)<.001);
});
test('portrait resize preserves follow view and camera clears tall sand',()=>{
 const camera=new PerspectiveCamera(),follow=createFollowCamera(camera,{sample:(x,z)=>z>5?6:.25});
 follow.update(toy,0);assert.ok(camera.position.y>6);
 camera.aspect=.5;follow.update(toy,1/60);
 assert.ok(camera.position.z>toy.z);assert.ok(camera.position.y>6);
});

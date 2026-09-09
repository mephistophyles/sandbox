import './style.css';
import * as T from 'three';
import {Sand} from './sand.js';
import {createWorld} from './world.js';
import {toyIcon} from './toys.js';
import {drive,scoop,release,CAPACITY} from './simulation.js';
const $=s=>document.querySelector(s);
const sand=new Sand();
let world;
try{world=createWorld($('#scene'),sand);}catch(error){$('#scene').innerHTML='<p style="text-align:center;padding:100px 20px">This sandbox needs WebGL. Please try a browser with graphics acceleration enabled.</p>';throw error;}
const {toys,ring,renderer,scene,camera}=world;
let selected=0,last=performance.now(),frame=0;
const keys=new Set();
const updateUI=()=>{
 const t=toys[selected];$('#action').hidden=selected===1;$('#scoop').hidden=selected!==1;$('#release').hidden=selected!==1;
 $('#action').innerHTML=selected===0?`<kbd>Space</kbd> ${t.active?'Raise':'Lower'} blade`:`<kbd>Space</kbd> ${t.active?'Lower bed':'Tip sand'}`;
 $('#action').setAttribute('aria-pressed',String(t.active));
 $('#status').textContent=selected===0?`Blade ${t.active?'down · let’s push!':'up · ready to roam'}`:selected===1?`Bucket ${t.cargo>.1?'full · find a place to drop':'empty · ready to dig'}`:`${Math.round(t.cargo/CAPACITY*100)}% full · ${t.active?'tipping sand':'drive to collect sand'}`;
};
const select=index=>{selected=index;keys.clear();document.querySelectorAll('.toy').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});updateUI();};
const action=()=>{if(selected===1)return;toys[selected].active=!toys[selected].active;updateUI();};
const dig=()=>{scoop(toys[selected],sand);updateUI();};
const drop=()=>{release(toys[selected],toys,sand);updateUI();};
for(let i=0;i<3;i++){$(`#icon-${i}`).innerHTML=toyIcon(i);$(`[data-toy="${i}"]`).onclick=()=>select(i);}
$('#action').onclick=action;$('#scoop').onclick=dig;$('#release').onclick=drop;
const paused=()=>!$('#help-panel').hidden||$('#reset-dialog').open;
window.addEventListener('keydown',e=>{
 if(e.target.closest('dialog')||e.target.matches('input,textarea'))return;
 const key=e.key.toLowerCase();
 if(key==='escape'){$('#help-panel').hidden=true;return;}
 if(paused())return;
 if(['w','a','s','d','i','k',' '].includes(key)){if(e.target.matches('button')&&key===' ')return;e.preventDefault();}
 if(e.repeat)return;
 if(['1','2','3'].includes(key))select(Number(key)-1);
 if(key===' ')action();if(key==='i')dig();if(key==='k')drop();keys.add(key);
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
const clearInput=()=>keys.clear();window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',clearInput);
for(const button of document.querySelectorAll('[data-key]')){
 button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.key);});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.key));
}
const raycaster=new T.Raycaster();renderer.domElement.addEventListener('pointerdown',e=>{
 const rect=renderer.domElement.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),camera);
 const hits=raycaster.intersectObjects(toys.map(t=>t.group),true);if(!hits.length)return;
 let object=hits[0].object;while(object.parent&&object.parent!==scene)object=object.parent;
 const index=toys.findIndex(t=>t.group===object);if(index>=0)select(index);
});
$('#help').onclick=()=>{$('#help-panel').hidden=!$('#help-panel').hidden;clearInput();};$('#close-help').onclick=()=>{$('#help-panel').hidden=true;$('#help').focus();};
$('#reset').onclick=()=>{clearInput();$('#reset-dialog').showModal();};$('#cancel-reset').onclick=()=>$('#reset-dialog').close();
$('#confirm-reset').onclick=()=>{sand.reset();toys.forEach((t,i)=>Object.assign(t,{x:[-3.5,.1,3.3][i],z:[2.5,-1.5,2][i],angle:[-.35,.4,-.65][i],active:false,cargo:0,arm:0}));select(0);world.syncSand();$('#reset-dialog').close();};
const animate=now=>{
 const dt=Math.min((now-last)/1000,.04);last=now;
 if(!paused())drive(toys[selected],toys,sand,keys,dt);
 for(const t of toys){t.group.position.set(t.x,sand.sample(t.x,t.z)+.035,t.z);t.group.rotation.y=t.angle;
 if(t.kind===0)t.tool.position.y=T.MathUtils.damp(t.tool.position.y,t.active?.13:.43,9,dt);
 if(t.kind===1)t.tool.rotation.x=T.MathUtils.damp(t.tool.rotation.x,t.arm,7,dt);
 if(t.kind===2)t.tool.rotation.x=T.MathUtils.damp(t.tool.rotation.x,t.active?-.75:0,5,dt);
 t.load.visible=t.cargo>.1;t.load.scale.y=Math.max(.1,t.cargo/(t.kind===2?CAPACITY:10)*2);
 }
 const t=toys[selected];ring.position.set(t.x,sand.sample(t.x,t.z)+.045,t.z);
 if(frame++%4===0){world.syncSand();updateUI();}renderer.render(scene,camera);requestAnimationFrame(animate);
};
updateUI();requestAnimationFrame(animate);
// Read-only state snapshots make real browser checks possible without affecting play.
window.sandbox={snapshot:()=>({selected,toys:toys.map(({x,z,angle,cargo,active})=>({x,z,angle,cargo,active})),sandMass:sand.mass()})};

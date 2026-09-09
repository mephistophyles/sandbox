import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const materials=new Map();
const mat=(color)=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.72}));return materials.get(color);};
export const box=(parent,w,h,d,color,x=0,y=0,z=0,r=.045)=>{const mesh=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,r),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
export const cylinder=(parent,r,h,color,x,y,z)=>{const mesh=new T.Mesh(new T.CylinderGeometry(r,r,h,16),mat(color));mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh;};
const wheels=(g,tracked)=>{
  for(const side of [-1,1]) {
    if(tracked)box(g,.27,.38,1.34,0x3f4846,side*.52,.23,0,.12);
    for(const z of [-.43,.43]) { const w=cylinder(g,.24,.18,0x384342,side*.55,.25,z);w.rotation.z=Math.PI/2;const hub=cylinder(g,.115,.19,0xe9bb58,side*.57,.25,z);hub.rotation.z=Math.PI/2; }
    if(tracked)for(let z=-.58;z<=.6;z+=.15)box(g,.285,.045,.045,0x63706a,side*.52,.4,z,.008);
  }
};
const cab=(g,color,z)=>{box(g,.64,.56,.57,color,0,.8,z);box(g,.52,.31,.025,0x435f64,0,.84,z-.295);box(g,.025,.3,.39,0x567277,-.33,.84,z);box(g,.025,.3,.39,0x567277,.33,.84,z);box(g,.76,.1,.69,color,0,1.12,z);};
export const makeToy=(kind)=>{
  const g=new T.Group(); const color=[0xf2bf43,0xe7a140,0x689f94][kind];wheels(g,kind!==2);box(g,.87,.26,1.25,color,0,.43,0);
  let tool;
  if(kind===0){cab(g,color,.2);box(g,.66,.22,.45,color,0,.65,-.39);for(const x of [-.39,.39])box(g,.09,.1,.7,0x777d69,x,.3,-.7);tool=box(g,1.5,.48,.19,0xe8ac31,0,.33,-1.01);box(tool,1.5,.06,.27,0xf8d87c,0,-.2,-.03);cylinder(g,.045,.35,0x4e5144,.27,.91,-.36);}
  if(kind===1){cab(g,color,.24);const arm=new T.Group();arm.position.set(0,.63,-.18);g.add(arm);const beam=box(arm,.19,.2,1.05,color,0,.44,-.39);beam.rotation.x=.65;const fore=box(arm,.16,.17,.86,color,0,.39,-1.08);fore.rotation.x=-.8;box(arm,.07,.07,.83,0xd8d9c6,.13,.49,-.84);tool=arm;box(arm,.61,.28,.47,0x6b7468,0,.08,-1.43);for(const x of [-.22,0,.22])box(arm,.1,.09,.2,0x858777,x,-.04,-1.7);}
  if(kind===2){cab(g,color,-.4);tool=new T.Group();tool.position.set(0,.53,.58);g.add(tool);box(tool,.85,.1,1.03,color,0,0,-.35);for(const x of [-.43,.43])box(tool,.09,.43,1.08,color,x,.19,-.35);box(tool,.85,.43,.08,color,0,.19,.17);box(tool,.85,.43,.08,color,0,.19,-.88);box(g,.69,.14,.08,0xe5d9ad,0,.44,-.67);for(const x of [-.24,.24])box(g,.16,.13,.045,0xffedb5,x,.62,-.715);}
  const load=box(kind===2?tool:g,kind===2?.72:.43,.13,kind===2?.87:.32,0xe6c17c,0,kind===2?.18:.79,kind===2?-.35:-.2);load.visible=false;
  return {group:g,tool,load,kind,x:[-3.5,.1,3.3][kind],z:[2.5,-1.5,2][kind],angle:[-.35,.4,-.65][kind],active:false,cargo:0,arm:0};
};
export const toyIcon=(kind)=>{
 const color=['#efbd42','#e5a241','#6e9f93'][kind];
 const body=kind===0?'<path d="M13 27h32v12H13zM25 15h16v17H25z"/><path d="M45 30h13v13H45z"/>':kind===1?'<path d="M13 25h27v14H13zM18 13h17v16H18zM36 21l9-16 8 3 7 20-6 3-7-17-7 14z"/><path d="M52 28h13v9H52z"/>':'<path d="M7 18h19v21H7zM29 16h34v23H29z"/>';
 return `<svg viewBox="0 0 72 48" aria-hidden="true"><ellipse cx="36" cy="43" rx="30" ry="3" fill="#dce2d4"/><g fill="${color}" stroke="${color}" stroke-linejoin="round" stroke-width="3">${body}</g><path d="M${kind===2?'11 21h10v9H11':'22 17h10v9H22'}z" fill="#587274"/><g fill="#46514b"><circle cx="19" cy="39" r="7"/><circle cx="49" cy="39" r="7"/></g><g fill="#bac4ad"><circle cx="19" cy="39" r="3"/><circle cx="49" cy="39" r="3"/></g></svg>`;
};

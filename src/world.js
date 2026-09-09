import * as T from 'three';
import {box,cylinder,makeToy} from './toys.js';
import {SIZE,RES} from './sand.js';
export const createWorld=(container,sand)=>{
 const half=SIZE/2, edge=half+.3, scale=SIZE/14;
 const scene=new T.Scene();scene.background=new T.Color(0xe8eee2);
 const camera=new T.PerspectiveCamera(34,1,.1,200);camera.position.set(18,21,24);camera.lookAt(0,0,0);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;container.appendChild(renderer.domElement);
 scene.add(new T.HemisphereLight(0xfff7df,0x8c9f7a,2.5));const sun=new T.DirectionalLight(0xfff1d1,3.2);sun.position.set(-8,16,8).multiplyScalar(scale);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-13*scale,right:13*scale,top:13*scale,bottom:-13*scale,near:1,far:45*scale});sun.shadow.normalBias=.04;sun.shadow.bias=-.0003;scene.add(sun);
 box(scene,200,.2,200,0xe8eee2,0,-.8,0);
 box(scene,SIZE+1.2,.45,SIZE+1.2,0xb78857,0,-.31,0,.15);
 for(const z of [-edge,edge]){box(scene,SIZE+1.1,.65,.48,0xc89966,0,.05,z,.1);box(scene,SIZE+1.35,.15,.7,0xdbb17b,0,.42,z,.07);}
 for(const x of [-edge,edge]){box(scene,.48,.65,SIZE+.6,0xc89966,x,.05,0,.1);box(scene,.7,.15,SIZE+.7,0xdbb17b,x,.42,0,.07);}
 for(const x of [-edge,edge])for(const z of [-edge,edge]){box(scene,.93,.16,.93,0xe8c38b,x,.5,z,.09);cylinder(scene,.055,.01,0xa7885f,x,.588,z);}
 // Quiet wood grain, kept outside the playable sand.
 for(let i=0;i<Math.ceil(SIZE/.72);i++){const x=-half+.1+i*.72;box(scene,.42,.008,.012,0xc69c67,x,.501,edge+.06+(i%3)*.1,.003);}
 const geometry=new T.PlaneGeometry(SIZE,SIZE,RES,RES);geometry.rotateX(-Math.PI/2);geometry.setAttribute('color',new T.BufferAttribute(new Float32Array((RES+1)**2*3),3));
 const terrain=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}));terrain.receiveShadow=true;terrain.castShadow=true;scene.add(terrain);
 const sandColor=new T.Color(0xe5bf79);
 const syncSand=()=>{const p=geometry.attributes.position,c=geometry.attributes.color;for(let i=0;i<sand.heights.length;i++){const h=sand.heights[i];p.setY(i,h);const shade=.94+Math.sin(i*127.1)*.025;const brightness=shade+Math.min(h,.9)*.045;c.setXYZ(i,sandColor.r*brightness,sandColor.g*brightness,sandColor.b*brightness);}p.needsUpdate=true;c.needsUpdate=true;geometry.computeVertexNormals();};syncSand();
 const toys=[0,1,2].map(makeToy);toys.forEach(t=>scene.add(t.group));
 const ring=new T.Mesh(new T.RingGeometry(.86,.9,48),new T.MeshBasicMaterial({color:0xffffe7,side:T.DoubleSide,transparent:true,opacity:.85,depthWrite:false}));ring.rotation.x=-Math.PI/2;scene.add(ring);
 // A forgotten bucket and spade sit on the grass, out of the vehicles' way.
 const bucket=cylinder(scene,.42,.6,0xba7060,(-half-1.3),-.25,4);const inside=cylinder(scene,.33,.02,0x814d40,(-half-1.3),.06,4);const handle=new T.Mesh(new T.TorusGeometry(.37,.035,8,20,Math.PI),new T.MeshStandardMaterial({color:0xe3cdb0}));handle.position.set((-half-1.3),.05,4);scene.add(handle);
 box(scene,.11,.08,1.2,0xc89d65,(-half-1.4),-.62,2.5);box(scene,.37,.1,.44,0x6d9b94,(-half-1.4),-.6,1.8);
 let seed=8;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<130;i++){const x=(random()-.5)*(SIZE+10),z=(random()-.5)*(SIZE+7);if(Math.abs(x)<half+.9&&Math.abs(z)<half+.9)continue;const grass=new T.Group();grass.position.set(x,-.65,z);for(let j=0;j<3;j++){const blade=box(grass,.04,.16+random()*.2,.045,0xa5b492,(j-1)*.07,.09,0,.015);blade.rotation.z=(j-1)*.4;}scene.add(grass);}
 const resize=()=>{const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.position.set(18,21,24).multiplyScalar(scale*(camera.aspect<1.15?1.15/camera.aspect:1));camera.lookAt(0,0,0);camera.updateProjectionMatrix();};new ResizeObserver(resize).observe(container);resize();
 return {scene,camera,renderer,toys,ring,syncSand};
};

import {SIZE} from './sand.js';
export const CAPACITY=22;
export const front=(toy,d=1.2)=>({x:toy.x-Math.sin(toy.angle)*d,z:toy.z-Math.cos(toy.angle)*d});
export const drive=(toy,toys,sand,keys,dt)=>{
 const throttle=Number(keys.has('w'))-Number(keys.has('s'));
 const turn=Number(keys.has('a'))-Number(keys.has('d'));
 toy.angle+=turn*1.8*dt;
 const point=front(toy,throttle*2.4*dt);
 const bound=SIZE/2-1.75;
 const x=Math.max(-bound,Math.min(bound,point.x)),z=Math.max(-bound,Math.min(bound,point.z));
 const blocked=toys.some(other=>other!==toy&&Math.hypot(other.x-x,other.z-z)<1.5);
 if(!blocked){toy.x=x;toy.z=z;}
 if(toy.kind===0&&toy.active&&throttle>0&&!blocked){const p=front(toy,1.08),q=front(toy,1.68);const amount=sand.take(p.x,p.z,.72,dt*20);sand.deposit(q.x,q.z,.85,amount);}
 if(toy.kind===2){
  if(toy.active&&toy.cargo>0){const p=front(toy,-1.25);const amount=Math.min(toy.cargo,dt*10);toy.cargo-=sand.deposit(p.x,p.z,.65,amount);}
  else if(!toy.active&&throttle!==0&&!blocked){toy.cargo+=sand.take(toy.x,toy.z,.5,Math.min(dt*5,CAPACITY-toy.cargo));}
 }
};
export const scoop=(toy,sand)=>{if(toy.kind!==1)return;const p=front(toy,1.62);toy.cargo+=sand.take(p.x,p.z,.65,Math.min(9,10-toy.cargo));toy.arm=.65;};
export const release=(toy,toys,sand)=>{
 if(toy.kind!==1)return;
 const p=front(toy,1.62);const truck=toys.find(t=>t.kind===2&&Math.hypot(t.x-p.x,t.z-p.z)<1.3);
 if(truck){const amount=Math.min(toy.cargo,CAPACITY-truck.cargo);truck.cargo+=amount;toy.cargo-=amount;}
 if(toy.cargo>0){toy.cargo-=sand.deposit(p.x,p.z,.55,toy.cargo);}
 toy.arm=0;
};

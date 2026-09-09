export const SIZE = 14;
export const RES = 80;
export class Sand {
  constructor() { this.heights = new Float32Array((RES + 1) ** 2); this.reset(); }
  reset() {
    for (let z=0;z<=RES;z++) for(let x=0;x<=RES;x++) {
      const px=x/RES*SIZE-SIZE/2, pz=z/RES*SIZE-SIZE/2;
      this.heights[z*(RES+1)+x]=.24+.025*Math.sin(x*1.7+z*2.1)+.72*Math.exp(-((px-2.6)**2+(pz+2.1)**2)/2.5)+.38*Math.exp(-((px+3.5)**2+(pz-1.8)**2)/1.8);
    }
  }
  sample(x,z) { const ix=Math.max(0,Math.min(RES,Math.round((x+SIZE/2)/SIZE*RES))), iz=Math.max(0,Math.min(RES,Math.round((z+SIZE/2)/SIZE*RES))); return this.heights[iz*(RES+1)+ix]; }
  cells(x,z,radius) {
    const cells=[];
    const x0=Math.max(0,Math.floor((x-radius+SIZE/2)/SIZE*RES)),x1=Math.min(RES,Math.ceil((x+radius+SIZE/2)/SIZE*RES));
    const z0=Math.max(0,Math.floor((z-radius+SIZE/2)/SIZE*RES)),z1=Math.min(RES,Math.ceil((z+radius+SIZE/2)/SIZE*RES));
    for(let iz=z0;iz<=z1;iz++) for(let ix=x0;ix<=x1;ix++) { const d=Math.hypot(ix/RES*SIZE-SIZE/2-x,iz/RES*SIZE-SIZE/2-z); if(d<radius)cells.push([iz*(RES+1)+ix,1-d/radius]); }
    return cells;
  }
  take(x,z,radius,amount) {
    const cells=this.cells(x,z,radius), total=cells.reduce((s,c)=>s+c[1],0); let taken=0;
    for(const [i,w] of cells) {const n=Math.min(this.heights[i]-.045,amount*w/total);this.heights[i]-=n;taken+=n;}
    return taken;
  }
  deposit(x,z,radius,amount) {
    const cells=this.cells(x,z,radius),total=cells.reduce((s,c)=>s+c[1],0);
    if(!total)return 0;
    for(const [i,w] of cells)this.heights[i]+=amount*w/total;
    return amount;
  }
  mass(){return this.heights.reduce((s,h)=>s+h,0);}
}

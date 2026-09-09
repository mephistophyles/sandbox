export const SIZE = 28;
export const RES = 160;
export class Sand {
  constructor(random = Math.random) { this.random = random; this.heights = new Float32Array((RES + 1) ** 2); this.reset(); }
  reset() {
    // One mound in each region keeps the whole sandbox interesting, with fresh
    // positions, widths, and heights on every creation or reset.
    this.piles = Array.from({length: 16}, (_, i) => ({
      x: -SIZE/2 + (i%4 + .25 + this.random()*.5)*SIZE/4,
      z: -SIZE/2 + (Math.floor(i/4) + .25 + this.random()*.5)*SIZE/4,
      height: .45 + this.random()*1.05,
      width: .9 + this.random()*1.1,
    }));
    for (let z=0;z<=RES;z++) for(let x=0;x<=RES;x++) {
      const px=x/RES*SIZE-SIZE/2, pz=z/RES*SIZE-SIZE/2;
      this.heights[z*(RES+1)+x]=.24+.025*Math.sin(x*1.7+z*2.1)+this.piles.reduce((height,pile)=>height+pile.height*Math.exp(-((px-pile.x)**2+(pz-pile.z)**2)/(2*pile.width**2)),0);
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

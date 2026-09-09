import { Vector3 } from 'three';

// The heading follows turns gently; position stays attached to the selected toy.
export const createFollowCamera = (camera, sand) => {
  const target = new Vector3();
  let followed = null;
  let heading = 0;
  let height = 0;

  const update = (toy, dt, snap = false) => {
    const changed = followed !== toy || snap;
    followed = toy;
    const turn = Math.atan2(Math.sin(toy.angle-heading), Math.cos(toy.angle-heading));
    heading = changed ? toy.angle : heading + turn * (1-Math.exp(-8*dt));
    const ground = sand.sample(toy.x, toy.z);
    const distance = camera.aspect < 1 ? 9 : 7;
    camera.position.set(toy.x+Math.sin(heading)*distance, 0, toy.z+Math.cos(heading)*distance);
    target.set(toy.x-Math.sin(heading)*1.3, ground+.65, toy.z-Math.cos(heading)*1.3);
    let desiredHeight = ground + 5;
    // Keep the view above piles along the sight line, including newly built hills.
    for (let i=1; i<=12; i++) {
      const t=i/12;
      const x=target.x+(camera.position.x-target.x)*t;
      const z=target.z+(camera.position.z-target.z)*t;
      desiredHeight=Math.max(desiredHeight,target.y+(sand.sample(x,z)+.35-target.y)/t);
    }
    height = changed ? desiredHeight : height+(desiredHeight-height)*(1-Math.exp(-7*dt));
    camera.position.y=Math.max(height,desiredHeight);
    camera.lookAt(target);
  };

  return { update };
};

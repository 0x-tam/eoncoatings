import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { storyState } from './story-state';

// Metres. All cutaway transforms are evaluated from progress, never accumulated.
export function createDuct() {
 const root=new T.Group(); root.name='EON_representative_duct';
 const top=new T.Group(), side=new T.Group(), hatch=new T.Group(), fixed=new T.Group();
 top.name='virtual_upper_cutaway'; side.name='virtual_side_cutaway'; hatch.name='manufactured_access_hatch'; fixed.name='fixed_lower_channel';
 root.add(fixed,top,side,hatch);
 const metal=new T.MeshStandardMaterial({color:0xa2a9a8,metalness:.88,roughness:.43});
 metal.onBeforeCompile=(s)=>{
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vMetalPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nvMetalPosition = position;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
  varying vec3 vMetalPosition;
  float grain(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
  float zinc(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(grain(i),grain(i+vec3(1,0,0)),f.x),mix(grain(i+vec3(0,1,0)),grain(i+vec3(1,1,0)),f.x),f.y),mix(mix(grain(i+vec3(0,0,1)),grain(i+vec3(1,0,1)),f.x),mix(grain(i+vec3(0,1,1)),grain(i+vec3(1,1,1)),f.x),f.y),f.z);}
  `).replace('#include <color_fragment>','#include <color_fragment>\nfloat pat=zinc(vMetalPosition*120.); diffuseColor.rgb *= .90 + pat*.18;').replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(pat-.5)*.16,.3,.7);');
 };
 const edge=new T.MeshStandardMaterial({color:0x999f9d,metalness:.88,roughness:.35});
 const rubber=new T.MeshStandardMaterial({color:0x303432,roughness:.9});
 const groups=new Map<T.Group,T.BufferGeometry[]>();
 function part(parent:T.Group,name:string,size:number[],pos:number[],mat=metal,bevel=.0012){
  const geo=new RoundedBoxGeometry(size[0],size[1],size[2],1,Math.min(bevel,Math.min(...size)/3));
  const mesh=new T.Mesh(geo,mat);mesh.name=name;mesh.position.set(...pos as [number,number,number]);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 function bolt(parent:T.Group,pos:number[],axis:'x'|'y'|'z'){
  const geo=new T.CylinderGeometry(.007,.007,.006,6);if(axis==='x')geo.rotateZ(Math.PI/2);if(axis==='z')geo.rotateX(Math.PI/2);geo.translate(...pos as [number,number,number]);const arr=groups.get(parent)||[];arr.push(geo);groups.set(parent,arr);
 }
 // Folded lower channel and rear wall. The object is open at both ends.
 part(fixed,'lower_sheet',[1.6,.004,.72],[0,-.28,0]);
 part(fixed,'far_wall',[1.6,.56,.004],[0,0,-.36]);
 part(side,'near_wall',[1.6,.56,.004],[0,0,.36]);
 // Top is four thin sheets around the manufactured hatch aperture.
 part(top,'upper_left',[.49,.004,.72],[-.555,.28,0]);
 part(top,'upper_right',[.49,.004,.72],[.555,.28,0]);
 part(top,'upper_front',[.62,.004,.14],[0,.28,.29]);
 part(top,'upper_back',[.62,.004,.14],[0,.28,-.29]);
 for(const z of [-.36,.36]){part(z<0?fixed:side,'folded_longitudinal_seam',[1.6,.012,.011],[0,-.275,z],edge);part(z<0?fixed:top,'standing_seam',[1.6,.009,.012],[0,.282,z],edge);}
 // Access panel, separate gasket and small captive fasteners, stays parallel to roof.
 for(const z of [-.223,.223])part(hatch,'gasket_long',[.634,.006,.012],[0,.285,z],rubber);
 for(const x of [-.311,.311])part(hatch,'gasket_short',[.012,.006,.446],[x,.285,0],rubber);
 part(hatch,'hatch_panel',[.65,.005,.48],[0,.293,0]);
 part(hatch,'handle_bridge',[.092,.013,.019],[0,.315,0],edge);
 for(const x of [-.039,.039])part(hatch,'handle_foot',[.014,.015,.019],[x,.304,0],edge);
 for(const x of [-.295,.295])for(const z of [-.21,.21])bolt(hatch,[x,.3,z],'y');
 // TDC-style end flanges, attached to their associated virtual shell.
 for(const x of [-.8,.8]){
  part(fixed,'bottom_end_flange',[.018,.033,.778],[x,-.283,0],edge);
  part(top,'top_end_flange',[.018,.033,.778],[x,.283,0],edge);
  part(fixed,'far_end_flange',[.018,.56,.033],[x,0,-.367],edge);
  part(side,'near_end_flange',[.018,.56,.033],[x,0,.367],edge);
  for(const z of [-.34,0,.34]){bolt(fixed,[x+Math.sign(x)*.012,-.28,z],'x');bolt(top,[x+Math.sign(x)*.012,.28,z],'x');}
  for(const y of [-.22,0,.22]){bolt(fixed,[x+Math.sign(x)*.012,y,-.366],'x');bolt(side,[x+Math.sign(x)*.012,y,.366],'x');}
 }
 // Short connected continuation, its seams establish a real assembly.
 for(const z of [-.36,.36])part(fixed,'continuation_wall',[.25,.56,.004],[.935,0,z]);
 for(const y of [-.28,.28])part(fixed,'continuation_horizontal',[.25,.004,.72],[.935,y,0]);
 for(const z of [-.36,.36])part(fixed,'continuation_seam',[.012,.56,.013],[1.06,0,z],edge);
 // Restrained transverse stiffening beads, pressed sheet detail.
 for(const x of [-.45,.45]){
  part(side,'pressed_bead',[.004,.50,.0028],[x,0,.363],edge,.0006);
  part(fixed,'pressed_bead',[.004,.50,.0028],[x,0,-.363],edge,.0006);
 }
 for(const [parent,geos] of groups){const m=new T.Mesh(mergeGeometries(geos),edge);m.name='associated_fasteners';parent.add(m);geos.forEach(g=>g.dispose());}
 const cleaning={value:-.85};
 const dust=new T.MeshStandardMaterial({color:0x6a6255,roughness:1,transparent:true,depthWrite:false,side:T.DoubleSide});
 dust.onBeforeCompile=s=>{
  s.uniforms.cleanFront=cleaning;
  s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vDust;').replace('#include <begin_vertex>','#include <begin_vertex>\nvDust=position;');
  s.fragmentShader=s.fragmentShader.replace('#include <common>',`#include <common>
  varying vec3 vDust; uniform float cleanFront;
  float dustRand(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(dustRand(i),dustRand(i+vec2(1,0)),f.x),mix(dustRand(i+vec2(0,1)),dustRand(i+vec2(1,1)),f.x),f.y);}
  `).replace('#include <color_fragment>',`#include <color_fragment>
  float n=noise(vDust.xz*32.)*.6+noise(vDust.xz*110.)*.4;
  float edges=smoothstep(.14,.34,abs(vDust.z));
  diffuseColor.rgb *= .7+n*.6;
  diffuseColor.a = (.19+n*.56+edges*.22)*smoothstep(cleanFront-.015,cleanFront+.015,vDust.x);
  `);
 };
 const floorGeo=new T.PlaneGeometry(1.58,.698);floorGeo.rotateX(-Math.PI/2);floorGeo.translate(0,-.276,0);
 const deposit=new T.Mesh(floorGeo,dust);deposit.name='surface_bound_dust';fixed.add(deposit);
 // Sparse settled deposits, seeded once. Instanced and cut by local cleaning plane.
 let seed=9173;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const grains=new T.InstancedMesh(new T.SphereGeometry(1,4,3),new T.MeshStandardMaterial({color:0x7c7261,roughness:1}),160);
 grains.name='settled_corner_deposits';const matrix=new T.Matrix4(),q=new T.Quaternion();const positions:T.Vector3[]=[];
 for(let i=0;i<160;i++){const x=random()*1.54-.77,z=(random()>.5?1:-1)*(.22+random()*.12);positions.push(new T.Vector3(x,-.273,z));matrix.compose(positions[i],q,new T.Vector3(.0015+random()*.003,.0008,.0015+random()*.003));grains.setMatrixAt(i,matrix);}fixed.add(grains);
 let lastFront=-2;
 return {root, update(progress:number,mobile=false){const s=storyState(progress);top.position.y=s.open*(mobile?.29:.43);side.position.z=s.open*(mobile?.24:.4);side.position.y=s.open*-.04;hatch.position.y=s.open*(mobile?.29:.43)+s.hatch*.16;cleaning.value=-.85+s.cleaning*1.7;
 if(Math.abs(lastFront-cleaning.value)>.0001){for(let i=0;i<160;i++){grains.getMatrixAt(i,matrix);const visible=positions[i].x>cleaning.value;matrix.setPosition(positions[i].x,visible?-.273:-.29,positions[i].z);grains.setMatrixAt(i,matrix);}grains.instanceMatrix.needsUpdate=true;lastFront=cleaning.value;}
 root.rotation.y=s.orbit;return s;}, dispose(){const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>();root.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());} };
}

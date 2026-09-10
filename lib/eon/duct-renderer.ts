import * as T from 'three';

import { createDuct } from './duct-assembly';

export function mountDuct(host:HTMLElement,onFailure:()=>void){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
 host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new T.Scene();const camera=new T.PerspectiveCamera(32,1,.1,30);
 const studio=new T.Scene();studio.background=new T.Color(0x172322);
 const studioMaterials:T.MeshBasicMaterial[]=[];const studioGeometries:T.PlaneGeometry[]=[];
 function softbox(w:number,h:number,pos:[number,number,number],color:number,intensity:number){const geo=new T.PlaneGeometry(w,h);const mat=new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(intensity),side:T.DoubleSide});const plane=new T.Mesh(geo,mat);plane.position.set(...pos);plane.lookAt(0,0,0);studio.add(plane);studioMaterials.push(mat);studioGeometries.push(geo);}
 softbox(5,3,[1,.6,5],0xdce6e4,1.7);softbox(4,2,[-2,3,2],0xffffff,4);softbox(.8,4,[3,1,2],0xd6e7ef,3);softbox(3,.6,[0,2,-3],0xffffff,4);softbox(2,3,[-3,0,-1],0xadbea9,.7);
 const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(studio,.035);scene.environment=env.texture;scene.environmentIntensity=.9;studioMaterials.forEach(m=>m.dispose());studioGeometries.forEach(g=>g.dispose());pmrem.dispose();
 scene.add(new T.HemisphereLight(0xffffff,0x183b2d,.35));
 const key=new T.DirectionalLight(0xf4fff4,2.6);key.position.set(-2,4,3);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-2;key.shadow.camera.right=2;key.shadow.camera.top=2;key.shadow.camera.bottom=-2;key.shadow.bias=-.0005;key.shadow.normalBias=.015;key.shadow.radius=4;scene.add(key);
 const fill=new T.DirectionalLight(0xe7edf0,1.1);fill.position.set(3,2,-3);scene.add(fill);
 const duct=createDuct();scene.add(duct.root);
 const ground=new T.Mesh(new T.PlaneGeometry(10,10),new T.ShadowMaterial({opacity:.28}));ground.rotation.x=-Math.PI/2;ground.position.y=-.318;ground.receiveShadow=true;scene.add(ground);
 const corner=new T.Vector3();
 const fitMeshes:T.Mesh[]=[];duct.root.traverse(o=>{if(o instanceof T.Mesh&&!(o instanceof T.InstancedMesh)){o.geometry.computeBoundingBox();fitMeshes.push(o);}});

 let width=0,height=0,progress=0,frame=0,visible=true,disposed=false,renderCount=0;
 const render=()=>{frame=0;if(disposed||!visible||document.hidden)return;const state=duct.update(progress,width<600);camera.position.set(-2.3+state.orbit,1.55+state.open*.5,3.2);camera.lookAt(.09,.04+state.open*.16,.05+state.open*.08);camera.updateMatrixWorld();duct.root.updateMatrixWorld(true);
 let ratio=0;for(const mesh of fitMeshes){const box=mesh.geometry.boundingBox!;for(let ix=0;ix<2;ix++)for(let iy=0;iy<2;iy++)for(let iz=0;iz<2;iz++){corner.set(ix?box.max.x:box.min.x,iy?box.max.y:box.min.y,iz?box.max.z:box.min.z).applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse);ratio=Math.max(ratio,Math.abs(corner.y)/-corner.z,Math.abs(corner.x)/(-corner.z*camera.aspect));}}
 camera.fov=2*Math.atan(ratio/(width<600?.87:.91-state.open*.03))*180/Math.PI;camera.updateProjectionMatrix();renderer.render(scene,camera);renderCount++;host.dataset.ready='true';host.dataset.progress=progress.toFixed(4);host.dataset.renderCount=String(renderCount);host.dataset.triangles=String(renderer.info.render.triangles);host.dataset.drawCalls=String(renderer.info.render.calls);};
 const request=()=>{if(!frame&&!disposed&&visible&&!document.hidden)frame=requestAnimationFrame(render);};
 const resize=()=>{const r=host.getBoundingClientRect();width=r.width;height=r.height;if(!width||!height)return;renderer.setPixelRatio(Math.min(window.devicePixelRatio,width<600?1.35:1.75));renderer.setSize(width,height);camera.aspect=width/height;camera.fov=width<600?37:32;camera.updateProjectionMatrix();request();};
 const observer=new ResizeObserver(resize);observer.observe(host);
 
 const visibility=()=>{if(!document.hidden)request();};document.addEventListener('visibilitychange',visibility);
 const lost=(event:Event)=>{event.preventDefault();onFailure();};renderer.domElement.addEventListener('webglcontextlost',lost);
 resize();
 return { loseContext(){renderer.forceContextLoss();}, update(p:number,active=true){const changed=p!==progress||visible!==active;visible=active;progress=p;if(changed)request();}, dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',visibility);renderer.domElement.removeEventListener('webglcontextlost',lost);duct.dispose();ground.geometry.dispose();(ground.material as T.Material).dispose();env.dispose();renderer.dispose();renderer.domElement.remove();delete host.dataset.ready;} };
}

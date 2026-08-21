'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const canvas = canvasRef.current!;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050807,0.025);
    const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
    camera.position.z=30;
    const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(innerWidth,innerHeight);

    const count=140;
    const pos = new Float32Array(count*3);
    for(let i=0;i<count*3;i++) pos[i]=(Math.random()-0.5)*60;
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.PointsMaterial({color:0x00C878,size:0.18,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending});
    const points=new THREE.Points(geo,mat); scene.add(points);

    const lineGeo=new THREE.BufferGeometry();
    const lineMat=new THREE.LineBasicMaterial({color:0x00C878,transparent:true,opacity:0.15});
    const lines=new THREE.LineSegments(lineGeo,lineMat); scene.add(lines);

    let mx=0,my=0;
    addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-0.5)*0.5;my=(e.clientY/innerHeight-0.5)*0.5});
    const clock=new THREE.Clock();
    let raf=requestAnimationFrame(function anim(){
      raf=requestAnimationFrame(anim);
      const t=clock.getElapsedTime();
      points.rotation.y=t*0.05+mx; points.rotation.x=t*0.02+my;
      const p=geo.attributes.position as THREE.BufferAttribute;
      const lp:number[]=[];
      for(let i=0;i<count;i++) for(let j=i+1;j<count;j++){
        const dx=p.getX(i)-p.getX(j),dy=p.getY(i)-p.getY(j),dz=p.getZ(i)-p.getZ(j);
        if(Math.sqrt(dx*dx+dy*dy+dz*dz)<7){lp.push(p.getX(i),p.getY(i),p.getZ(i),p.getX(j),p.getY(j),p.getZ(j))}
      }
      lineGeo.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));
      lines.rotation.copy(points.rotation);
      camera.position.z=30-scrollY*0.002;
      renderer.render(scene,camera);
    });
    addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
}

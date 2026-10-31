/* eco_v0.2.0.js — Eco-Gazebo Raudhah v0.2.0 (aplikasi Adiwiyata; dipisah dari Kelas Raudhah v0.22.0 pada 31/10/2026).
   Seluruh kode di SATU (function(){ … })(). Blok "UMUM v0.22.0" disalin APA ADANYA dari Kelas Raudhah index_uji_v0.22.0.html
   (diperiksa uji U-SINKRON terhadap halaman Kelas Raudhah terbaru). Blok "PINDAH v0.22.0" = kode Adiwiyata/halaman yang dipindah;
   perubahannya dicatat di kepala blok. Server Apps Script, spreadsheet, akun, dan GOOGLE_CLIENT_ID SAMA dengan Kelas Raudhah.
   Urutan muat: halaman (login + laci + panel) tampil dulu -> berkas ini -> aframe-v1.5.0.min.js (terpisah, di-cache browser) -> adegan 3D. */
(function(){
/* v0.1.1: SERVER_MIN v0.20.2 = Code.gs ASLI; logika Code v0.20.2 s.d. v0.22.0 sama persis (hanya nomor versi; uji S114) */
var VERSI='v0.2.0', SERVER_MIN='v0.20.2', bagian='awal', srv='', mode='', SRV_GALAT=false;
var API_URL='https://script.google.com/macros/s/AKfycbxhPo2-GvJClHxNav_TMjN4sFiLCzyi8yTFvbIQT62yUQ8NPBaAaIZCbTN5fmN85qc/exec';
var GOOGLE_CLIENT_ID='503152505847-niasbva2uksvum09lsm85j8pursok0b8.apps.googleusercontent.com';
/* alamat Kelas Raudhah HALAMAN ASLI (halaman UJI dan ASLI memakai alamat masing-masing; lihat panduan pasang) */
var URL_RAUDHAH='https://diahayu88.github.io/kelas_raudhah/';
/* v0.1.2: beranda (landing page penghubung) */
var URL_HOME='https://diahayu88.github.io/';
var BERKAS_AFRAME='aframe-v1.5.0.min.js';
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: kualitas */
var sentuh=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
/* v0.10.14 KUALITAS: 'tinggi' | 'hemat'. Pilihan pengguna (otomatis/tinggi/hemat) disimpan di perangkat ini saja.
   Otomatis = hemat di layar sentuh, atau bila rata-rata < 24 FPS selama 5 detik (hanya turun, tidak naik lagi sendiri). */
var KUAL_PILIH='otomatis',KUALITAS='tinggi',GERAK_KURANG=false,LAMPU=[],HIAS_T=[],FPS={n:0,t0:0,rata:0,turun:false,mulai:0};
try{KUAL_PILIH=localStorage.getItem('kr_kualitas')||'otomatis';}catch(e){}
if(['otomatis','tinggi','hemat'].indexOf(KUAL_PILIH)<0)KUAL_PILIH='otomatis';
try{var mqR=window.matchMedia('(prefers-reduced-motion: reduce)');GERAK_KURANG=!!mqR.matches;if(mqR.addEventListener)mqR.addEventListener('change',function(e){GERAK_KURANG=!!e.matches;});}catch(e){}
function kualitasEfektif(){return KUAL_PILIH==='otomatis'?((sentuh||FPS.turun)?'hemat':'tinggi'):KUAL_PILIH;}
function terapkanKualitas(){KUALITAS=kualitasEfektif();
 try{if(sc&&sc.renderer)sc.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,KUALITAS==='hemat'?1.25:(sentuh?1.5:2)));}catch(e){}
 LAMPU.forEach(function(l){try{var o=l.getObject3D('light');if(o)o.visible=(KUALITAS==='tinggi');}catch(e){}});
 HIAS_T.forEach(function(m){m.visible=(KUALITAS==='tinggi'&&!GERAK_KURANG);});
 var b=document.getElementById('bKual');if(b)b.textContent='Kualitas grafis: '+({otomatis:'Otomatis',tinggi:'Tinggi',hemat:'Hemat'}[KUAL_PILIH])+(KUAL_PILIH==='otomatis'?' (sekarang '+(KUALITAS==='hemat'?'Hemat':'Tinggi')+')':'');
 segarKual();
}
function ukurFps(t){if(!FPS.mulai||Date.now()<FPS.mulai||panelBuka||document.hidden){FPS.t0=0;return;}
 if(!FPS.t0){FPS.t0=t;FPS.n=0;return;}FPS.n++;var d=t-FPS.t0;
 if(d>=5000){FPS.rata=FPS.n*1000/d;FPS.t0=t;FPS.n=0;if(FPS.rata<24&&!FPS.turun&&KUAL_PILIH==='otomatis'){FPS.turun=true;terapkanKualitas();}}}

/* akhir UMUM kualitas */

var elV=document.getElementById('ver');
function setV(ok){elV.textContent='Eco-Gazebo '+VERSI+srv+(ok?'':' · error pada '+bagian);elV.className=(ok?'':'err')+(mode?(ok?'':' ')+mode:'');tinggiV();}
function tinggiV(){try{document.documentElement.style.setProperty('--verH',(mode?elV.offsetHeight+8:0)+'px');}catch(e){}}
addEventListener('resize',tinggiV);
setV(true);
window.addEventListener('error',function(){setV(false);});
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: kontrol */
var KEY={},TURN={},joy={x:0,y:0},tLook={};
addEventListener('keydown',function(e){if(panelBuka||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;var k=e.key.toLowerCase();KEY.shift=e.shiftKey;if(['w','a','s','d','q','e','arrowup','arrowdown','arrowleft','arrowright'].indexOf(k)<0)return;KEY[k]=true;if(k.indexOf('arrow')===0){e.preventDefault();e.stopImmediatePropagation();}},true);
addEventListener('keyup',function(e){KEY.shift=e.shiftKey;delete KEY[e.key.toLowerCase()];},true);
addEventListener('blur',function(){for(var k in KEY)delete KEY[k];TURN.l=TURN.r=false;joy.x=joy.y=0;});
(function bangunUI(){
 var st=document.createElement('style');st.textContent='#joy{position:fixed;left:calc(18px + env(safe-area-inset-left,0px));bottom:calc(44px + env(safe-area-inset-bottom,0px));width:92px;height:92px;border-radius:50%;background:rgba(255,255,255,.3);border:2px solid rgba(255,255,255,.75);z-index:25;touch-action:none;display:none}#knob{position:absolute;left:24px;top:24px;width:44px;height:44px;border-radius:50%;background:rgba(47,111,79,.9)}.bp{position:fixed;bottom:calc(70px + env(safe-area-inset-bottom,0px));width:58px;height:58px;border-radius:50%;border:0;font-size:26px;background:rgba(255,255,255,.8);color:#1f2933;z-index:25;touch-action:none;display:none}#bBer{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(60px + env(safe-area-inset-bottom,0px));z-index:25;padding:10px 22px;border:0;border-radius:22px;font-size:16px;background:var(--ac);color:var(--acT);display:none}';
 document.head.appendChild(st);
 var j=document.createElement('div');j.id='joy';j.setAttribute('aria-hidden','true');j.innerHTML='<div id="knob"></div>';document.body.appendChild(j);
 var bb=document.createElement('button');bb.id='bBer';bb.textContent='Berdiri';bb.onclick=function(){berdiri();};document.body.appendChild(bb);
 if(sentuh)j.style.display='block';
 /* v0.17.0: pilihan kualitas dan petunjuk kontrol ada di Pengaturan (laci menu). */
 var kn=document.getElementById('knob'),jid=null;
 function jset(e){var r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,m=Math.hypot(dx,dy),R=r.width/2-8;if(m>R){dx*=R/m;dy*=R/m;}joy.x=dx/R;joy.y=-dy/R;kn.style.transform='translate('+dx+'px,'+dy+'px)';}
 j.addEventListener('pointerdown',function(e){jid=e.pointerId;try{j.setPointerCapture(jid);}catch(x){}jset(e);e.preventDefault();});
 j.addEventListener('pointermove',function(e){if(e.pointerId===jid)jset(e);});
 function jl(e){if(e.pointerId!==jid)return;jid=null;joy.x=joy.y=0;kn.style.transform='';}
 j.addEventListener('pointerup',jl);j.addEventListener('pointercancel',jl);
 document.addEventListener('touchstart',function(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(e.target.closest&&e.target.closest('#joy,.bp,#panel,#bBer,#hud,#mBtn,#laciTirai,#konfK,#bVRx'))continue;tLook[t.identifier]={x:t.clientX,y:t.clientY};}},{passive:true});
 var pinchD=0,FOV=70;
 function setFov(v){FOV=Math.max(35,Math.min(95,v));var c=cam&&cam.getObject3D('camera');if(c){c.fov=FOV;c.updateProjectionMatrix();}}
 document.addEventListener('touchmove',function(e){var lc=cam&&cam.components['look-controls'],ids=Object.keys(tLook);
  for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i],s=tLook[t.identifier];if(s){s.dx=t.clientX-s.x;s.dy=t.clientY-s.y;s.x=t.clientX;s.y=t.clientY;}}
  if(panelBuka)return;
  if(ids.length>=2){var a=tLook[ids[0]],b=tLook[ids[1]],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinchD>0&&d>0)setFov(FOV*pinchD/d);pinchD=d;return;}
  pinchD=0;if(ids.length===1&&lc&&lc.yawObject){var s2=tLook[ids[0]];if(s2.dx){lc.yawObject.rotation.y-=s2.dx*0.005;}if(s2.dy){lc.pitchObject.rotation.x=Math.max(-1.3,Math.min(1.3,lc.pitchObject.rotation.x-s2.dy*0.005));}s2.dx=s2.dy=0;}
 },{passive:true});
 ['touchend','touchcancel'].forEach(function(n){document.addEventListener(n,function(e){for(var i=0;i<e.changedTouches.length;i++)delete tLook[e.changedTouches[i].identifier];pinchD=0;},{passive:true});});
 addEventListener('wheel',function(e){if(panelBuka||(e.target.closest&&e.target.closest('#panel')))return;setFov(FOV+(e.deltaY>0?4:-4));},{passive:true});
})();


/* akhir UMUM kontrol */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: vr */
/* ===== v0.15.1: tombol VR dipindah ke kanan bawah (v0.15.0 tertutup HUD bila nama siswa panjang di HP tegak).
   v0.15.0: Mode VR untuk HP, SATU layar penuh (v0.14.0 sempat memakai layar terbelah; dihapus atas permintaan pengguna) =====
   Tombol VR (kanan bawah, hanya layar sentuh): layar penuh, menoleh dengan memutar HP (giroskop), titik bidik di tengah.
   Memilih: ketuk seperti biasa, ATAU tatap 1,5 detik (meja = duduk + panel; lantai = berjalan; saat duduk menunduk jauh = berdiri; papan = buka).
   Joystick dan HUD tetap ada. Tanpa WebXR, tanpa pustaka baru. */
var VR={on:false,ori:null,yaw0:null,yawSet:null,wl:null,fs:false,gz:{el:null,t0:0,kunci:0},tR:0,izin:''};
var VR_FUSE=1500,VR_BERDIRI={};
function vrOri(e){if(e.alpha===null&&e.beta===null&&e.gamma===null)return;VR.ori={a:e.alpha||0,b:e.beta||0,g:e.gamma||0};}
function vrDot(p){var d=document.getElementById('vrDot');if(d)d.style.setProperty('--p',String(p));}
function vrTick(t){
 if(!VR.on||!cam)return;var lc=cam.components['look-controls'];if(!lc||!lc.yawObject)return;
 if(VR.ori){
  var T=AFRAME.THREE,d=Math.PI/180;
  if(!VR.q){VR.e=new T.Euler();VR.e2=new T.Euler();VR.q=new T.Quaternion();VR.q0=new T.Quaternion();VR.q1=new T.Quaternion(-Math.sqrt(0.5),0,0,Math.sqrt(0.5));VR.z=new T.Vector3(0,0,1);}
  var so=(screen.orientation&&typeof screen.orientation.angle==='number')?screen.orientation.angle:(Number(window.orientation)||0);
  VR.e.set(VR.ori.b*d,VR.ori.a*d,-VR.ori.g*d,'YXZ');VR.q.setFromEuler(VR.e);VR.q.multiply(VR.q1);VR.q.multiply(VR.q0.setFromAxisAngle(VR.z,-so*d));
  VR.e2.setFromQuaternion(VR.q,'YXZ');
  /* geser layar / Q-E / duduk mengubah arah dari luar: catat selisihnya supaya giroskop tidak membatalkannya */
  if(VR.yaw0===null)VR.yaw0=VR.e2.y-lc.yawObject.rotation.y;
  else if(VR.yawSet!==null&&Math.abs(lc.yawObject.rotation.y-VR.yawSet)>1e-6)VR.yaw0-=lc.yawObject.rotation.y-VR.yawSet;
  lc.yawObject.rotation.y=VR.e2.y-VR.yaw0;VR.yawSet=lc.yawObject.rotation.y;
  lc.pitchObject.rotation.x=Math.max(-1.45,Math.min(1.45,VR.e2.x));
 }
 if(panelBuka)return;
 if(t-VR.tR<80)return;VR.tR=t;
 var hit=vrTatap(),g=VR.gz,now=Date.now();
 /* saat duduk: menunduk jauh (melihat kaki) = berdiri, apa pun yang ditatap (kursi dan meja satu kelompok) */
 if(duduk&&lc.pitchObject.rotation.x<-0.9)hit={el:VR_BERDIRI,x:null};
 var el=hit&&hit.el;
 if(!el||el!==g.el){g.el=el;g.t0=now;vrDot(0);return;}
 if(now<g.kunci){vrDot(0);return;}
 var p=Math.min(1,(now-g.t0)/VR_FUSE);vrDot(p);
 if(p>=1){g.kunci=now+1200;g.t0=now+1200;vrDot(0);
  if(el===VR_BERDIRI){berdiri();return;}
  el.dispatchEvent(new CustomEvent('click',{detail:{intersection:hit.x,gaze:true}}));}
}
function vrTatap(){
 var T=AFRAME.THREE;if(!VR.rc){VR.rc=new T.Raycaster();VR.rc.far=12;VR.v0=new T.Vector2(0,0);}
 var c=sc.camera;if(!c)return null;VR.rc.setFromCamera(VR.v0,c);
 var objs=[],els=sc.querySelectorAll('.klik');for(var i=0;i<els.length;i++){if(els[i].object3D&&els[i].object3D.visible)objs.push(els[i].object3D);}
 var h=VR.rc.intersectObjects(objs,true);
 for(var k=0;k<h.length;k++){var o=h[k].object;while(o&&!(o.el&&o.el.classList&&o.el.classList.contains('klik')))o=o.parent;if(o)return {el:o.el,x:h[k]};}
 return null;
}
function vrLayarPenuh(){
 var el=document.documentElement,f=el.requestFullscreen||el.webkitRequestFullscreen;
 if(!f)return Promise.resolve(false);
 try{var r=f.call(el,{navigationUI:'hide'});return Promise.resolve(r).then(function(){return true;},function(){return false;});}catch(e){return Promise.resolve(false);}
}
function masukVR(){
 if(VR.on)return;
 var izin=Promise.resolve('granted');
 try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function')izin=DeviceOrientationEvent.requestPermission().catch(function(){return 'denied';});}catch(e){}
 var fs=vrLayarPenuh();
 VR.on=true;VR.ori=null;VR.yaw0=null;VR.yawSet=null;VR.gz={el:null,t0:0,kunci:0};
 addEventListener('deviceorientation',vrOri);document.body.classList.add('vr');
 fs.then(function(ok){VR.fs=ok;});
 izin.then(function(s){VR.izin=s;if(s!=='granted')vrPesan('Izin gerak HP ditolak. Menoleh dengan menggeser layar.');});
 try{if(navigator.wakeLock)navigator.wakeLock.request('screen').then(function(w){VR.wl=w;},function(){});}catch(e){}
 setTimeout(function(){if(VR.on&&!VR.ori)vrPesan('Sensor gerak tidak terbaca. Menoleh dengan menggeser layar.');},2500);
 vrPesan('Putar HP untuk menoleh. Ketuk, atau tatap 1,5 detik untuk memilih. Saat duduk, menunduk untuk berdiri.');
 segarTombolVR();
}
function keluarVR(diam){
 if(!VR.on)return;VR.on=false;removeEventListener('deviceorientation',vrOri);
 document.body.classList.remove('vr');vrDot(0);
 try{if(VR.wl){VR.wl.release();VR.wl=null;}}catch(e){}
 try{var fe=document.fullscreenElement||document.webkitFullscreenElement;if(fe&&!diam){(document.exitFullscreen||document.webkitExitFullscreen).call(document);}}catch(e){}
 VR.fs=false;segarTombolVR();
}
function vrPesan(t){var m=document.getElementById('vrPesan');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(VR.tP);VR.tP=setTimeout(function(){m.style.display='none';},4500);}
function segarTombolVR(){var b=document.getElementById('bVR');if(!b)return;setLabel(b,VR.on?'Keluar VR':'Mode VR');b.setAttribute('aria-pressed',VR.on?'true':'false');}
function vrFsBerubah(){var fe=document.fullscreenElement||document.webkitFullscreenElement;if(!fe&&VR.on&&VR.fs)keluarVR(true);}
document.addEventListener('fullscreenchange',vrFsBerubah);document.addEventListener('webkitfullscreenchange',vrFsBerubah);
(function bangunVR(){
 var st=document.createElement('style');
 st.textContent='#bVR{display:none}#bVRx{position:fixed;right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(48px + env(safe-area-inset-bottom,0px));z-index:23;min-height:56px;padding:0 18px;border-radius:28px;border:0;background:#1f4f99;color:#fff;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.25);display:none}body.vr #bVRx{display:block}body.vr.laciBuka #bVRx{display:none}'+
 '#vrPesan{position:fixed;left:50%;top:calc(60px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:24;max-width:min(90vw,520px);background:rgba(0,0,0,.72);color:#fff;font-size:14px;padding:8px 12px;border-radius:10px;display:none;text-align:center;pointer-events:none}'+
 '#vrDot{position:fixed;left:50%;top:50%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;z-index:19;pointer-events:none;display:none;background:radial-gradient(circle,#fff 0 3px,rgba(0,0,0,.6) 3.5px 4.5px,transparent 5px),conic-gradient(#ffd54f calc(var(--p,0)*360deg),rgba(255,255,255,.35) 0);-webkit-mask:radial-gradient(circle,#000 0 5px,transparent 5.5px 7px,#000 7.5px);mask:radial-gradient(circle,#000 0 5px,transparent 5.5px 7px,#000 7.5px)}'+
 'body.vr #vrDot{display:block}body.vr #hint{display:none!important}';
 document.head.appendChild(st);
 var b=document.createElement('button');b.id='bVR';b.type='button';b.textContent='Mode VR';b.setAttribute('aria-pressed','false');
 var bx=document.createElement('button');bx.id='bVRx';bx.type='button';bx.textContent='Keluar VR';bx.onclick=function(e){e.stopPropagation();keluarVR();};
 var ps=document.createElement('div');ps.id='vrPesan';ps.setAttribute('role','status');
 var dt=document.createElement('div');dt.id='vrDot';
 [b,bx,ps,dt].forEach(function(x){document.body.appendChild(x);});
 b.onclick=function(e){e.stopPropagation();if(VR.on)keluarVR();else masukVR();};
})();


/* akhir UMUM vr */

var dunia,rig,cam,sc,duduk=null,panelBuka=false;
var TUJUAN=null,KECEPATAN_JALAN=1.0,KLIK_LANTAI=0;
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: 3d-dasar */
function E(tag,at,par){var e=document.createElement(tag);for(var k in at)e.setAttribute(k,at[k]);(par||dunia).appendChild(e);return e;}
function B(x,y,z,w,h,d,c,par,rot){var e=E('a-entity',{position:x+' '+y+' '+z},par);e.setAttribute('geometry',{primitive:'box',width:w,height:h,depth:d});e.setAttribute('material',{color:c,roughness:0.9});if(rot)e.setAttribute('rotation',rot);return e;}
function C(x,y,z,r,h,c,par){var e=E('a-entity',{position:x+' '+y+' '+z},par);e.setAttribute('geometry',{primitive:'cylinder',radius:r,height:h,segmentsRadial:16});e.setAttribute('material',{color:c,roughness:0.9});return e;}
function S(x,y,z,r,c,par,sy){var e=E('a-entity',{position:x+' '+y+' '+z},par);e.setAttribute('geometry',{primitive:'sphere',radius:r,segmentsWidth:12,segmentsHeight:8});e.setAttribute('material',{color:c,roughness:1});if(sy)e.setAttribute('scale','1 '+sy+' 1');return e;}
function lbl(t,c,fs,W){var cv=document.createElement('canvas');cv.width=W||512;cv.height=128;var g=cv.getContext('2d');g.fillStyle=c;g.fillRect(0,0,cv.width,128);g.fillStyle='#fff';g.font='bold '+(fs||60)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,cv.width/2,68);return cv.toDataURL();}
function lblT(t,c,fs,W){var cv=document.createElement('canvas');cv.width=W||512;cv.height=128;var g=cv.getContext('2d');g.fillStyle=c;g.font='bold '+(fs||60)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,cv.width/2,68);return cv.toDataURL();}
function planeT(x,y,z,w,h,ry,t,c,par,fs,W){var e=E('a-entity',{position:x+' '+y+' '+z,rotation:'0 '+ry+' 0'},par);e.setAttribute('geometry',{primitive:'plane',width:w,height:h});e.setAttribute('material',{src:lblT(t,c,fs,W),shader:'flat',transparent:true,side:'double'});return e;}
function plane(x,y,z,w,h,ry,t,c,par,fs,W){var e=E('a-entity',{position:x+' '+y+' '+z,rotation:'0 '+ry+' 0'},par);e.setAttribute('geometry',{primitive:'plane',width:w,height:h});e.setAttribute('material',{src:lbl(t,c,fs,W),shader:'flat',side:'double'});return e;}

/* akhir UMUM 3d-dasar */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: klik */
function klik(el,info){el.classList.add('klik');if(info&&info.t==='lantai')el.classList.add('lantai');el.addEventListener('click',function(ev){aksi(info,ev);});}

/* akhir UMUM klik */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: 3d-gabung */
function kanvas(w,h,f){var c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c;}
function teksturK(cv){var T=AFRAME.THREE,t=new T.CanvasTexture(cv);if(T.SRGBColorSpace)t.colorSpace=T.SRGBColorSpace;return t;}
function quads(list){var T=AFRAME.THREE,pos=new Float32Array(list.length*18),uv=new Float32Array(list.length*12),k=0,q=0;
 list.forEach(function(o){var P=o.p,U=o.u,V=o.v,r=o.uv||[0,0,1,1];
  [[-1,-1,r[0],r[1]],[1,-1,r[2],r[1]],[1,1,r[2],r[3]],[-1,-1,r[0],r[1]],[1,1,r[2],r[3]],[-1,1,r[0],r[3]]].forEach(function(s){
   pos[k++]=P[0]+U[0]*s[0]+V[0]*s[1];pos[k++]=P[1]+U[1]*s[0]+V[1]*s[1];pos[k++]=P[2]+U[2]*s[0]+V[2]*s[1];uv[q++]=s[2];uv[q++]=s[3];});});
 var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));g.computeVertexNormals();return g;}
/* v0.21.0: banyak kotak/silinder digabung menjadi SATU mesh berwarna per titik (1 draw call), seperti mejaKokoh dan tanaman. */
function gabung(nama,isi,mat,uv){var T=AFRAME.THREE,bag=[],mt=new T.Matrix4();
 function tambah(geo,c,x,y,z,rx,ry,rz,sx,sy,sz){geo=geo.index?geo.toNonIndexed():geo;mt.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx||0,ry||0,rz||0)),new T.Vector3(sx||1,sy||1,sz||1));geo.applyMatrix4(mt);var n=geo.attributes.position.count,cl=new T.Color(c),a=new Float32Array(n*3);for(var k=0;k<n;k++){a[k*3]=cl.r;a[k*3+1]=cl.g;a[k*3+2]=cl.b;}geo.setAttribute('color',new T.BufferAttribute(a,3));if(!uv)geo.deleteAttribute('uv');bag.push(geo);}
 /* v0.21.1: K kotak (ry, rz, rx), Cy silinder, Bl bola rendah (sy = pipih), Tr segitiga (urutan titik berlawanan jarum jam = menghadap penonton) */
 isi(function(w,h,d,x,y,z,c,ry,rz,rx){tambah(new T.BoxGeometry(w,h,d),c,x,y,z,rx,ry,rz);},function(r,h,x,y,z,c,sg,rx,rz){tambah(new T.CylinderGeometry(r,r,h,sg||16),c,x,y,z,rx,0,rz);},
  function(r,x,y,z,c,sy){tambah(new T.IcosahedronGeometry(r,r<=0.1?0:1),c,x,y,z,0,0,0,1,sy||1,1);}, /* v0.22.0: bola kecil (kerikil, bunga) 20 segitiga */
  function(a,b,d,c){var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a.concat(b,d),3));g.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,0.5,1],2));g.computeVertexNormals();tambah(g,c,0,0,0);});
 var tot=0,off=0;bag.forEach(function(g){tot+=g.attributes.position.count;});var P=new Float32Array(tot*3),N=new Float32Array(tot*3),C=new Float32Array(tot*3),U=uv?new Float32Array(tot*2):null;
 bag.forEach(function(g){P.set(g.attributes.position.array,off*3);N.set(g.attributes.normal.array,off*3);C.set(g.attributes.color.array,off*3);if(U)U.set(g.attributes.uv.array,off*2);off+=g.attributes.position.count;g.dispose();});
 var gm=new T.BufferGeometry();gm.setAttribute('position',new T.BufferAttribute(P,3));gm.setAttribute('normal',new T.BufferAttribute(N,3));gm.setAttribute('color',new T.BufferAttribute(C,3));if(U)gm.setAttribute('uv',new T.BufferAttribute(U,2));
 return pasangM(nama,gm,mat||new T.MeshStandardMaterial({vertexColors:true,roughness:0.9}));}
function pasangM(nama,geo,mat,tinggiSaja){var e=E('a-entity',{}),m=new AFRAME.THREE.Mesh(geo,mat);m.name=nama;m.userData.el=e;e.setObject3D('mesh',m);if(tinggiSaja){HIAS_T.push(m);m.visible=(KUALITAS==='tinggi'&&!GERAK_KURANG);}return m;}
function matT(tx,aditif,op){var T=AFRAME.THREE;return new T.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,side:T.DoubleSide,opacity:op||1,blending:aditif?T.AdditiveBlending:T.NormalBlending,polygonOffset:true,polygonOffsetFactor:-2,forceSinglePass:true});}

/* akhir UMUM 3d-gabung */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: panel */
var PNL=0,TPNL=0;
/* Pelindung klik-tembus: klik yang tiba <500 ms setelah panel dibuka/diisi ulang diabaikan (isi dari cache muncul seketika). */
function terlaluCepat(a){return Date.now()-TPNL<500;}
/* v0.10.12: panel = dialog. Warna judul digelapkan sampai kontras teks putih >= 4,5:1; fokus pindah ke judul panel lalu kembali ke pemicu saat ditutup; Esc menutup; Tab berputar di dalam panel. */
var PEMICU=null;
function lumi(c){var m=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);if(!m)return null;return [m[1],m[2],m[3]].map(function(h){var v=parseInt(h,16)/255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});}
function warnaKepala(c){var r=lumi(c);if(!r)return c;var k=0;while(k<30){var L=0.2126*r[0]+0.7152*r[1]+0.0722*r[2];if(1.05/(L+0.05)>=4.6)break;r=r.map(function(v){return v*0.85;});k++;}
 return '#'+r.map(function(v){v=v<=0.0031308?v*12.92:1.055*Math.pow(v,1/2.4)-0.055;return ('0'+Math.round(Math.max(0,Math.min(1,v))*255).toString(16)).slice(-2);}).join('');}
function bukaPanel(jud,warna,isi){PNL++;TPNL=Date.now();
 var pn=document.getElementById('panel'),kh=document.getElementById('kh');if(pn.style.display!=='flex'){PEMICU=document.activeElement;lembarPenuh(false);}
 kh.textContent=jud;document.getElementById('khBar').style.background=warnaKepala(warna);
 document.getElementById('kb').innerHTML=isi;pn.style.display='flex';
 panelBuka=true;try{if(sc.renderer)sc.renderer.setAnimationLoop(null);}catch(e){}
 try{kh.focus({preventScroll:true});}catch(e){}
}
function tutupPanel(){
 document.getElementById('panel').style.display='none';panelBuka=false;
 try{if(sc.renderer)sc.renderer.setAnimationLoop(sc.render);}catch(e){}
 var t=PEMICU;PEMICU=null;if(t&&t!==document.body&&t.focus&&document.contains(t)){try{t.focus({preventScroll:true});}catch(e){}}
}
function fokusPanel(){var k=document.getElementById('kartu');return Array.prototype.filter.call(k.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])'),function(x){return x.offsetParent!==null||x===document.activeElement;});}
document.addEventListener('keydown',function(e){
 if(document.getElementById('panel').style.display!=='flex')return;
 if(e.key==='Escape'||e.key==='Esc'){e.preventDefault();tutupPanel();return;}
 if(e.key!=='Tab')return;var f=fokusPanel(),k=document.getElementById('kartu'),ak=document.activeElement;if(!f.length){e.preventDefault();return;}
 if(e.shiftKey&&(ak===f[0]||ak===document.getElementById('kh')||!k.contains(ak))){e.preventDefault();f[f.length-1].focus();}
 else if(!e.shiftKey&&(ak===f[f.length-1]||!k.contains(ak))){e.preventDefault();f[0].focus();}
});
/* v0.10.11: tab tersembunyi = berhenti menggambar (setAnimationLoop(null), bukan scene.pause); terlihat lagi = lanjut bila tidak ada panel/login terbuka. */
document.addEventListener('visibilitychange',function(){try{if(!sc||!sc.renderer)return;if(document.hidden)sc.renderer.setAnimationLoop(null);else if(!panelBuka)sc.renderer.setAnimationLoop(sc.render);}catch(e){}});
function berdiri(){
 if(!duduk)return;var p=rig.object3D.position;p.set(duduk.x,0,duduk.z+1.5);duduk=null;
}

/* akhir UMUM panel */

/* Eco: lantai/tanah = berjalan pelan (klik 2x = berhenti), tong = lapor (sama dengan Kelas Raudhah v0.22.0), gerbang = pindah ke Kelas Raudhah, papanAdi = panel Adiwiyata */
function aksi(info,ev){
 if(panelBuka)return;
 if(info.t==='lantai'){var kn=Date.now();if(kn-KLIK_LANTAI<450){TUJUAN=null;KLIK_LANTAI=0;return;}KLIK_LANTAI=kn;var q=ev.detail&&ev.detail.intersection;if(!q)return;if(duduk){if(ev.detail&&ev.detail.gaze)return;berdiri();}TUJUAN={x:q.point.x,z:q.point.z,t:kn,d:1e9};return;}
 if(info.t==='tong'){var qt=ev.detail&&ev.detail.intersection,jt=qt?tongDari(qt.point.x):'';if(jt==='KRT_QR')jt='KRT';if(jt==='RES'){bukaPanel('Tong residu','#616161','<p>Tong <b>abu-abu</b> untuk <b>residu</b>: sampah yang tidak bisa didaur ulang atau dikompos (bungkus berlapis, popok, puntung, styrofoam kotor).</p><p>Residu tidak dilaporkan untuk poin. Kurangi residu dengan membawa wadah makan dan botol minum sendiri.</p>');}else if(jt){LP.jenis=jt;bukaAdi('');}return;}
 if(info.t==='gerbang'){TUJUAN=null;konfRaudhah();return;}
 if(info.t==='papanAdi'){TUJUAN=null;bukaAdi();return;} /* v0.2.0: papan laporan Adiwiyata di dalam gazebo */
}
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: server-sesi */
var TOKEN='',SAYA=null,credTmp='',LAT=null,MP_KODE={Matematika:'MATH',Sains:'SAINS',Bahasa:'BHS',Agama:'AGAMA',Seni:'SENI'};
var BERJALAN='',SELESAI={},KODE_NAMA={MATH:'Math',SAINS:'Science',BHS:'Bahasa',AGAMA:'Agama',SENI:'Seni'};
try{TOKEN=sessionStorage.getItem('kr_t')||'';}catch(e){}
function esc(s){return String(s===undefined||s===null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function el(id){return document.getElementById(id);}
var KC={},KCP={},KCG=0;
function simpanToken(t){TOKEN=t||'';kcBersih();try{if(t)sessionStorage.setItem('kr_t',t);else sessionStorage.removeItem('kr_t');}catch(e){}}
function gs(aksi,data){
 var b={aksi:aksi,token:TOKEN};for(var k in (data||{}))b[k]=data[k];
 return fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(b)})
 .then(function(r){return r.json();})
 .catch(function(){return {ok:false,error:'Server tidak terjangkau.',kode:'JARINGAN'};})
 .then(function(j){if(!KC_BACA[aksi])kcBersih();if(j&&j.kode==='AUTH'&&TOKEN){simpanToken('');el('panel').style.display='none';tampilLogin('Sesi Anda berakhir (lama tidak aktif atau server diperbarui). Silakan masuk lagi; poin yang sudah tersimpan tetap aman.');}return j;});
}
var KC_BACA={papanPeringkat:1,ping:1,saya:1,statusAI:1,ambilDraf:1,ambilMateri:1,progresSaya:1,daftarKelas:1,daftarDraf:1,progresKelas:1,daftarSiswa:1,daftarGuru:1,lihatLog:1,ambilPengaturan:1,infoAdiwiyata:1,daftarKader:1};
function kcBersih(){KC={};KCP={};KCG++;}
function hapusSg(){Array.prototype.forEach.call(document.querySelectorAll('#sg,#sg2'),function(s){if(s.parentNode)s.parentNode.removeChild(s);});}
/* Baca dengan cache memori (hilang saat halaman dimuat ulang atau token berganti): tampilkan cache dulu, lalu segarkan dari server.
   pakai(j, dariCache, dataLama). Aksi tulis membersihkan seluruh cache (lihat gs). Tanpa penyimpanan permanen. */
function gsc(aksi,data,pakai){
 var k=TOKEN+'|'+aksi+'|'+JSON.stringify(data||{}),c=KC[k],g=KCG,p;
 if(c&&pakai)pakai(c,true,null);
 p=KCP[k];
 if(!p){p=KCP[k]=gs(aksi,data).then(function(j){if(KCP[k]===p)delete KCP[k];if(j&&j.ok&&g===KCG)KC[k]=j;return j;});}
 return p.then(function(j){if(pakai)pakai(j,false,c||null);return j;});
}
function prefetchBaca(a){if(!SAYA||SAYA.peran==='siswa')return;var k=TOKEN+'|'+a+'|{}';if(KC[k]||KCP[k])return;gsc(a,null,null);}
function fPoin(n){try{return Number(n).toLocaleString('id-ID');}catch(e){return String(n);}}

/* akhir UMUM server-sesi */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: idem */
function idemBaru(){var a=new Uint8Array(12);try{crypto.getRandomValues(a);}catch(e){for(var i=0;i<12;i++)a[i]=Math.floor(Math.random()*256);}return Array.prototype.map.call(a,function(x){return ('0'+x.toString(16)).slice(-2);}).join('');}

/* akhir UMUM idem */

/* Bagian Kelas Raudhah yang tidak ada di Eco (butirnya disembunyikan; dipanggil oleh blok UMUM login/laci). */
function segarProgres(){}function resetProgres(){}function bukaMeja(){}function bukaProgres(){}function bukaPapan(){}
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: login-laci */
function lerr(t){el('lerr').textContent=t||'';}
function tampilLogin(pesan){
 laciBuka(false);tutupKonf(false,true);if(el('mBtn'))el('mBtn').style.display='none';
 el('ovl').style.display='flex';lerr(pesan);el('hud').style.display='none';SAYA=null;panelBuka=true;try{el('ovlJ').focus({preventScroll:true});}catch(e){}
 try{if(sc&&sc.renderer)sc.renderer.setAnimationLoop(null);}catch(e){}
}
function tutupLogin(){
 el('ovl').style.display='none';panelBuka=false;
 try{if(sc&&sc.renderer)sc.renderer.setAnimationLoop(sc.render);}catch(e){}
}
/* ===== v0.17.0: SATU tombol menu (kiri atas) membuka LACI dari kiri.
   Isi laci: kartu profil (nama, peran, Poin & Bintang), Progres/Kelola, Papan Bintang, Adiwiyata, Mode VR (layar sentuh),
   Pengaturan (halaman di dalam laci: kualitas grafis bersegmen + petunjuk kontrol bergambar), Keluar (merah, dengan konfirmasi).
   Selama laci atau konfirmasi terbuka: tirai 45 %, joystick disembunyikan, gambar 3D dijeda (setAnimationLoop(null)).
   Panel informasi: lembar bawah 70 % (HP tegak, pegangan bisa ditarik hampir penuh) atau lembar kanan ~55 % (mendatar). */
var IK={
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',tutup:'<path d="M6 6l12 12M18 6L6 18"/>',
 progres:'<path d="M5 20V11M12 20V5M19 20v-6"/>',kelola:'<path d="M4 9h16v11H4zM8 9V6a4 4 0 0 1 8 0v3"/>',
 papan:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 adi:'<path d="M20 4c-9 0-15 5-15 12 0 1.5.4 2.8 1 4 1-5 5-9 10-10-4 2-7 5-8 10 7 0 12-6 12-16z"/>',
 vr:'<path d="M3 8h18v9h-6l-2-3h-2l-2 3H3z"/><circle cx="8" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/>',
 atur:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 kanan:'<path d="M9 6l6 6-6 6"/>',kiri:'<path d="M15 6l-6 6 6 6"/>',
 keluar:'<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
 geser:'<path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4"/>',joy:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
 meja:'<path d="M4 10h16v3H4zM6 13v6M18 13v6"/>',zoom:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M8.5 11h5M11 8.5v5"/>',
 lantai:'<path d="M12 21s-6-5.6-6-10a6 6 0 0 1 12 0c0 4.4-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
 kibor:'<path d="M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M8 14h8"/>'
};
function svgIk(n,u){u=u||22;return '<svg viewBox="0 0 24 24" width="'+u+'" height="'+u+'" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+IK[n]+'</svg>';}
function jadiItem(b,ik,lbl,kls){if(!b)return null;b.type='button';b.className='lI'+(kls?' '+kls:'');b.innerHTML='<span class="lIk">'+svgIk(ik)+'</span><span class="lLbl">'+lbl+'</span>'+(/\bsub\b/.test(kls||'')?'<span class="lPan">'+svgIk('kanan',18)+'</span>':'');b.removeAttribute('title');b.removeAttribute('aria-label');return b;}
function setLabel(b,t){var s=b&&b.querySelector('.lLbl');if(s)s.textContent=t;else if(b)b.textContent=t;}
var LACI={buka:false},KONF={lanjut:null,pemicu:null};
function jedaRender(){try{if(sc&&sc.renderer)sc.renderer.setAnimationLoop(null);}catch(e){}}
/* v0.19.1: saat panel/laci terbuka gambar 3D dijeda; bila HP diputar atau jendela berubah ukuran, kanvas dikosongkan browser.
   Gambar ulang SATU bingkai (tanpa melanjutkan putaran) supaya kelas tetap terlihat di balik panel. */
var GULANG=null;
function gambarSekali(){try{if(!sc||!sc.renderer||!sc.camera||document.hidden)return;if(!panelBuka)return;if(sc.resize)sc.resize();sc.renderer.render(sc.object3D,sc.camera);}catch(e){}}
function jadwalGambarUlang(){clearTimeout(GULANG);GULANG=setTimeout(gambarSekali,120);}
window.addEventListener('resize',jadwalGambarUlang);window.addEventListener('orientationchange',jadwalGambarUlang);
function lanjutRender(){if(panelBuka||document.hidden)return;try{if(sc&&sc.renderer)sc.renderer.setAnimationLoop(sc.render);}catch(e){}}
function terbukaLain(){var o=el('ovl'),k=el('konfK');return el('panel').style.display==='flex'||(!!o&&o.style.display==='flex')||(!!k&&k.classList.contains('on'));}
/* v0.20.2: saat laci dibuka, data Adiwiyata diambil di latar (sekali, cache memori) supaya panel Adiwiyata langsung tampil saat diketuk. */
function prefetchAdi(){try{if(!SAYA||!TOKEN)return;var k=TOKEN+'|infoAdiwiyata|{}';if(KC[k]||KCP[k])return;gsc('infoAdiwiyata',null,null);}catch(e){}}
function laciBuka(on){
 var h=el('hud'),m=el('mBtn');if(!h||!m)return;on=!!on;if(on===LACI.buka)return;
 LACI.buka=on;h.classList.toggle('buka',on);h.classList.remove('atur');el('hintBtn').setAttribute('aria-expanded','false');
 document.body.classList.toggle('laciBuka',on);m.setAttribute('aria-expanded',on?'true':'false');
 if(on){for(var k in KEY)delete KEY[k];for(var t in tLook)delete tLook[t];joy.x=joy.y=0;var kn=el('knob');if(kn)kn.style.transform='';
  panelBuka=true;jedaRender();try{el('laciX').focus({preventScroll:true});}catch(e){}prefetchAdi();}
 else{if(!terbukaLain())panelBuka=false;lanjutRender();}
}
function tutupLaciKeTombol(){laciBuka(false);try{el('mBtn').focus({preventScroll:true});}catch(e){}}
function bukaKonf(lanjut){var k=el('konfK');if(!k)return;KONF.lanjut=lanjut;KONF.pemicu=document.activeElement;k.classList.add('on');document.body.classList.add('konfBuka');el('kYa').disabled=false;panelBuka=true;jedaRender();try{el('kBatal').focus({preventScroll:true});}catch(e){}}
function tutupKonf(ya,diam){var k=el('konfK');if(!k||!k.classList.contains('on'))return;k.classList.remove('on');document.body.classList.remove('konfBuka');var f=KONF.lanjut,t=KONF.pemicu;KONF.lanjut=null;KONF.pemicu=null;
 if(!terbukaLain())panelBuka=false;lanjutRender();
 if(ya&&f){f();return;}if(!diam&&t&&t!==document.body&&t.focus&&document.contains(t)){try{t.focus({preventScroll:true});}catch(e){}}}
function segarKual(){['otomatis','tinggi','hemat'].forEach(function(v){var b=el('kual_'+v);if(b){var c=KUAL_PILIH===v;b.setAttribute('aria-checked',c?'true':'false');b.tabIndex=c?0:-1;}});}
function pilihKual(v){KUAL_PILIH=v;try{localStorage.setItem('kr_kualitas',v);}catch(x){}terapkanKualitas();}
function segarProfil(){
 if(!SAYA||!el('lNama'))return;var pr={siswa:'Siswa',guru:'Guru',pemilik:'Pemilik'}[SAYA.peran]||String(SAYA.peran||'');
 var nm=SAYA.juri&&SAYA.peran!=='siswa'?'Juri':String(SAYA.nama||'');
 el('lAv').textContent=SAYA.juri?'J':((nm.trim().charAt(0)||'?').toUpperCase());el('lNama').textContent=nm;el('lPeran').textContent=(SAYA.juri?'Juri · ':'')+pr;
 var sw=SAYA.peran==='siswa';el('lLenc').style.display=sw?'':'none';el('lPoin').textContent=fPoin(saldoSaya());el('lBin').textContent='★ '+fPoin(SAYA.bintang||0);
 el('lMini').textContent=sw?' · '+fPoin(saldoSaya())+' poin · ★ '+fPoin(SAYA.bintang||0):'';
}
function lembarPenuh(on){var k=el('kartu'),g=el('kPeg');if(!k||!g)return;k.classList.toggle('penuh',!!on);k.style.height='';g.setAttribute('aria-label',on?'Perkecil panel':'Perbesar panel');}
function pasangPegangan(){
 var g=el('kPeg'),k=el('kartu'),y0=0,h0=0,id=null,seret=false;
 g.onclick=function(){if(seret){seret=false;return;}lembarPenuh(!k.classList.contains('penuh'));};
 g.addEventListener('pointerdown',function(e){id=e.pointerId;y0=e.clientY;h0=k.getBoundingClientRect().height;seret=false;try{g.setPointerCapture(id);}catch(x){}k.classList.add('seret');});
 g.addEventListener('pointermove',function(e){if(e.pointerId!==id)return;var dy=e.clientY-y0;if(Math.abs(dy)>6)seret=true;if(seret)k.style.height=Math.max(120,Math.min(innerHeight-44,h0-dy))+'px';});
 function lepas(e){if(e.pointerId!==id)return;id=null;k.classList.remove('seret');var dy=e.clientY-y0,pn=k.classList.contains('penuh');k.style.height='';if(!seret)return;
  if(dy<-40)lembarPenuh(true);else if(dy>40){if(pn)lembarPenuh(false);else if(dy>140)tutupPanel();}
  if(e.type==='pointercancel')seret=false;}
 g.addEventListener('pointerup',lepas);g.addEventListener('pointercancel',lepas);
}
function bangunLaci(hd){
 var mb=document.createElement('button');mb.id='mBtn';mb.type='button';mb.setAttribute('aria-label','Buka menu');mb.setAttribute('aria-controls','hud');mb.setAttribute('aria-expanded','false');mb.innerHTML=svgIk('menu',26);
 var tr=document.createElement('div');tr.id='laciTirai';tr.setAttribute('aria-hidden','true');
 document.body.insertBefore(mb,hd);document.body.insertBefore(tr,hd);
 hd.setAttribute('role','dialog');hd.setAttribute('aria-modal','true');hd.setAttribute('aria-label','Menu Kelas Raudhah');
 var pet=sentuh?[['geser','<b>Geser layar</b> untuk menoleh'],['joy','<b>Joystick</b> (kiri bawah) untuk berjalan'],['lantai','<b>Ketuk lantai</b> untuk berjalan ke titik itu'],['meja','<b>Ketuk meja</b> untuk duduk dan membuka materi'],['zoom','<b>Cubit / renggangkan</b> untuk memperkecil atau memperbesar'],['vr','<b>Mode VR</b>: putar HP untuk menoleh, tatap 1,5 detik untuk memilih']]
  :[['meja','<b>Klik meja</b> untuk duduk dan membuka materi'],['lantai','<b>Klik lantai</b> untuk berjalan ke titik itu'],['kibor','<b>W/S/A/D</b> atau <b>panah atas/bawah</b> untuk berjalan, <b>Shift</b> untuk berlari'],['geser','<b>Panah kiri/kanan</b> atau <b>Q/E</b> untuk memutar; seret mouse untuk melihat'],['zoom','<b>Roda mouse</b> untuk memperbesar atau memperkecil']];
 hd.innerHTML='<div id="laciUtama">'+
  '<div class="lProf"><div class="lAv" id="lAv" aria-hidden="true">?</div><div class="lNm" aria-hidden="true"><b id="lNama"></b><span><span id="lPeran"></span><span class="lMini" id="lMini"></span></span></div><button id="laciX" type="button" aria-label="Tutup menu">'+svgIk('tutup')+'</button></div>'+
  '<span id="hudT" class="sr"></span>'+
  '<div class="lLenc" id="lLenc" aria-hidden="true"><div><small>Poin</small><b id="lPoin">0</b></div><div><small>Bintang</small><b id="lBin">★ 0</b></div></div>'+
  '<div class="lGaris"></div><div id="laciNav" role="group" aria-label="Menu utama"><button id="hudP"></button><button id="hudK"></button><button id="mPapan"></button><button id="mAdi"></button></div>'+
  '<div class="lGaris"></div><button id="hintBtn" aria-expanded="false" aria-controls="laciAtur"></button><div class="lSela"></div><button id="hudX"></button></div>'+
  '<div id="laciAtur" role="region" aria-labelledby="aturJ"><div class="lKep"><button id="aturKembali" type="button" aria-label="Kembali ke menu">'+svgIk('kiri')+'</button><h2 id="aturJ">Pengaturan</h2></div>'+
  '<div class="lSek"><h3 id="kualJ">Kualitas grafis</h3><div id="kualSeg" role="radiogroup" aria-labelledby="kualJ"><button type="button" role="radio" id="kual_otomatis">Otomatis</button><button type="button" role="radio" id="kual_tinggi">Tinggi</button><button type="button" role="radio" id="kual_hemat">Hemat</button></div><p id="bKual" aria-live="polite"></p></div>'+
  '<div class="lGaris"></div><div class="lSek"><h3>Petunjuk kontrol</h3><div id="hint">'+pet.map(function(x){return '<div class="lPet"><span class="lIk" aria-hidden="true">'+svgIk(x[0],20)+'</span><span>'+x[1]+'</span></div>';}).join('')+'</div></div>'+
  '<div class="lGaris"></div><div class="lKaki"><span>Kelas Raudhah '+VERSI+'</span><span><a href="privasi.html" target="_blank" rel="noopener">Kebijakan Privasi</a> · <a href="syarat.html" target="_blank" rel="noopener">Ketentuan Layanan</a></span></div></div>';
 jadiItem(el('hudP'),'progres','Progres belajar');jadiItem(el('hudK'),'kelola','Kelola (meja guru)');jadiItem(el('mPapan'),'papan','Papan Bintang');jadiItem(el('mAdi'),'adi','Adiwiyata');
 var bv=el('bVR');if(bv){el('laciNav').appendChild(bv);jadiItem(bv,'vr',VR.on?'Keluar VR':'Mode VR');bv.style.display=sentuh?'':'none';}
 jadiItem(el('hintBtn'),'atur','Pengaturan','abu sub');jadiItem(el('hudX'),'keluar','Keluar');
 el('mPapan').onclick=function(){bukaPapan();};el('mAdi').onclick=function(){bukaAdi('');};
 var ko=document.createElement('div');ko.id='konfK';ko.innerHTML='<div class="kk" role="alertdialog" aria-modal="true" aria-labelledby="konfJ" aria-describedby="konfI"><div class="kIk" aria-hidden="true">'+svgIk('keluar',26)+'</div><h2 id="konfJ">Yakin ingin keluar?</h2><p id="konfI">Poin, bintang, dan latihan yang sudah dikumpulkan tetap tersimpan. Pilihan jawaban yang belum dikumpulkan akan hilang.</p><div class="kbr"><button id="kBatal" type="button">Batal</button><button id="kYa" type="button">Ya, Keluar</button></div></div>';
 document.body.appendChild(ko);
 el('kBatal').onclick=function(){tutupKonf(false);};el('kYa').onclick=function(){el('kYa').disabled=true;tutupKonf(true);};
 ko.addEventListener('click',function(e){if(e.target===ko)tutupKonf(false);});
 mb.onclick=function(e){e.stopPropagation();laciBuka(!LACI.buka);};
 el('laciX').onclick=tutupLaciKeTombol;tr.addEventListener('click',tutupLaciKeTombol);
 el('hintBtn').onclick=function(){hd.classList.add('atur');el('hintBtn').setAttribute('aria-expanded','true');hd.scrollTop=0;try{el('aturKembali').focus({preventScroll:true});}catch(x){}};
 el('aturKembali').onclick=function(){hd.classList.remove('atur');el('hintBtn').setAttribute('aria-expanded','false');try{el('hintBtn').focus({preventScroll:true});}catch(x){}};
 ['otomatis','tinggi','hemat'].forEach(function(v,i,a){var b=el('kual_'+v);b.onclick=function(e){e.stopPropagation();pilihKual(v);};
  b.addEventListener('keydown',function(e){var d=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0;if(!d)return;e.preventDefault();var n=a[(i+d+3)%3];pilihKual(n);el('kual_'+n).focus();});});
 /* memilih butir menu (selain Pengaturan) menutup laci; fokus ke tombol menu supaya setelah panel ditutup fokus kembali ke sana */
 hd.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.lI');if(!b||b.id==='hintBtn')return;tutupLaciKeTombol();},true);
 document.addEventListener('keydown',function(e){
  var k=el('konfK');
  if(k&&k.classList.contains('on')){if(e.key==='Escape'||e.key==='Esc'){e.preventDefault();tutupKonf(false);}else if(e.key==='Tab'){e.preventDefault();var f=[el('kBatal'),el('kYa')],i=f.indexOf(document.activeElement);f[(i+(e.shiftKey?-1:1)+2)%2].focus();}return;}
  if(!LACI.buka)return;
  if(e.key==='Escape'||e.key==='Esc'){e.preventDefault();if(hd.classList.contains('atur'))el('aturKembali').click();else tutupLaciKeTombol();return;}
  if(e.key!=='Tab')return;
  var f2=Array.prototype.filter.call(hd.querySelectorAll('button,a[href]'),function(x){return x.getClientRects().length>0&&!x.disabled&&x.tabIndex>=0;});if(!f2.length)return;
  var j=f2.indexOf(document.activeElement);
  if(e.shiftKey&&j<=0){e.preventDefault();f2[f2.length-1].focus();}else if(!e.shiftKey&&(j<0||j===f2.length-1)){e.preventDefault();f2[0].focus();}
 });
 /* panel lembar: isi bergulir di #kb; panah/Page saat fokus di judul atau tombol bawah tetap menggulir isi */
 document.addEventListener('keydown',function(e){
  if(el('panel').style.display!=='flex'||e.ctrlKey||e.altKey||e.metaKey)return;var kb=el('kb'),a=document.activeElement;if(!kb||(a&&kb.contains(a)))return;
  var t=a&&a.tagName;if(/INPUT|TEXTAREA|SELECT/.test(t||''))return;
  var d={ArrowDown:40,ArrowUp:-40,PageDown:kb.clientHeight*0.9,PageUp:-kb.clientHeight*0.9}[e.key];if(!d)return;e.preventDefault();kb.scrollBy(0,d);
 });
 terapkanKualitas();
}

function saldoSaya(){return SAYA?(SAYA.saldo!==undefined?SAYA.saldo:SAYA.poin)||0:0;}
function renderHud(){
 var h=el('hud'),mb=el('mBtn');if(!SAYA){h.style.display='none';if(mb)mb.style.display='none';return;}
 h.style.display='flex';if(mb)mb.style.display='flex';segarProfil();el('hudT').textContent=(SAYA.juri?'Juri · ':SAYA.nama+' · ')+SAYA.peran+(SAYA.juri&&SAYA.peran==='siswa'?' ('+SAYA.nama+')':'')+(SAYA.peran==='siswa'?' · Poin '+fPoin(saldoSaya())+' · ★ '+fPoin(SAYA.bintang||0):'');
 el('hudK').style.display=(SAYA.peran==='siswa')?'none':'';el('hudP').style.display=(SAYA.peran==='siswa')?'':'none';
}
function setelahMasuk(j){
 simpanToken(j.token);SAYA=j.saya;el('lu').value='';el('ls').value='';el('lk').value='';el('kodeBox').style.display='none';tutupLogin();renderHud();segarProgres();
}
function kirimGoogle(kode){
 gs('masukGoogle',{credential:credTmp,kode:kode||''}).then(function(j){
  if(j&&j.ok)setelahMasuk(j);
  else if(j&&(j.kode==='BUTUH_KODE'||j.kode==='KODE')){el('kodeBox').style.display='block';lerr(j.error);}
  else lerr(j&&j.error);
 });
}
function cbGoogle(r){credTmp=r.credential;kirimGoogle('');}
function muatGoogle(){
 var s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;
 s.onload=function(){try{google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:cbGoogle});google.accounts.id.renderButton(el('gbtn'),{theme:'outline',size:'large',text:'signin_with',locale:'id'});}catch(e){el('gnote').style.display='block';}};
 s.onerror=function(){el('gnote').style.display='block';};
 document.head.appendChild(s);
}
function bangunMasuk(){
 var o=document.createElement('div');o.id='ovl';
 o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-labelledby','ovlJ');o.innerHTML='<div class="kt"><h2 id="ovlJ" tabindex="-1">Kelas Raudhah</h2><p>Kelas virtual 3D untuk belajar Math, Science, Bahasa, Agama, dan Seni. Masuk untuk memulai belajar.</p><input id="lu" aria-label="Username atau email" placeholder="Username atau email" autocomplete="username" autocapitalize="none"><input id="ls" aria-label="Sandi" type="password" placeholder="Sandi" autocomplete="current-password"><button id="lm">Masuk</button><p class="atau">atau</p><div id="gbtn"></div><p id="gnote" class="atau" style="display:none">Login Google belum diaktifkan. Gunakan akun sandi.</p><button id="ld" type="button" style="background:transparent;color:var(--ac);border:1px solid var(--ac)">Daftar siswa baru</button><button id="lj" type="button" style="background:transparent;color:var(--ac);border:1px solid var(--ac)">Menu Juri</button><div id="kodeBox" style="display:none"><p>Akun Google belum terdaftar. Masukkan kode kelas dari guru:</p><input id="lk" aria-label="Kode kelas" placeholder="Kode kelas" maxlength="12"><button id="lk2" style="margin-top:8px;width:100%">Gabung</button></div><p id="lerr" class="err" role="alert"></p><div id="dBox" style="display:none;flex-direction:column;gap:8px"><p><b>Daftar akun siswa</b></p><input id="dl" aria-label="Nama lengkap" placeholder="Nama lengkap" maxlength="60" autocomplete="name"><input id="dp" aria-label="Nama pendek" placeholder="Nama pendek (tampil di avatar)" maxlength="20"><input id="dk" aria-label="Kode kelas dari guru" placeholder="Kode kelas dari guru" maxlength="12" autocomplete="off" autocapitalize="characters"><input id="de" aria-label="Email" type="email" placeholder="Email" autocomplete="username"><input id="dsk" aria-label="Asal sekolah" placeholder="Asal sekolah" maxlength="60"><input id="ds" aria-label="Kata sandi baru" type="password" placeholder="Kata sandi (min. 8 karakter)" maxlength="64" autocomplete="new-password"><input id="ds2" aria-label="Ulangi kata sandi" type="password" placeholder="Ulangi kata sandi" maxlength="64" autocomplete="new-password"><button id="dg" type="button">Daftar</button><button id="db" type="button" style="background:transparent;color:var(--ac);border:1px solid var(--ac)">Kembali</button></div><div id="jBox" style="display:none;flex-direction:column;gap:8px"><p><b>Menu Juri</b></p><p><small>Masuk langsung untuk menilai aplikasi, tanpa pendaftaran dan tanpa kode kelas. Akun juri hanya untuk demo: data siswa juri direset tiap masuk dan paket soal tidak dibagikan ke siswa asli.</small></p><button id="jrG" type="button">Masuk sebagai Guru</button><button id="jrS" type="button">Masuk sebagai Siswa</button><button id="jrB" type="button" style="background:transparent;color:var(--ac);border:1px solid var(--ac)">Kembali</button></div><p class="atau"><a href="privasi.html" target="_blank" rel="noopener">Kebijakan Privasi</a> · <a href="syarat.html" target="_blank" rel="noopener">Ketentuan Layanan</a></p></div>';
 document.body.appendChild(o);
 var hd=document.createElement('div');hd.id='hud';document.body.appendChild(hd);bangunLaci(hd);
 function masukSandi(){lerr('');el('lm').disabled=true;gs('masukSandi',{username:el('lu').value,sandi:el('ls').value}).then(function(j){el('lm').disabled=false;if(j&&j.ok)setelahMasuk(j);else lerr(j&&j.error);});}
 el('lm').onclick=masukSandi;el('ls').addEventListener('keydown',function(e){if(e.key==='Enter')masukSandi();});el('lu').addEventListener('keydown',function(e){if(e.key==='Enter')masukSandi();});
 el('lk2').onclick=function(){kirimGoogle(el('lk').value);};
 function modeLayar(m){
  el('dBox').style.display=m==='daftar'?'flex':'none';el('jBox').style.display=m==='juri'?'flex':'none';lerr('');
  var kids=el('ovl').querySelector('.kt').children;
  for(var i=0;i<kids.length;i++){var k=kids[i];if(k.id==='dBox'||k.id==='jBox'||k.id==='lerr'||k.tagName==='H2')continue;k.style.display=m?'none':'';}
  if(!m){el('kodeBox').style.display='none';el('gnote').style.display=GOOGLE_CLIENT_ID?'none':'block';}
 }
 function modeDaftar(on){modeLayar(on?'daftar':'');}
 function masukJuri(sbg){
  lerr('');el('jrG').disabled=true;el('jrS').disabled=true;
  gs('masukJuri',{sebagai:sbg}).then(function(j){
   el('jrG').disabled=false;el('jrS').disabled=false;
   if(j&&j.ok){modeLayar('');setelahMasuk(j);}else lerr(j&&j.error);
  });
 }
 el('lj').onclick=function(){modeLayar('juri');};
 el('jrB').onclick=function(){modeLayar('');};
 el('jrG').onclick=function(){masukJuri('guru');};
 el('jrS').onclick=function(){masukJuri('siswa');};
 el('ld').onclick=function(){modeDaftar(true);};
 el('db').onclick=function(){modeDaftar(false);};
 el('dg').onclick=function(){
  lerr('');if(el('ds').value!==el('ds2').value){lerr('Kedua kata sandi harus sama.');return;}
  el('dg').disabled=true;
  gs('daftarAkun',{namaLengkap:el('dl').value,namaPendek:el('dp').value,kode:el('dk').value,email:el('de').value,sekolah:el('dsk').value,sandi:el('ds').value}).then(function(j){
   el('dg').disabled=false;
   if(j&&j.ok){el('ds').value='';el('ds2').value='';modeDaftar(false);setelahMasuk(j);}else lerr(j&&j.error);
  });
 };
 el('hudX').onclick=function(){bukaKonf(function(){gs('keluar').then(function(){simpanToken('');resetProgres();berdiri();tampilLogin('Anda sudah keluar.');});});};
 el('hudK').onclick=function(){if(SAYA&&SAYA.peran!=='siswa')bukaMeja();};el('hudP').onclick=function(){bukaProgres();};
 el('kb').addEventListener('click',klikPanel);
}
function mulaiMasuk(){
 if(!API_URL){tampilLogin('Alamat server belum diatur.');return;}
 if(GOOGLE_CLIENT_ID)muatGoogle();else el('gnote').style.display='block';
 if(TOKEN){gs('saya').then(function(j){if(j&&j.ok){SAYA=j.saya;renderHud();segarProgres();}else{simpanToken('');tampilLogin('');}});}
 else tampilLogin('');
}

/* akhir UMUM login-laci */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: csv */
function unduhCsv(j){
 var bl=new Blob(['\uFEFF'+j.csv],{type:'text/csv;charset=utf-8'}),u=URL.createObjectURL(bl),ln=document.createElement('a');
 ln.href=u;ln.download=j.nama_berkas||'rekap.csv';document.body.appendChild(ln);ln.click();document.body.removeChild(ln);setTimeout(function(){URL.revokeObjectURL(u);},4000);
}

/* akhir UMUM csv */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: galat */
function galatSoal(j){var t='<span class="err">'+esc(j&&j.error||'Gagal.')+'</span>';if(j&&j.masalah&&j.masalah.length)t+='<br><small>'+j.masalah.map(esc).join('<br>')+'</small>';return t;}

/* akhir UMUM galat */

/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: hasil */
function tampilHasil(t){var d=el('hasilK');if(d){d.style.display='block';d.innerHTML=t;}}

/* akhir UMUM hasil */

/* PINDAH v0.22.0 — sinkronkan dengan Kelas Raudhah: adi-kompos-atur */
/* v0.19.0: pengaturan kompos (pemilik) di Panel Admin → Pengaturan: takaran EM4 + berat standar kulit buah. */
function isiAdmKompos(pn){gs('ambilKompos').then(function(j){var d=el('admK');if(!d||pn!==PNL)return;if(!j||!j.ok){d.innerHTML=galatSoal(j);return;}
 var h='<h3 id="admKJ">Kompos MBG (takaran EM4)</h3>';
 j.atur.forEach(function(a,i){h+='<div class="lb" id="pkL'+i+'">'+esc(a.kunci)+'</div><input class="pk" type="number" inputmode="numeric" data-k="'+esc(a.kunci)+'" min="'+esc(a.min)+'" max="'+esc(a.maks)+'" value="'+esc(a.nilai)+'" aria-labelledby="pkL'+i+' pkK'+i+'"><small id="pkK'+i+'">'+esc(a.ket)+' ('+esc(a.min)+'–'+esc(a.maks)+')</small>';});
 h+='<h4>Jenis sampah MBG (berat standar gram per siswa, atau ditimbang)</h4>';
 j.jenis.forEach(function(x,i){h+='<div class="pkR"><span id="pjL'+i+'">'+esc(x.nama)+'</span>'+(x.cara==='timbang'?'<small>ditimbang (kg)</small>':'<input class="pkJ" type="number" inputmode="numeric" min="1" max="'+esc(j.maksG)+'" data-k="'+esc(x.kode)+'" value="'+esc(x.berat_g)+'" aria-labelledby="pjL'+i+'">')+'<label><input type="checkbox" class="pkA" data-k="'+esc(x.kode)+'"'+(x.aktif?' checked':'')+' aria-label="'+esc(x.nama)+' aktif"> aktif</label></div>';});
 h+='<div class="baris"><button class="p" data-act="simpanKompos">Simpan pengaturan kompos</button></div><p class="hs" id="pkSt" role="status"></p><small>Jenis baru ditambahkan di tab JenisKompos pada Sheets (kolom cara: siswa atau timbang). Laporan yang sudah masuk tidak berubah beratnya.</small>';
 d.innerHTML=h;});}

/* akhir PINDAH adi-kompos-atur */

/* PINDAH v0.22.0 — sinkronkan dengan Kelas Raudhah: adi (diubah: tanpa tombol "← Meja guru" (meja guru ada di Kelas Raudhah); petunjuk menunjuk guru Adiwiyata; takaran EM4 dibuka di panel Atur Adiwiyata Eco; Kelola kelas ada di Kelas Raudhah) */
/* ===== v0.13.0: Adiwiyata (panel). Poin Adiwiyata = poin rombel, terpisah dari poin/bintang siswa. Semua izin diperiksa server. ===== */
var ADI=null,ADI_IDEM=null;
function fKg(g){try{return (Number(g)/1000).toLocaleString('id-ID',{maximumFractionDigits:2});}catch(e){return String(Number(g)/1000);}}
function namaJenis(k){var n=k;if(ADI)ADI.jenis.forEach(function(j){if(j.kode===k)n=j.nama;});return n;}
function geserHari(t,n){var d=new Date(t+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
/* v0.18.0 (Adiwiyata Ekoteologis Tahap A): lapor botol (buah) / kertas (kg) -> menunggu -> disetujui kader/guru Adiwiyata -> poin rombel. */
var LP={jenis:''},LP_IDEM=null;
function fJml(x){return x.satuan==='buah'?fPoin(x.jumlah)+' botol':fKg(x.jumlah)+' kg';}
function jenisLp(k){var r=null;if(ADI&&ADI.jenisLapor)ADI.jenisLapor.forEach(function(j){if(j.kode===k)r=j;});if(!r&&k==='MBG'&&ADI&&ADI.kompos&&ADI.kompos.aktif&&ADI.kompos.jenis.length)r={kode:'MBG',nama:'Kompos MBG',satuan:'kompos',poin_per_satuan:ADI.kompos.poin_per_kg};return r;}
/* v0.19.0: kompos MBG = berat standar kulit buah x jumlah siswa; takaran larutan EM4 dari pengaturan pemilik. */
/* v0.20.0: foto kulit buah → dikecilkan ≤ 512 px JPEG di HP → kenaliKulit (Cloudflare). Hasil AI memilihkan jenis; siswa bisa mengoreksi. */
function htmlFotoAI(){var f=LP.foto;if(!f)return '';if(f.muat)return (f.thumb?'<img alt="" src="'+f.thumb+'">':'')+'<span>Mengenali foto…</span>';if(f.galat)return '<span class="err">'+esc(f.galat)+'</span>';
 return (f.thumb?'<img alt="Foto kulit buah yang dikirim" src="'+f.thumb+'">':'')+'<span>'+(f.kode==='LAIN'?'AI belum yakin cocok dengan daftar'+(f.benda?' (terlihat: '+esc(f.benda)+')':'')+'. <b>Pilih jenisnya sendiri</b> di bawah.':(f.benda?'AI menduga ini <b>'+esc(f.benda)+'</b> → dipilih: <b>'+esc(f.nama)+'</b>':'AI menduga: <b>'+esc(f.nama)+'</b>')+(f.berat_g?' ('+esc(fPoin(f.berat_g))+' g per siswa)':' (ditimbang)')+'. Hanya dugaan dan bisa salah; ketuk jenis lain bila keliru.')+'</span>';}
function segarFotoAI(){var d=el('lpAI');if(d)d.innerHTML=htmlFotoAI();}
function kecilkanFoto(file,cb){var url;try{url=URL.createObjectURL(file);}catch(e){cb(null);return;}var im=new Image();
 im.onload=function(){var w=im.naturalWidth,h=im.naturalHeight,sk=Math.min(1,512/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*sk));c.height=Math.max(1,Math.round(h*sk));
  c.getContext('2d').drawImage(im,0,0,c.width,c.height);try{URL.revokeObjectURL(url);}catch(e){}var q=0.72,d=c.toDataURL('image/jpeg',q);while(d.length>130000&&q>0.3){q-=0.15;d=c.toDataURL('image/jpeg',q);}
  var t=document.createElement('canvas'),ts=Math.min(1,128/Math.max(c.width,c.height));t.width=Math.round(c.width*ts);t.height=Math.round(c.height*ts);t.getContext('2d').drawImage(c,0,0,t.width,t.height);
  cb(d.length<=130000?d:null,t.toDataURL('image/jpeg',0.6),c.width,c.height);};
 im.onerror=function(){try{URL.revokeObjectURL(url);}catch(e){}cb(null);};im.src=url;}
function pakaiFoto(file){if(!file||!ADI)return;LP.foto={muat:true};segarFotoAI();var b=el('lpFotoB');if(b)b.disabled=true;
 kecilkanFoto(file,function(d,thumb){if(!d){LP.foto={galat:'Foto tidak bisa dibaca. Coba ambil foto lagi.'};segarFotoAI();if(el('lpFotoB'))el('lpFotoB').disabled=false;return;}
  LP.foto={muat:true,thumb:thumb};segarFotoAI();
  gs('kenaliKulit',{gambar:d}).then(function(j){
   if(!j||!j.ok){LP.foto={galat:(j&&j.error)||'Gagal mengenali foto. Pilih jenisnya sendiri, ya.',thumb:thumb};}
   var caraA=(kulitLp(LP.kulit)||{}).cara;
   if(j&&j.ok){LP.foto={id:j.foto_id,kode:j.kode,nama:j.nama,berat_g:j.berat_g,benda:j.benda||'',alasan:j.alasan,thumb:thumb};if(ADI.kompos&&ADI.kompos.foto)ADI.kompos.foto.sisa=j.sisa;if(j.kode!=='LAIN'&&kulitLp(j.kode))LP.kulit=j.kode;}
   var n1=el('lpN')&&(kulitLp(LP.kulit)||{}).cara===caraA?el('lpN').value:'',bx=document.querySelector('#kb .lp');if(bx){var t2=document.createElement('div');t2.innerHTML=htmlLapor(ADI);bx.parentNode.replaceChild(t2.firstChild,bx);}if(el('lpN'))el('lpN').value=n1;segarHit();
  });});}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='lpFoto'){var f=e.target.files&&e.target.files[0];e.target.value='';pakaiFoto(f);}});
function kulitLp(k){var r=null;if(ADI&&ADI.kompos)ADI.kompos.jenis.forEach(function(j){if(j.kode===k)r=j;});return r;}
function fDes(x,d){try{return Number(x).toLocaleString('id-ID',{maximumFractionDigits:d===undefined?1:d});}catch(e){return String(x);}}
function hitTakaran(g){var a=ADI.kompos.atur,air=g/1000/a.kompos_kg_per_takaran*a.kompos_larutan_ml,l=air/1000;return {air:air,em4:l*a.kompos_em4_ml_per_l,mol:l*a.kompos_molase_ml_per_l};}
function teksTakaran(g){var t=hitTakaran(g);return 'larutan '+fDes(t.air/1000,2)+' L air + '+fDes(t.em4)+' ml EM4 + '+fDes(t.mol)+' ml molase';}
function segarHit(){var h=el('lpHit'),i=el('lpN');if(!h||!i||!ADI||!ADI.kompos)return;var k=kulitLp(LP.kulit),n=i.value.trim();
 if(k&&k.cara==='timbang'){
  if(!/^\d{1,2}([.,]\d{1,2})?$/.test(n)||!(parseFloat(n.replace(',','.'))>0)){h.innerHTML='Timbang sisanya, lalu tulis beratnya dalam kg untuk menghitung larutan EM4.';return;}
  var gT=Math.round(parseFloat(n.replace(',','.'))*1000),pT=Math.round(gT*(Number(ADI.kompos.poin_per_kg)||0)/1000);
  h.innerHTML='Berat ≈ <b>'+esc(fKg(gT))+' kg</b> ('+esc(k.nama)+', ditimbang) · ±'+esc(fPoin(pT))+' poin rombel<br>Kebutuhan: '+esc(teksTakaran(gT))+'.';return;}
 if(!k||!/^\d{1,2}$/.test(n)||+n<1||+n>ADI.kompos.siswaMaks){h.innerHTML='Isi jumlah siswa (1–'+esc(ADI.kompos.siswaMaks)+') untuk menghitung berat dan larutan EM4.';return;}
 var g=k.berat_g*(+n),p=Math.round(g*(Number(ADI.kompos.poin_per_kg)||0)/1000);
 h.innerHTML='Berat total ≈ <b>'+esc(fKg(g))+' kg</b> ('+esc(fPoin(k.berat_g))+' g × '+esc(n)+' siswa) · ±'+esc(fPoin(p))+' poin rombel<br>Kebutuhan: '+esc(teksTakaran(g))+'.';}
document.addEventListener('input',function(e){if(e.target&&e.target.id==='lpN'&&LP.jenis==='MBG')segarHit();});
var ST_LP={menunggu:'menunggu',disetujui:'disetujui',ditolak:'ditolak',dibatalkan:'dibatalkan'};
function htmlLapor(j){
 var jl=(j.jenisLapor||[]).slice().sort(function(a,b){return (a.satuan==='buah'?0:1)-(b.satuan==='buah'?0:1);});
 var km=j.kompos;if(km&&km.aktif&&km.jenis&&km.jenis.length)jl.push({kode:'MBG',nama:'Kompos MBG',satuan:'kompos',poin_per_satuan:km.poin_per_kg});
 if(!jl.length||SAYA.juri||j.guruBukanAdi)return '';
 if(!j.kelas)return j.staf?'':'<div class="lp"><b>♻ Lapor sampah</b><p><small>Akunmu belum masuk rombel aktif. Minta guru memindahkanmu ke rombelmu dulu.</small></p></div>';
 if(!jenisLp(LP.jenis))LP.jenis=jl[0].kode;
 var js=jenisLp(LP.jenis),buah=js.satuan==='buah',kom=js.satuan==='kompos';
 var h='<div class="lp" role="group" aria-labelledby="lpJ"><b id="lpJ">♻ Lapor sampah</b><small>Rombel <b>'+esc(j.kelas.nama_kelas)+'</b> · '+(j.staf?'laporan guru langsung disetujui':'menunggu persetujuan kader atau guru, lalu poinnya masuk ke rombel')+'</small>';
 h+='<div class="lpJn" role="radiogroup" aria-label="Jenis sampah yang dilaporkan">'+jl.map(function(x){var c=x.kode===LP.jenis;return '<button type="button" role="radio" data-act="lpJenis" data-k="'+esc(x.kode)+'" aria-checked="'+(c?'true':'false')+'" tabindex="'+(c?'0':'-1')+'">'+esc(x.nama)+'<small>'+(x.satuan==='buah'?'dihitung per buah':(x.satuan==='kompos'?'sisa makanan & kulit buah':'ditimbang dalam kg'))+' · '+esc(fPoin(x.poin_per_satuan))+' poin/'+(x.satuan==='buah'?'buah':'kg')+'</small></button>';}).join('')+'</div>';
 if(kom){
  if(!kulitLp(LP.kulit))LP.kulit=j.kompos.jenis[0].kode;
  var fo=j.kompos.foto;
  if(fo&&fo.aktif)h+='<div class="lpF"><input type="file" id="lpFoto" accept="image/*" capture="environment" tabindex="-1" aria-hidden="true"><button type="button" class="s2" data-act="lpFoto" id="lpFotoB">📷 Foto sampah MBG, dikenali AI'+(fo.sisa>=0?' · sisa '+esc(fo.sisa)+' hari ini':'')+'</button><small>Potret sampahnya saja, tanpa wajah. Foto dikecilkan di HP dan <b>tidak disimpan</b>; hanya hasil pengenalannya. Dikenali Llama 3.2 (Meta) lewat Cloudflare Workers AI. Hasil AI hanya dugaan dan bisa salah; periksa lagi, guru tetap memeriksa.</small><div class="lpAI" id="lpAI" aria-live="polite">'+htmlFotoAI()+'</div></div>';
  h+='<div class="lb" id="lpKL">Jenis sampah MBG</div><div class="lpJn lpK" role="radiogroup" aria-labelledby="lpKL">'+j.kompos.jenis.map(function(x){var c=x.kode===LP.kulit;return '<button type="button" role="radio" data-act="lpKulit" data-k="'+esc(x.kode)+'" aria-checked="'+(c?'true':'false')+'" tabindex="'+(c?'0':'-1')+'">'+esc(x.nama)+'<small>'+(x.cara==='timbang'?'ditimbang (kg)':esc(fPoin(x.berat_g))+' g per siswa')+'</small></button>';}).join('')+'</div>';
 }
 var kTb=kom&&kulitLp(LP.kulit)&&kulitLp(LP.kulit).cara==='timbang',buahN=(buah||kom)&&!kTb,mx=kom?j.kompos.siswaMaks:(j.buahMaks||500);
 h+='<div class="lb" id="lpNL">'+(kTb?'Berat (kg), mis. 1,5':kom?'Jumlah siswa yang membuang (1–'+esc(mx)+')':(buah?'Jumlah botol (1–'+esc(mx)+')':'Berat (kg), mis. 1,5'))+'</div>';
 h+='<div class="lpN">'+(buahN?'<button type="button" class="s2" data-act="lpKurang" aria-label="Kurangi satu">−</button>':'')+'<input id="lpN" autocomplete="off" aria-labelledby="lpNL" '+(buahN?'inputmode="numeric" maxlength="3" placeholder="ketik jumlah, mis. '+(kom?'30':'10')+'"':'inputmode="decimal" maxlength="6" placeholder="ketik berat, mis. 1,5"')+'>'+(buahN?'<button type="button" class="s2" data-act="lpTambah" aria-label="Tambah satu">+</button>':'')+'</div>';
 if(kom)h+='<div class="lpHit" id="lpHit" aria-live="polite"></div>';
 if(j.staf)h+='<div class="lb" id="lpTL">Tanggal (hari ini sampai 30 hari ke belakang)</div><input id="lpT" type="date" aria-labelledby="lpTL" value="'+esc(j.hari)+'" max="'+esc(j.hari)+'" min="'+esc(geserHari(j.hari,-30))+'">';
 h+='<div class="lb" id="lpCL">Catatan (boleh kosong), mis. dari kantin</div><input id="lpC" maxlength="120" aria-labelledby="lpCL">';
 h+='<div class="baris"><button class="p" data-act="lpKirim">Kirim laporan</button></div><p class="hs" id="lpSt" role="status"></p></div>';
 return h;
}
function htmlLpBaris(x,j,tinjau){
 var h='<div class="lpR" data-id="'+esc(x.id)+'"><span><span class="bdg '+esc(ST_LP[x.status]||'')+'">'+esc(x.status)+'</span> '+(tinjau?'<b>'+esc(x.kelas)+'</b> · ':'')+(x.kulit?'Kompos MBG · '+esc(x.kulit)+(x.siswa?', '+esc(x.siswa)+' siswa':''):esc(x.nama_jenis))+' · <b>'+esc(fJml(x))+'</b>'+(x.status==='disetujui'||tinjau?' · '+(x.status==='disetujui'?'':'±')+esc(fPoin(x.poin))+' poin':'')+'<br><small>'+esc(x.tanggal)+(tinjau?' · oleh '+esc(x.oleh):'')+(x.catatan?' · '+esc(x.catatan):'')+(x.alasan?' · alasan: '+esc(x.alasan):'')+'</small>'+(x.ai?'<br><small class="aiT">AI: '+esc(x.ai.nama)+(x.ai.dikoreksi?' · <b>dikoreksi siswa</b>':'')+'</small>':'')+'</span>';
 if(tinjau){
  if(x.milik&&!j.staf)h+='<p><small>Laporanmu sendiri: ditinjau kader lain atau guru.</small></p>';
  else h+='<div class="baris"><button class="p" data-act="lpSetuju" aria-label="Setujui '+esc(x.nama_jenis)+' '+esc(fJml(x))+' dari '+esc(x.oleh)+'">Setujui</button><button class="s2" data-act="lpTolak" aria-expanded="false" aria-label="Tolak '+esc(x.nama_jenis)+' '+esc(fJml(x))+' dari '+esc(x.oleh)+'">Tolak</button></div>'
   +'<div class="tlB"><select aria-label="Alasan menolak"><option>Jumlah tidak sesuai</option><option>Sampah belum dipilah</option><option>Laporan ganda</option><option>Lainnya</option></select><div class="baris"><button class="s2" data-act="lpTolakYa">Yakin tolak</button></div></div>';
 }else if(x.status==='menunggu')h+='<div class="baris"><button class="s2" data-act="lpBatal" aria-label="Batalkan laporan '+esc(x.nama_jenis)+' '+esc(fJml(x))+'">Batalkan</button></div>';
 return h+'</div>';
}
function bukaAdi(kid,fokus){
 if(!SAYA){tampilLogin('Masuk dulu.');return;}
 bukaPanel('♻ Adiwiyata','#2e7d32','<div class="muat"></div><p>Memuat…</p>');var pn=PNL;
 gsc('infoAdiwiyata',kid?{kelas_id:kid}:null,function(j,dc){
  if(pn!==PNL)return;
  if(!j||!j.ok){if(!dc)el('kb').innerHTML='<p class="err">'+esc(j&&j.error||'Gagal.')+'</p>';return;}
  ADI=j;var h='',bl=j.bulan;
  try{bl=new Date(j.bulan+'-01T00:00:00Z').toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'});}catch(e){}
  if(j.guruBukanAdi)h+='<p><small>Anda belum ditunjuk sebagai guru Adiwiyata. Pemilik bisa menunjuk di menu ☰ → Atur Adiwiyata.</small></p>';
  if(j.staf&&j.rombel){
   h+='<h3>Pilih rombel</h3><div class="baris"><select id="adR" aria-label="Rombel">'+j.rombel.map(function(r){return '<option value="'+esc(r.kelas_id)+'"'+(j.kelas&&r.kelas_id===j.kelas.kelas_id?' selected':'')+'>'+esc(r.nama_kelas)+'</option>';}).join('')+'</select><button class="s2" data-act="adPilih">Buka</button></div>';
   if(!j.rombel.length)h+='<p><small>Belum ada rombel aktif.</small></p>';
  }
  h+=htmlLapor(j);
  if(j.menunggu){
   h+='<h3 id="lpTJ">Menunggu persetujuan ('+esc(j.menungguTotal||0)+')</h3>';
   if(!j.menunggu.length)h+='<p><small>Tidak ada laporan yang menunggu.</small></p>';
   else h+='<p><small>'+(j.staf?'Laporan semua rombel, terlama di atas.':'Laporan rombelmu. Periksa jumlahnya dulu sebelum menyetujui.')+'</small></p>'+j.menunggu.map(function(x){return htmlLpBaris(x,j,true);}).join('');
  }
  if(j.laporanku&&j.laporanku.length){h+='<h3>Laporanku (14 hari)</h3>'+j.laporanku.map(function(x){return htmlLpBaris(x,j,false);}).join('');}
  h+='<h3>Papan rombel · '+esc(bl)+'</h3><p><small>Poin Adiwiyata milik rombel, dari timbangan kader dan laporan botol, kertas, dan kompos MBG yang sudah disetujui. Tidak mengubah poin atau bintang pribadi.</small></p>';
  if(!j.papan.length)h+='<p><small>Belum ada poin rombel bulan ini.</small></p>';
  else h+='<div class="adP">'+j.papan.map(function(x){var me=j.kelas&&x.kelas_id===j.kelas.kelas_id;return '<div class="pb-row'+(me?' me':'')+'"><span class="pb-rk">'+esc(x.r)+'</span><span class="pb-nm">'+esc(x.nama_kelas)+(me?' (rombelmu)':'')+'</span><span class="pb-pt">'+esc(fPoin(x.poin))+' poin<small>'+esc(fKg(x.gram))+' kg'+(x.buah?' · '+esc(fPoin(x.buah))+' botol':'')+'</small></span></div>';}).join('')+'</div>';
  if(j.kompos&&j.kompos.aktif){var kb2=j.kompos.bulan,a2=j.kompos.atur;
   h+='<h3 id="kmpJ">Kompos MBG bulan ini</h3><div class="kmp"><p>Sekolah: <b>'+esc(fKg(kb2.gram_sekolah))+' kg</b> sampah MBG ('+esc(kb2.laporan)+' laporan disetujui) → '+esc(teksTakaran(kb2.gram_sekolah))+'.</p>'+(j.kelas?'<p>Rombel '+esc(j.kelas.nama_kelas)+': <b>'+esc(fKg(kb2.gram_rombel))+' kg</b> → '+esc(teksTakaran(kb2.gram_rombel))+'.</p>':'')+'<small>Takaran: '+esc(fDes(a2.kompos_larutan_ml/1000,2))+' L larutan per '+esc(a2.kompos_kg_per_takaran)+' kg; tiap liter air + '+esc(a2.kompos_em4_ml_per_l)+' ml EM4 + '+esc(a2.kompos_molase_ml_per_l)+' ml molase (diatur pemilik).</small></div>';
   if(j.staf)h+='<div class="baris"><button class="s2" data-act="adRekapK">Unduh rekap kompos bulan ini (CSV)</button></div>';
   if(SAYA.peran==='pemilik'&&!SAYA.juri)h+='<div class="baris"><button class="s2" data-act="adAturK">Atur takaran EM4 &amp; berat standar</button></div>';
  }
  var bisaCatat=j.staf||(j.kader&&j.kelas&&j.kader.kelas_id===j.kelas.kelas_id);
  if(j.kelas)h+='<p>Rombel <b>'+esc(j.kelas.nama_kelas)+'</b> · kader: '+(j.kelas.kader.length?esc(j.kelas.kader.join(', ')):'<i>belum ditunjuk</i>')+'</p>';
  else if(!j.staf&&!j.guruBukanAdi)h+='<p><small>Akunmu belum masuk rombel.</small></p>';
  if(bisaCatat&&j.kelas){
   h+='<h3>Catat timbangan</h3>'+(j.kader&&!j.staf?'<p><small>Kamu kader rombel ini. Timbang sampah yang sudah dipilah, lalu catat per jenis.</small></p>':'')+'<p><small>Sisa makanan MBG (nasi, sayur, lauk, kulit buah) dilaporkan lewat <b>Kompos MBG</b> di atas, jangan ditimbang di sini juga.</small></p>';
   h+='<div class="lb" id="adJL">Jenis sampah</div><select id="adJ" aria-labelledby="adJL">'+j.jenis.map(function(x){return '<option value="'+esc(x.kode)+'">'+esc(x.nama)+' · '+esc(fPoin(x.poin_per_kg))+' poin/kg</option>';}).join('')+'</select>';
   h+='<div class="lb" id="adBL">Berat (kg), mis. 1,5</div><input id="adB" inputmode="decimal" autocomplete="off" maxlength="6" aria-labelledby="adBL" placeholder="1,5">';
   if(j.staf)h+='<div class="lb" id="adTL">Tanggal (hari ini sampai 30 hari ke belakang)</div><input id="adT" type="date" aria-labelledby="adTL" value="'+esc(j.hari)+'" max="'+esc(j.hari)+'" min="'+esc(geserHari(j.hari,-30))+'">';
   h+='<div class="lb" id="adCL">Catatan (boleh kosong)</div><input id="adC" maxlength="120" aria-labelledby="adCL">';
   h+='<div class="baris"><button class="p" data-act="adCatat">Simpan timbangan</button></div><p class="hs" id="adSt" role="status"></p>';
  }
  if(j.riwayat){
   h+='<h3>Catatan timbangan hari ini</h3>';
   if(!j.riwayat.length)h+='<p><small>Belum ada catatan hari ini.</small></p>';
   j.riwayat.forEach(function(r){var ok=r.status==='sah';h+='<div class="baris dr adW'+(ok?'':' batal')+'"><span>'+esc(namaJenis(r.jenis))+' · <b>'+esc(fKg(r.gram))+' kg</b> · '+esc(fPoin(r.poin))+' poin · '+esc(r.oleh)+(r.catatan?' · '+esc(r.catatan):'')+(ok?'':' · <b>dibatalkan</b>')+'</span>'+(ok&&(j.staf||r.milik)?'<button class="s2" style="width:auto" data-act="adBatal" data-id="'+esc(r.id)+'" aria-label="Batalkan catatan '+esc(namaJenis(r.jenis))+' '+esc(fKg(r.gram))+' kg">Batalkan</button>':'')+'</div>';});
  }
  if(j.staf){
   h+='<h3>Kader dan rekap</h3><div class="baris">'+(j.kelas?'<button class="s2" data-act="adKader">Atur kader '+esc(j.kelas.nama_kelas)+'</button>':'')+'<button class="s2" data-act="adRekap">Unduh rekap bulan ini (CSV)</button></div>';
   h+='<div class="baris"><button class="s2" data-act="adRekapL">Unduh daftar laporan bulan ini (CSV)</button></div>';
   if(SAYA.peran==='pemilik'&&!SAYA.juri)h+='<div class="baris"><button class="s2" data-act="adRombel">Buat rombel 7A–9K</button></div><small>Membuat rombel yang belum ada (33 rombel, kelas 7–9 A–K) dengan kode kelas masing-masing.</small>';
   h+='<div id="adK"></div>';
  }
  h+='<div id="hasilK" class="hasil" role="status" style="display:none"></div>';
  el('kb').innerHTML=(dc?'<div class="muat" id="sg"></div>':'')+h;
  segarHit();
  if(!dc&&fokus){var f=el(fokus);if(f){try{f.scrollIntoView({block:'start'});}catch(e){}}}
 });
}
document.addEventListener('keydown',function(e){
 var g=e.target&&e.target.closest&&e.target.closest('.lpJn');if(!g||['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].indexOf(e.key)<0)return;
 var bs=Array.prototype.slice.call(g.querySelectorAll('[role=radio]')),i=bs.indexOf(e.target);if(i<0)return;e.preventDefault();
 var n=bs[(i+(e.key==='ArrowLeft'||e.key==='ArrowUp'?bs.length-1:1))%bs.length];if(n)n.click();
});
function pesanAdi(id,kelas,t){setTimeout(function(){var s2=el(id);if(s2){s2.className='hs '+kelas;s2.textContent=t;}else tampilHasil(esc(t));},500);}
function aksiAdi(a,b){
 if(a==='mAdi'){bukaAdi('');return true;}
 if(a==='adPilih'){bukaAdi(el('adR').value);return true;}
 if(!ADI)return false;
 var kid=ADI.kelas?ADI.kelas.kelas_id:'',kidB=ADI.staf?kid:'';
 if(a==='lpJenis'){var n0=el('lpN')?el('lpN').value:'';LP.jenis=b.getAttribute('data-k');var box=b.closest('.lp');if(box){var t=document.createElement('div');t.innerHTML=htmlLapor(ADI);box.parentNode.replaceChild(t.firstChild,box);}segarHit();var bj=document.querySelector('#kb .lpJn [aria-checked=true]');if(bj)bj.focus();return true;}
 if(a==='lpKulit'){var cara0=(kulitLp(LP.kulit)||{}).cara;LP.kulit=b.getAttribute('data-k');var n1=el('lpN')&&(kulitLp(LP.kulit)||{}).cara===cara0?el('lpN').value:'',bx=b.closest('.lp');if(bx){var t2=document.createElement('div');t2.innerHTML=htmlLapor(ADI);bx.parentNode.replaceChild(t2.firstChild,bx);}if(el('lpN'))el('lpN').value=n1;segarHit();var bk=document.querySelector('#kb .lpK [aria-checked=true]');if(bk)bk.focus();return true;}
 if(a==='lpKurang'||a==='lpTambah'){var inp=el('lpN'),v=parseInt(inp.value,10),mx2=LP.jenis==='MBG'?Number(ADI.kompos.siswaMaks)||60:Number(ADI.buahMaks)||500;if(!isFinite(v))v=0;v+=a==='lpTambah'?1:-1;v=Math.max(1,Math.min(mx2,v));inp.value=String(v);segarHit();return true;}
 if(a==='lpFoto'){var fi=el('lpFoto');if(fi)fi.click();return true;}
 if(a==='lpKirim'&&LP.jenis==='MBG'){
  var stK=el('lpSt'),kl=kulitLp(LP.kulit),tb=kl&&kl.cara==='timbang',dK=tb?{kulit:LP.kulit,berat:el('lpN').value.trim(),catatan:el('lpC').value}:{kulit:LP.kulit,siswa:el('lpN').value.trim(),catatan:el('lpC').value};
  if(ADI.staf){dK.kelas_id=kid;if(el('lpT'))dK.tanggal=el('lpT').value;}
  if(!kl)return true;
  if(tb&&!/^\d{1,2}([.,]\d{1,2})?$/.test(dK.berat)){stK.className='hs no';stK.textContent='Tulis berat dalam kg, mis. 1,5 (maksimal dua angka di belakang koma).';el('lpN').focus();return true;}
  if(!tb&&!(/^\d{1,2}$/.test(dK.siswa)&&+dK.siswa>=1&&+dK.siswa<=(Number(ADI.kompos.siswaMaks)||60))){stK.className='hs no';stK.textContent='Tulis jumlah siswa dengan angka bulat 1–'+(ADI.kompos.siswaMaks||60)+', mis. 30.';el('lpN').focus();return true;}
  if(LP.foto&&LP.foto.id)dK.foto_id=LP.foto.id;
  var sgK=JSON.stringify(dK);if(!LP_IDEM||LP_IDEM.s!==sgK)LP_IDEM={s:sgK,k:idemBaru()};dK.idem=LP_IDEM.k;
  b.disabled=true;stK.className='hs';stK.textContent='Mengirim…';
  gs('laporKompos',dK).then(function(j){
   b.disabled=false;
   if(j&&j.kode==='JARINGAN'){stK.className='hs no';stK.textContent='Server tidak terjangkau. Tekan Kirim lagi (tidak akan tercatat dua kali).';return;}
   LP_IDEM=null;
   if(!j||!j.ok){stK.className='hs no';stK.textContent=(j&&j.error)||'Gagal.';return;}
   if(!j.ulang)LP.foto=null;
   var isi=kl.nama+(j.siswa?' '+fPoin(j.siswa)+' siswa ≈ ':' ')+fKg(j.gram)+' kg';
   var pesan=j.ulang?'Laporan ini sudah terkirim sebelumnya.':(j.status==='disetujui'?'Tersimpan dan disetujui: '+isi+' = '+fPoin(j.poin)+' poin untuk rombel. Butuh '+teksTakaran(j.gram)+'.':'Terkirim: '+isi+'. Menunggu persetujuan kader atau guru (±'+fPoin(j.poin)+' poin). Butuh '+teksTakaran(j.gram)+'.');
   bukaAdi(kidB);pesanAdi('lpSt','ok',pesan);
  });
  return true;
 }
 if(a==='adRekapK'){b.disabled=true;gs('rekapKompos',{bulan:ADI.bulan}).then(function(j){b.disabled=false;if(j&&j.ok){unduhCsv(j);tampilHasil('Rekap kompos '+esc(j.bulan)+' diunduh: <b>'+esc(j.nama_berkas)+'</b>.');}else tampilHasil(galatSoal(j));});return true;}
 if(a==='adAturK'){bukaAturAdi();return true;}
 if(a==='lpKirim'){
  var st=el('lpSt'),js=jenisLp(LP.jenis),d={jenis:LP.jenis,jumlah:el('lpN').value.trim(),catatan:el('lpC').value};
  if(ADI.staf){d.kelas_id=kid;if(el('lpT'))d.tanggal=el('lpT').value;}
  if(!js)return true;
  if(js.satuan==='buah'?!(/^\d{1,3}$/.test(d.jumlah)&&+d.jumlah>=1&&+d.jumlah<=(Number(ADI.buahMaks)||500)):!/^\d{1,3}([.,]\d{1,2})?$/.test(d.jumlah)){st.className='hs no';st.textContent=js.satuan==='buah'?'Tulis jumlah botol dengan angka bulat, mis. 12.':'Tulis berat dalam kg, mis. 1,5 (maksimal dua angka di belakang koma).';el('lpN').focus();return true;}
  var sig=JSON.stringify(d);if(!LP_IDEM||LP_IDEM.s!==sig)LP_IDEM={s:sig,k:idemBaru()};d.idem=LP_IDEM.k;
  b.disabled=true;st.className='hs';st.textContent='Mengirim…';
  gs('laporSampah',d).then(function(j){
   b.disabled=false;
   if(j&&j.kode==='JARINGAN'){st.className='hs no';st.textContent='Server tidak terjangkau. Tekan Kirim lagi (tidak akan tercatat dua kali).';return;}
   LP_IDEM=null;
   if(!j||!j.ok){st.className='hs no';st.textContent=(j&&j.error)||'Gagal.';return;}
   var jm=j.satuan==='buah'?fPoin(j.jumlah)+' botol':fKg(j.jumlah)+' kg';
   var pesan=j.ulang?'Laporan ini sudah terkirim sebelumnya.':(j.status==='disetujui'?'Tersimpan dan disetujui: '+js.nama+' '+jm+' = '+fPoin(j.poin)+' poin untuk rombel.':'Terkirim: '+js.nama+' '+jm+'. Menunggu persetujuan kader atau guru (±'+fPoin(j.poin)+' poin untuk rombel).');
   bukaAdi(kidB);pesanAdi('lpSt','ok',pesan);
  });
  return true;
 }
 var rw=b.closest&&b.closest('.lpR'),lid=rw&&rw.getAttribute('data-id');
 if(a==='lpTolak'&&rw){var on=!rw.classList.contains('tl');rw.classList.toggle('tl',on);b.setAttribute('aria-expanded',on?'true':'false');if(on){var sl=rw.querySelector('.tlB select');if(sl)sl.focus();}return true;}
 if((a==='lpSetuju'||a==='lpTolakYa')&&lid){
  var ya=a==='lpSetuju',al=ya?'':rw.querySelector('.tlB select').value;
  Array.prototype.forEach.call(rw.querySelectorAll('button'),function(x){x.disabled=true;});
  gs('tinjauLaporan',{lapor_id:lid,putusan:ya?'setujui':'tolak',alasan:al}).then(function(j){
   if(!j||!j.ok){Array.prototype.forEach.call(rw.querySelectorAll('button'),function(x){x.disabled=false;});tampilHasil(galatSoal(j));return;}
   bukaAdi(kidB);pesanAdi('hasilK','ok',ya?'Disetujui: +'+fPoin(j.poin)+' poin untuk rombel.':'Laporan ditolak ('+al+').');
  });
  return true;
 }
 if(a==='lpBatal'&&lid){if(!window.confirm('Batalkan laporan ini?'))return true;b.disabled=true;gs('batalLaporan',{lapor_id:lid}).then(function(j){b.disabled=false;if(j&&j.ok){bukaAdi(kidB);pesanAdi('hasilK','ok','Laporan dibatalkan.');}else tampilHasil(galatSoal(j));});return true;}
 if(a==='adRekapL'){b.disabled=true;gs('rekapLaporan',{bulan:ADI.bulan}).then(function(j){b.disabled=false;if(j&&j.ok){unduhCsv(j);tampilHasil('Daftar laporan '+esc(j.bulan)+' ('+esc(j.laporan)+' laporan) diunduh: <b>'+esc(j.nama_berkas)+'</b>.');}else tampilHasil(galatSoal(j));});return true;}
 if(a==='adCatat'){
  var st=el('adSt'),d={kelas_id:kid,jenis:el('adJ').value,berat:el('adB').value.trim(),catatan:el('adC').value};if(el('adT'))d.tanggal=el('adT').value;
  if(!/^\d{1,3}([.,]\d{1,2})?$/.test(d.berat)){st.className='hs no';st.textContent='Tulis berat dalam kg, mis. 1,5 (maksimal dua angka di belakang koma).';el('adB').focus();return true;}
  var sig=JSON.stringify(d);if(!ADI_IDEM||ADI_IDEM.s!==sig)ADI_IDEM={s:sig,k:idemBaru()};d.idem=ADI_IDEM.k;
  b.disabled=true;st.className='hs';st.textContent='Menyimpan…';
  gs('catatTimbang',d).then(function(j){
   b.disabled=false;
   if(j&&j.kode==='JARINGAN'){st.className='hs no';st.textContent='Server tidak terjangkau. Tekan Simpan lagi (tidak akan tercatat dua kali).';return;}
   ADI_IDEM=null;
   if(!j||!j.ok){st.className='hs no';st.textContent=(j&&j.error)||'Gagal.';return;}
   var pesan=j.ulang?'Catatan ini sudah tersimpan sebelumnya.':'Tersimpan: '+namaJenis(d.jenis)+' '+fKg(j.gram)+' kg = '+fPoin(j.poin)+' poin untuk rombel.';
   bukaAdi(kid);setTimeout(function(){var s2=el('adSt');if(s2){s2.className='hs ok';s2.textContent=pesan;}},500);
  });
  return true;
 }
 if(a==='adBatal'){if(!window.confirm('Batalkan catatan timbangan ini? Poinnya dikurangi dari rombel.'))return true;b.disabled=true;gs('batalTimbang',{timbang_id:b.getAttribute('data-id')}).then(function(j){b.disabled=false;if(j&&j.ok)bukaAdi(kid);else tampilHasil(galatSoal(j));});return true;}
 if(a==='adKader'){var box=el('adK');box.innerHTML='<p>Memuat…</p>';gs('daftarKader',{kelas_id:kid}).then(function(j){if(!el('adK'))return;if(!j||!j.ok){box.innerHTML=galatSoal(j);return;}
   var n=j.siswa.filter(function(x){return x.kader;}).length,h='<p><b>Kader '+esc(j.nama_kelas)+'</b> ('+n+' dari maks. '+esc(j.maks)+')</p>';
   if(!j.siswa.length)h+='<p><small>Belum ada siswa aktif di rombel ini.</small></p>';
   j.siswa.forEach(function(x){h+='<div class="baris dr"><span>'+esc(x.lengkap)+(x.nama&&x.nama!==x.lengkap?' ('+esc(x.nama)+')':'')+(x.kader?' · <b class="ok">kader</b>':'')+'</span><button class="s2" style="width:auto" data-act="adKd" data-id="'+esc(x.id)+'" data-v="'+(x.kader?'0':'1')+'"'+(!x.kader&&n>=j.maks?' disabled':'')+' aria-label="'+(x.kader?'Lepas kader ':'Jadikan kader ')+esc(x.lengkap)+'">'+(x.kader?'Lepas':'Jadikan kader')+'</button></div>';});
   box.innerHTML=h;});return true;}
 if(a==='adKd'){b.disabled=true;gs('aturKader',{siswa_id:b.getAttribute('data-id'),kader:b.getAttribute('data-v')==='1'}).then(function(j){if(j&&j.ok){aksiAdi('adKader',b);}else{b.disabled=false;tampilHasil(galatSoal(j));}});return true;}
 if(a==='adRekap'){b.disabled=true;gs('rekapAdiwiyata',{bulan:ADI.bulan}).then(function(j){b.disabled=false;if(j&&j.ok){unduhCsv(j);tampilHasil('Rekap Adiwiyata '+esc(j.bulan)+' ('+esc(j.rombel)+' rombel) diunduh: <b>'+esc(j.nama_berkas)+'</b>.');}else tampilHasil(galatSoal(j));});return true;}
 if(a==='adRombel'){if(!window.confirm('Buat rombel 7A sampai 9K yang belum ada?'))return true;b.disabled=true;gs('buatRombel').then(function(j){b.disabled=false;if(j&&j.ok){bukaAdi(kid);setTimeout(function(){tampilHasil(j.jumlah?esc(j.jumlah)+' rombel baru dibuat: '+esc(j.dibuat.join(', '))+'. Kode kelas tiap rombel ada di Kelola kelas (Kelas Raudhah).':'Semua rombel 7A–9K sudah ada.');},500);}else tampilHasil(galatSoal(j));});return true;}
 return false;
}

/* akhir PINDAH adi */

/* ===== Eco: panel "Atur Adiwiyata" (pemilik): tunjuk guru Adiwiyata + takaran EM4 & berat standar.
   Di Kelas Raudhah keduanya ada di Panel Admin (Guru / Pengaturan); aksi server sama (daftarGuru, aturGuruAdi, ambilKompos, simpanKompos). */
function bukaAturAdi(){
 if(!SAYA||SAYA.peran!=='pemilik'||SAYA.juri)return;
 bukaPanel('Atur Adiwiyata','#2e7d32','<div class="muat"></div><p>Memuat…</p>');var pn=PNL;
 var akhir='<div id="hasilK" class="hasil" role="status" style="display:none"></div>';
 gsc('daftarGuru',null,function(j,dc){
  if(pn!==PNL)return;if(!j||!j.ok){el('kb').innerHTML='<p class="err">'+esc(j&&j.error||'Gagal.')+'</p>';return;}
  var h='<div class="baris"><button class="s2" data-act="mAdi">← Adiwiyata</button></div><h3>Guru Adiwiyata</h3><p><small>♻ Guru Adiwiyata boleh menyetujui laporan sampah, mencatat timbangan, menunjuk kader, dan mengunduh rekap Adiwiyata. '+(j.adiSemua?'Belum ada yang ditunjuk, jadi <b>semua guru</b> boleh.':'Hanya guru bertanda ♻ (dan pemilik).')+'</small></p>';
  j.guru.forEach(function(g){var ubah=g.peran==='guru'&&g.jenis!=='juri';if(g.jenis==='juri')return;h+='<div class="sd gr" data-id="'+esc(g.id)+'"><b>'+esc(g.nama)+'</b> <small>('+esc(g.peran)+')</small>'+(g.aktif?'':' <span class="err">nonaktif</span>')+(g.adi?' <span class="ok">♻ Adiwiyata</span>':'')+(ubah?'<div class="baris"><button class="s2" data-act="grAdi" data-v="'+(g.adi?'0':'1')+'" aria-label="'+(g.adi?'Lepas ♻ guru Adiwiyata: ':'Jadikan ♻ Adiwiyata: ')+esc(g.nama)+'">'+(g.adi?'Lepas ♻ guru Adiwiyata':'Jadikan ♻ Adiwiyata')+'</button></div>':'')+'</div>';});
  h+='<p><small>Menambah guru, akun, dan pengaturan umum tetap di Kelas Raudhah → Meja guru → Panel Admin.</small></p>';
  h+='<div id="admK"><p>Memuat pengaturan kompos…</p></div>';
  el('kb').innerHTML=(dc?'<div class="muat" id="sg"></div>':'')+h+akhir;
  if(!dc)isiAdmKompos(pn);
 });
}
function aksiAturAdi(a,b){
 if(a==='grAdi'){var g3=b.closest('.gr');if(!g3)return true;b.disabled=true;gs('aturGuruAdi',{id:g3.getAttribute('data-id'),adi:b.getAttribute('data-v')==='1'}).then(function(j){b.disabled=false;if(j&&j.ok)bukaAturAdi();else tampilHasil(galatSoal(j));});return true;}
 if(a==='simpanKompos'){var at={},jn=[],st=el('pkSt');Array.prototype.forEach.call(document.querySelectorAll('#kb .pk'),function(x){at[x.getAttribute('data-k')]=x.value;});
  Array.prototype.forEach.call(document.querySelectorAll('#kb .pkA'),function(c){var x=document.querySelector('#kb .pkJ[data-k="'+c.getAttribute('data-k')+'"]');jn.push({kode:c.getAttribute('data-k'),berat_g:x?x.value:'',aktif:c.checked});});
  b.disabled=true;st.className='hs';st.textContent='Menyimpan…';gs('simpanKompos',{atur:at,jenis:jn}).then(function(j){b.disabled=false;if(j&&j.ok){st.className='hs ok';st.textContent='Pengaturan kompos tersimpan.';}else{st.className='hs no';st.innerHTML=galatSoal(j);}});return true;}
 return false;
}
function klikPanel(e){
 var b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;var a=b.getAttribute('data-act');
 if(terlaluCepat(a))return;
 if(aksiAturAdi(a,b))return;
 if(aksiAdi(a,b))return;
}
/* ===== Eco: pindah ke Kelas Raudhah (tab yang sama; sesi kr_t di sessionStorage ikut terbawa karena asal situs sama). ===== */
var KONF_ASLI=null;
function teksKonf(t){var k=el('konfK');if(!k)return;var ik=k.querySelector('.kIk');
 if(!KONF_ASLI)KONF_ASLI={j:el('konfJ').textContent,i:el('konfI').textContent,ya:el('kYa').textContent,ik:ik.innerHTML};
 var x=t||KONF_ASLI;el('konfJ').textContent=x.j;el('konfI').textContent=x.i;el('kYa').textContent=x.ya;ik.innerHTML=x.ik;k.classList.toggle('pindah',!!t);}
function keRaudhah(){location.href=URL_RAUDHAH;}
function keHome(){location.href=URL_HOME;}
function konfKe(t,lanjut){if(terbukaLain())return;laciBuka(false);teksKonf(t);bukaKonf(lanjut);}
function konfRaudhah(){konfKe({j:'Pindah ke Kelas Raudhah?',i:'Eco-Gazebo ditutup dan Kelas Raudhah dibuka di tab ini. Kamu tetap masuk dengan akun yang sama.',ya:'Ya, pindah',ik:svgIk('pindah',26)},function(){keRaudhah();});}
function konfHome(){konfKe({j:'Kembali ke beranda?',i:'Eco-Gazebo ditutup dan halaman beranda dibuka di tab ini.',ya:'Ya, ke beranda',ik:svgIk('rumah',26)},function(){keHome();});}
/* ===== Eco: server. Versi halaman Eco berbeda dengan versi Code.gs (dipakai bersama); server cocok bila versinya >= SERVER_MIN. ===== */
function vnum(v){return String(v||'').replace('v','').split('.').map(Number).reduce(function(a,x){return a*1000+(x||0);},0);}
function tandaLingk(j){
 var lokal=location.protocol==='file:'||/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname),bar=document.getElementById('lbar'),uji=!!(j&&j.uji),t='';
 if(uji){mode='uji';t=' · MODE UJI'+(j.dataUji?' ('+String(j.dataUji).slice(0,40)+')':'')+' · bukan data asli';}
 else if(lokal){mode='bahaya';t=' · PERINGATAN: halaman LOKAL terhubung ke server yang TIDAK bertanda UJI (kemungkinan data ASLI). Hentikan dan periksa alamat server.';}
 else{mode='';}
 if(bar){bar.style.display=mode?'block':'none';bar.className=mode;}
 document.title=(uji?'[UJI] ':(mode==='bahaya'?'[PERINGATAN] ':''))+'Eco-Gazebo '+VERSI;
 return t;
}
function cekServer(){
 if(!API_URL){srv=' · server: belum diatur';setV(true);return;}
 var t0=Date.now(),ctl=('AbortController' in window)?new AbortController():null,to=setTimeout(function(){if(ctl)ctl.abort();},12000);
 fetch(API_URL+(API_URL.indexOf('?')<0?'?':'&')+'aksi=ping&v='+encodeURIComponent(VERSI),ctl?{signal:ctl.signal}:{})
 .then(function(r){return r.json();})
 .then(function(j){clearTimeout(to);
  if(j&&j.ok){var lama=vnum(j.versi)<vnum(SERVER_MIN);srv=' · server OK '+j.versi+(lama?' (server terlalu lama, perlu '+SERVER_MIN+')':'')+(j.sheetSiap?'':' · sheet belum siap')+' · '+(Date.now()-t0)+' ms'+tandaLingk(j);if(lama||!j.sheetSiap){bagian='server';SRV_GALAT=true;setV(false);}else{setV(true);}}
  else{srv=' · server menolak';bagian='server';SRV_GALAT=true;setV(false);}})
 .catch(function(){clearTimeout(to);srv=' · server tidak terjangkau';bagian='server';SRV_GALAT=true;setV(false);});
}
/* ===== Eco: adegan 3D ===== */
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: tanah-pohon */
var TANAH=-0.45;
function pohon(x,z,s){C(x,s+TANAH,z,0.16*s,2*s,'#6d4c2f',dunia);S(x,2.7*s+TANAH,z,1.15*s,'#2e7d32',dunia);S(x+0.5*s,3.2*s+TANAH,z+0.3*s,0.8*s,'#388e3c',dunia);}

/* akhir UMUM tanah-pohon */

/* PINDAH v0.22.0 — sinkronkan dengan Kelas Raudhah: halaman (diubah: v0.2.0: gazebo sederhana dihapus; gazebo realistis gazeboEco() dibangun setelah adegan siap (eco_sumber.js); v0.2.0: judul papan menyesuaikan lebar bingkai; v0.2.0: subjudul papan menyesuaikan lebar bingkai) */
/* v0.22.0 HALAMAN SEKOLAH (artboard Lokasi/Gazebo D1): Eco-Gazebo (deck 8,6 x 5,6 m di x 11,7..20,3 z 2,8..8,4, tinggi 45 cm, 2 anak tangga,
   rangka bambu, atap hijau melengkung + panel surya, 3 meja berbangku), papan nama, Recycling Hub 4 tong + kios QR (bisa diketuk),
   kolam bioswale, bedeng sayur 4 lajur, komposter EM4, bangku, jalan setapak kerikil, gerbang + pagar tanaman.
   Mesh: 'gazebo' (+ bisa diklik untuk berjalan), 'halaman', 'hub' (diketuk = lapor), papan nama gazebo = 1 bidang teks. */
function papanDua(t1,t2){var cv=document.createElement('canvas');cv.width=512;cv.height=192;var g=cv.getContext('2d');g.fillStyle='#2f6f4f';g.fillRect(0,0,512,192);g.strokeStyle='#a77b52';g.lineWidth=10;g.strokeRect(5,5,502,182);
 g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6dc';var fz=40;g.font='bold '+fz+'px sans-serif';while(g.measureText(t1).width>470&&fz>14){fz-=1;g.font='bold '+fz+'px sans-serif';}g.fillText(t1,256,78);g.fillStyle='#cfe8d8';fz=32;g.font='600 '+fz+'px sans-serif';while(g.measureText(t2).width>470&&fz>12){fz-=1;g.font='600 '+fz+'px sans-serif';}g.fillText(t2,256,132);return cv.toDataURL();}
function langkahHalaman(){bagian='halaman';var T=AFRAME.THREE,t=TANAH,HJ='#2f6f4f',BB='#c9a95c',BBg='#9c7f3e',i;
 /* v0.2.0: gazebo realistis = gazeboEco() di eco_sumber.js, dibangun setelah adegan siap */
 var pn=E('a-entity',{position:'19.6 '+(t+1.45)+' 9.805'});pn.setAttribute('geometry',{primitive:'plane',width:2.7,height:1.0});pn.setAttribute('material',{src:papanDua('The Eco-Gazebo Classroom','Sustainability in Action'),shader:'flat'});
 gabung('halaman',function(K,Cy,Bl){var G='#d8cfbf';
  /* jalan setapak kerikil: gerbang -> kelas, cabang ke gazebo, hub, bedeng, kolam */
  K(2.4,0.02,10.6,0,t+0.01,14.3,G);K(16.0,0.02,1.4,8.4,t+0.012,12.5,G);K(1.6,0.02,3.5,16,t+0.014,10.75,G);K(5.8,0.02,1.4,-3.5,t+0.012,12.5,G);
  K(1.4,0.02,10.2,21.8,t+0.012,6.6,G);K(1.4,0.02,1.4,21.8,t+0.012,12.5,G);K(4.6,0.02,1.4,19.5,t+0.012,12.5,G);
  for(i=0;i<40;i++){var px=(i*7.31)%2.2-1.1,pz=9.2+(i*3.7)%10.2;Bl(0.04,px,t+0.02,pz,'#bfb4a1',0.4);}
  /* kolam bioswale (19; -3) + batu tepi + tanaman air */
  Cy(2.1,0.03,19,t+0.02,-3,'#5aa9d6',28);Cy(1.5,0.032,19,t+0.022,-3,'#4b97c4',24);
  for(i=0;i<14;i++){var a=i*Math.PI*2/14;Bl(0.22,19+Math.cos(a)*2.2,t+0.06,-3+Math.sin(a)*2.2,i%2?'#9e9e9e':'#8d8d8d',0.5);}
  for(i=0;i<6;i++){var b=i*1.05+0.3;Cy(0.025,0.7,19+Math.cos(b)*1.75,t+0.35,-3+Math.sin(b)*1.75,'#558b2f',5);Cy(0.025,0.55,19.1+Math.cos(b)*1.75,t+0.28,-3.1+Math.sin(b)*1.75,'#7cb342',5);}
  /* bedeng sayur 4 lajur (x -12,5..-5,9; z 10..15,2) */
  [-11.9,-10.1,-8.3,-6.5].forEach(function(x,j){K(1.2,0.18,5.2,x,t+0.09,12.6,'#6d4c41');for(var k=0;k<(j<2?4:j===2?3:2);k++)Bl(0.28,x,t+0.3,10.8+k*1.2,j%2?'#66bb6a':'#43a047',0.75);});
  /* komposter EM4 (-4,5; 16,2) */
  K(1.4,0.9,1.2,-4.5,t+0.45,16.2,'#43a047');K(1.5,0.08,1.3,-4.5,t+0.94,16.2,'#1b5e20');K(0.5,0.12,0.02,-4.5,t+0.6,16.81,'#fff6dc');
  /* bangku kayu: tepi jalan dan tepi kolam */
  [[4.5,17,0],[19,-0.3,Math.PI]].forEach(function(b){var x=b[0],z=b[1],r=b[2],s=r?-1:1;K(1.5,0.06,0.42,x,t+0.45,z,'#8d6e63');K(0.06,0.42,0.38,x-0.65,t+0.21,z,'#6d4c41');K(0.06,0.42,0.38,x+0.65,t+0.21,z,'#6d4c41');K(1.5,0.4,0.05,x,t+0.8,z+s*0.19,'#8d6e63');});
  /* gerbang (0; 20) + pagar tanaman keliling halaman */
  [-1.6,1.6].forEach(function(x){K(0.4,2.4,0.4,x,t+1.2,20,'#f4ecd8');K(0.5,0.12,0.5,x,t+2.46,20,HJ);});K(3.7,0.35,0.25,0,t+2.2,20,HJ);
  K(12.4,0.8,0.6,-7.8,t+0.4,20,'#3f7d3a');K(25.4,0.8,0.6,14.3,t+0.4,20,'#3f7d3a');K(41,0.8,0.6,6.5,t+0.4,-9.2,'#3f7d3a');K(0.6,0.8,29.2,-14,t+0.4,5.4,'#3f7d3a');K(0.6,0.8,29.2,27,t+0.4,5.4,'#3f7d3a');
 });
 var hub=gabung('hub',function(K){K(2.6,0.04,1.0,8.95,t+0.02,10.6,'#bdb5a6');
  [['#1e88e5','#1565c0'],['#fbc02d','#f9a825'],['#43a047','#2e7d32'],['#757575','#616161']].forEach(function(w,j){var x=8.2+j*0.42;K(0.34,0.62,0.34,x,t+0.35,10.6,w[0]);K(0.38,0.05,0.38,x,t+0.685,10.6,w[1]);K(0.16,0.16,0.01,x,t+0.45,10.775,'#ffffff');});
  K(0.32,0.95,0.2,9.95,t+0.515,10.6,'#2f6f4f');K(0.22,0.22,0.012,9.95,t+0.82,10.706,'#ffffff');[[-0.07,0.07],[0.07,0.07],[-0.07,-0.07]].forEach(function(q){K(0.05,0.05,0.014,9.95+q[0],t+0.82+q[1],10.708,'#222222');});});
 klik(hub.userData.el,{t:'tong'});
}



/* akhir PINDAH halaman */

/* PINDAH v0.22.0 — sinkronkan dengan Kelas Raudhah: hub-tong */
/* Recycling Hub: 4 tong berderet x 8,2 / 8,62 / 9,04 / 9,46 (z 10,6), kios QR x 9,95 */
function tongDari(x){if(x>9.75)return 'KRT_QR';var j=Math.max(0,Math.min(3,Math.round((x-8.2)/0.42)));return ['KRT','BTL','MBG','RES'][j];}

/* akhir PINDAH hub-tong */

/* ===== v0.2.0: GAZEBO REALISTIS (P3 dipilih pengguna 31/10 11:29: ruangan varian A, atap tampak atas varian ringan B) =====
   Menggantikan gazebo sederhana di blok PINDAH halaman (lihat `ganti` di segmen.js). Tapak, tangga, TABRAK, dan tinggiPijak SAMA dengan v0.1.2.
   Mesh: 'gazebo' (rangka/deck/dinding/isi/TOGA, 1 draw call, bisa diklik untuk berjalan), 'gzKaca' (kaca depan, pantulan palsu),
   'gzSemak' (semak, InstancedMesh), 'gzBayang' (bayangan palsu), 'gzPapanAdi' (laporan Adiwiyata, ketuk = panel Adiwiyata), papan TOGA.
   Tekstur = atlas kanvas 512 px yang dilukis di perangkat (tanpa unduhan). Bahan Lambert (lebih murah per piksel daripada Standard).
   Dibangun SETELAH adegan dasar siap (muat bertahap): siswa sudah bisa berjalan, gazebo menyusul 1 bingkai kemudian.
   Atap atas TANPA tekstur: warna per petak (gaya ringan B); panel surya 2 kotak. */
function gazeboEco(){var T=AFRAME.THREE,t=TANAH,i,j;
 var S=512,P=S/4,SEG=sentuh?7:10,TUB=sentuh?5:7;
 var acak=(function(s){return function(){s=(s*16807)%2147483647;return(s-1)/2147483646;};})(20261031);
 function f(x){var u=(x-16)/4.6;return 2.45+0.95*(1-u*u);}
 function lereng(x){return Math.atan(-0.95*2*(x-16)/(4.6*4.6));}
 /* ---- atlas 4x4 petak: 0 bilah bambu, 1 papan deck, 4 kayu laminasi, 6 kayu meja, 7 putih ---- */
 var cv=kanvas(S,S,function(g){
  function petak(k,fn){var x0=(k%4)*P,y0=Math.floor(k/4)*P;g.save();g.beginPath();g.rect(x0,y0,P,P);g.clip();g.translate(x0,y0);fn(g,P);g.restore();}
  petak(0,function(g,p){var n=22,w=p/n;for(var k=0;k<n;k++){var c=170+Math.floor(acak()*40);g.fillStyle='rgb('+c+','+Math.floor(c*0.8)+','+Math.floor(c*0.47)+')';g.fillRect(k*w,0,w,p);
    var gr=g.createLinearGradient(k*w,0,(k+1)*w,0);gr.addColorStop(0,'rgba(60,40,10,0.35)');gr.addColorStop(0.3,'rgba(255,255,255,0.12)');gr.addColorStop(1,'rgba(60,40,10,0.45)');g.fillStyle=gr;g.fillRect(k*w,0,w,p);
    for(var r=acak()*p/3;r<p;r+=p/3){g.fillStyle='rgba(90,60,20,0.55)';g.fillRect(k*w,r,w,Math.max(1,p/90));}}
   var ao=g.createLinearGradient(0,0,0,p);ao.addColorStop(0,'rgba(0,0,0,0.18)');ao.addColorStop(0.12,'rgba(0,0,0,0)');ao.addColorStop(0.88,'rgba(0,0,0,0)');ao.addColorStop(1,'rgba(0,0,0,0.22)');g.fillStyle=ao;g.fillRect(0,0,p,p);});
  petak(1,function(g,p){var n=9,h=p/n;for(var k=0;k<n;k++){var c=150+Math.floor(acak()*35);g.fillStyle='rgb('+c+','+Math.floor(c*0.72)+','+Math.floor(c*0.48)+')';g.fillRect(0,k*h,p,h);
    g.strokeStyle='rgba(80,50,25,0.25)';g.lineWidth=1;for(var l=0;l<4;l++){g.beginPath();var yy=k*h+acak()*h;g.moveTo(0,yy);g.bezierCurveTo(p*0.3,yy+2,p*0.6,yy-2,p,yy+1);g.stroke();}
    g.fillStyle='rgba(50,30,15,0.7)';g.fillRect(0,k*h,p,Math.max(1,p/120));}});
  petak(4,function(g,p){g.fillStyle='#d2aa66';g.fillRect(0,0,p,p);for(var k=0;k<14;k++){g.fillStyle=k%2?'rgba(120,80,30,0.18)':'rgba(255,240,200,0.15)';g.fillRect(0,k*p/14,p,p/28);}});
  petak(6,function(g,p){g.fillStyle='#a77b52';g.fillRect(0,0,p,p);g.strokeStyle='rgba(70,40,20,0.25)';for(var k=0;k<12;k++){g.beginPath();var yy=acak()*p;g.moveTo(0,yy);g.bezierCurveTo(p/3,yy+3,2*p/3,yy-3,p,yy);g.stroke();}});
  petak(7,function(g,p){g.fillStyle='#ffffff';g.fillRect(0,0,p,p);});
 });
 var tx=teksturK(cv); /* tanpa anisotropi: anisotropy 2 menurunkan FPS sandbox 7,6 -> 3,8 (diukur 31/10) */
 /* ---- penggabung ber-atlas: UV tiap geometri dipetakan ke satu petak, warna per titik (c===null = pakai warna titik bawaan geometri) ---- */
 function wadah(){var bag=[],mt=new T.Matrix4();
  function add(geo,c,tile,x,y,z,rx,ry,rz){geo=geo.index?geo.toNonIndexed():geo;mt.compose(new T.Vector3(x||0,y||0,z||0),new T.Quaternion().setFromEuler(new T.Euler(rx||0,ry||0,rz||0)),new T.Vector3(1,1,1));geo.applyMatrix4(mt);
   var n=geo.attributes.position.count,cl=new T.Color(c||'#fff'),ada=(c===null&&geo.attributes.color),a=new Float32Array(n*3),uv=new Float32Array(n*2),src=geo.attributes.uv,k=(tile==null?7:tile),u0=(k%4)/4,v0=1-(Math.floor(k/4)+1)/4,pd=2/S,tw=0.25-2*pd;
   for(var q=0;q<n;q++){if(ada){a[q*3]=geo.attributes.color.getX(q);a[q*3+1]=geo.attributes.color.getY(q);a[q*3+2]=geo.attributes.color.getZ(q);}else{a[q*3]=cl.r;a[q*3+1]=cl.g;a[q*3+2]=cl.b;}
    var su=src&&tile!=null?Math.min(1,Math.max(0,src.getX(q))):0.5,sv=src&&tile!=null?Math.min(1,Math.max(0,src.getY(q))):0.5;uv[q*2]=u0+pd+su*tw;uv[q*2+1]=v0+pd+sv*tw;}
   geo.setAttribute('color',new T.BufferAttribute(a,3));geo.setAttribute('uv',new T.BufferAttribute(uv,2));if(!geo.attributes.normal)geo.computeVertexNormals();bag.push(geo);}
  function selesai(nama,mat){var tot=0,o=0;bag.forEach(function(g){tot+=g.attributes.position.count;});var A={position:new Float32Array(tot*3),normal:new Float32Array(tot*3),color:new Float32Array(tot*3),uv:new Float32Array(tot*2)};
   bag.forEach(function(g){['position','normal','color'].forEach(function(k){A[k].set(g.attributes[k].array,o*3);});A.uv.set(g.attributes.uv.array,o*2);o+=g.attributes.position.count;g.dispose();});
   var gm=new T.BufferGeometry();for(var k in A)gm.setAttribute(k,new T.BufferAttribute(A[k],k==='uv'?2:3));gm.computeBoundingSphere();return pasangM(nama,gm,mat);}
  return {add:add,selesai:selesai,K:function(w,h,d,x,y,z,c,tile,rx,ry,rz){add(new T.BoxGeometry(w,h,d),c,tile,x,y,z,rx,ry,rz);},
   Cy:function(r,h,x,y,z,c,sg,tile,rx,rz){add(new T.CylinderGeometry(r,r,h,sg||SEG),c,tile,x,y,z,rx,0,rz);}};}
 /* permukaan lengkung atap (grid) */
 function lengkung(x0,x1,z0,z1,nx,nz,dy,bawah){var i,j,p=[],uv=[],idx=[];
  for(i=0;i<=nx;i++)for(j=0;j<=nz;j++){var x=x0+(x1-x0)*i/nx,z=z0+(z1-z0)*j/nz;p.push(x,f(x)+dy,z);uv.push(i/nx,j/nz);}
  for(i=0;i<nx;i++)for(j=0;j<nz;j++){var a=i*(nz+1)+j,b=a+nz+1,c=a+1,d=b+1;if(bawah)idx.push(a,b,c,b,d,c);else idx.push(a,c,b,b,c,d);}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
 /* bidang tegak di bawah lengkung (pedimen), dari y0 sampai f(x)+dy */
 function pedimen(x0,x1,z,y0,dy,n,ganda){var i,p=[],uv=[],idx=[],ymax=f(16)+dy;
  for(i=0;i<=n;i++){var x=x0+(x1-x0)*i/n,yt=Math.max(y0,f(x)+dy);p.push(x,y0,z,x,yt,z);uv.push(i/n,0,i/n,(yt-y0)/(ymax-y0));}
  for(i=0;i<n;i++){var a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);if(ganda)idx.push(a,a+1,a+2,a+1,a+3,a+2);}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
 var W=wadah(),K=W.K,Cy=W.Cy,BB='#d8b46a',BBg='#9c7f3e',PT='#ffffff',DT=2.35,X0=11.3,X1=20.7,Z0=2.6,Z1=8.25;
 /* deck kayu bertekstur (4 lembar 2,15 x 5,6 m, papan membujur depan-belakang) + fasia + 2 anak tangga */
 for(i=0;i<4;i++)W.add(new T.PlaneGeometry(5.6,8.6/4),PT,1,11.7+8.6/8+i*8.6/4,0.001,5.6,-Math.PI/2,0,Math.PI/2);
 K(8.6,-t,5.6,16,t/2-0.002,5.6,'#9c7550');K(8.7,0.06,5.7,16,-0.06,5.6,'#8a6440');
 K(2.2,-t-0.15,0.3,16,(t-0.15)/2,8.55,PT,1);K(2.2,-t-0.3,0.3,16,(t-0.3)/2,8.85,'#d9c2a5',1);
 /* tiang bambu beruas: depan z 8,1, belakang z 3,1, tengah samping z 5,6 */
 [12.0,14.65,17.35,20.0].forEach(function(x){[8.1,3.1].concat(x<13||x>19?[5.6]:[]).forEach(function(z){var h=f(x)-0.12;Cy(0.075,h,x,h/2,z,BB,null,4);for(var r=0.55;r<h;r+=0.62)Cy(0.083,0.035,x,r,z,BBg);});});
 /* atap: lapisan atas hijau "dilukis" warna per petak (2 segitiga) (tanpa tekstur, gaya ringan), bawah kayu laminasi, fasia depan/belakang */
 var gA=lengkung(X0,X1,Z0,Z1,40,16,0.02,false).toNonIndexed(),nA=gA.attributes.position.count,cA=new Float32Array(nA*3),WR=['#5f9e45','#4f8a39','#74b04f','#66a346','#f48fb1','#ffd54f','#ffffff'].map(function(h){var c=new T.Color(h);return[c.r,c.g,c.b];});
 for(i=0;i<nA;i+=3){var mx=(gA.attributes.position.getX(i)+gA.attributes.position.getX(i+1)+gA.attributes.position.getX(i+2))/3,mz=(gA.attributes.position.getZ(i)+gA.attributes.position.getZ(i+1)+gA.attributes.position.getZ(i+2))/3,cx=Math.floor((mx-X0)/((X1-X0)/40)),cz=Math.floor((mz-Z0)/((Z1-Z0)/16)),hh=Math.abs(Math.sin(cx*12.9898+cz*78.233)*43758.5453)%1,w=hh<0.035?WR[4]:hh<0.06?WR[5]:hh<0.075?WR[6]:WR[Math.floor(hh*40)%4];
  for(j=0;j<3;j++){cA[(i+j)*3]=w[0];cA[(i+j)*3+1]=w[1];cA[(i+j)*3+2]=w[2];}}
 gA.setAttribute('color',new T.BufferAttribute(cA,3));W.add(gA,null,null);
 W.add(lengkung(X0,X1,Z0,Z1,18,2,-0.1,true),'#f2e2c4',4);
 [Z0,Z1].forEach(function(z){for(i=0;i<24;i++){var xa=X0+(X1-X0)*i/24,xb=X0+(X1-X0)*(i+1)/24,xm=(xa+xb)/2,L=Math.hypot(xb-xa,f(xb)-f(xa))+0.01;K(L,0.14,0.08,xm,f(xm)-0.04,z,'#c99a55',4,0,0,Math.atan2(f(xb)-f(xa),xb-xa));}});
 /* panel surya: 2 kotak di sisi kanan atap (gaya ringan) */
 [4.4,6.8].forEach(function(z){var x=18.6,y=f(x)+0.12;K(2.0,0.05,2.1,x,y,z,'#1f3a5f',null,0,0,lereng(x));K(2.04,0.02,0.04,x,y+0.03,z,'#8fb3d9',null,0,0,lereng(x));});
 /* pergola depan z 8,25..9,1: gording mengikuti lengkung + busur rusuk laminasi sampai tanah (depan ganda, belakang satu) */
 for(i=0;i<13;i++){var xg=X0+0.3+(X1-X0-0.6)*i/12;K(0.07,0.07,1.0,xg,f(xg)-0.02,8.65,'#c99a55',4,0,0,lereng(xg));}
 function busur(z,r){var pts=[new T.Vector3(11.0,t,z),new T.Vector3(11.05,1.2,z),new T.Vector3(11.3,f(11.3)-0.05,z)];for(var q=1;q<8;q++){var x=11.3+9.4*q/8;pts.push(new T.Vector3(x,f(x)+0.02,z));}pts.push(new T.Vector3(20.7,f(20.7)-0.05,z),new T.Vector3(20.95,1.2,z),new T.Vector3(21.0,t,z));
  W.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,r,TUB,false),PT,4);}
 busur(9.05,0.1);busur(8.75,0.08);busur(2.45,0.08);
 /* dinding bilah bambu: belakang penuh, samping bagian belakang; pedimen belakang bilah (dua sisi) */
 [[12.0,14.65],[14.65,17.35],[17.35,20.0]].forEach(function(b){K(b[1]-b[0]-0.12,DT,0.05,(b[0]+b[1])/2,DT/2,3.05,PT,0);});
 [11.85,20.15].forEach(function(x){K(0.05,DT,2.35,x,DT/2,4.35,PT,0);});
 W.add(pedimen(11.8,20.2,3.04,DT,-0.12,16,true),PT,0);
 K(8.4,0.14,0.12,16,DT,8.1,'#c99a55',4);K(8.4,0.14,0.12,16,DT,3.1,'#c99a55',4);
 /* rangka kaca depan (mullion bambu + palang) */
 for(i=0;i<8;i++){var xm2=12.5+i*1.0,hm=f(xm2)-0.12-DT;if(hm>0.1)Cy(0.035,hm,xm2,DT+hm/2,8.1,BB,6);}
 for(i=0;i<10;i++){var xa2=11.9+i*0.84,xb2=xa2+0.84;if(f(xa2)-0.12>2.95&&f(xb2)-0.12>2.95)K(0.84,0.05,0.06,(xa2+xb2)/2,2.95,8.1,BB);}
 /* pagar bambu rendah (samping depan, depan kecuali tangga) */
 [[11.8,5.6,11.8,8.2],[20.2,5.6,20.2,8.2],[11.8,8.2,14.9,8.2],[17.1,8.2,20.2,8.2]].forEach(function(r){var lx=Math.abs(r[2]-r[0]),lz=Math.abs(r[3]-r[1]);[0.45,0.85].forEach(function(y){K(lx+0.05,0.05,lz+0.05,(r[0]+r[2])/2,y,(r[1]+r[3])/2,BB);});});
 /* 3 meja belajar berbangku + pot tanaman di sudut */
 [13.4,16,18.6].forEach(function(x){K(1.6,0.06,0.8,x,0.75,5.6,PT,6);[[-0.7,-0.3],[0.7,-0.3],[-0.7,0.3],[0.7,0.3]].forEach(function(q){K(0.06,0.72,0.06,x+q[0],0.36,5.6+q[1],'#5d4037');});
  [-0.7,0.7].forEach(function(dz){K(1.4,0.05,0.3,x,0.42,5.6+dz,'#e0c9b0',6);K(0.05,0.4,0.25,x-0.6,0.2,5.6+dz,'#5d4037');K(0.05,0.4,0.25,x+0.6,0.2,5.6+dz,'#5d4037');});});
 [[12.4,3.5],[19.6,3.5],[12.4,7.7],[19.6,7.7]].forEach(function(q){Cy(0.18,0.32,q[0],0.16,q[1],'#b5603c',8);W.add(new T.IcosahedronGeometry(0.24,0),'#4f8a39',null,q[0],0.48,q[1]);});
 /* bingkai papan laporan Adiwiyata (dinding belakang, bilik tengah) */
 K(2.4,1.56,0.05,16,1.5,3.1,'#8a6440');
 /* bak tanaman kayu di depan kanan */
 K(2.8,0.5,0.5,18.75,t+0.25,8.95,PT,1);for(i=0;i<6;i++)W.add(new T.IcosahedronGeometry(0.2,0),i%3?'#4f8a39':'#f48fb1',null,17.6+i*0.46,t+0.58,8.95);
 /* v0.2.0: TAMAN TOGA di sisi kiri gazebo (x 9,4..10,6; z 3,05..8,45): 3 bedeng kayu — sereh, jahe & kunyit, lidah buaya & mint */
 [[3.95,'sereh'],[5.75,'jahe'],[7.55,'lidah']].forEach(function(b){var z=b[0];K(1.2,0.3,1.7,10,t+0.15,z,'#6d4c41',1);K(1.1,0.04,1.6,10,t+0.29,z,'#5b4033');
  for(var q=0;q<6;q++){var px=9.65+(q%2)*0.7,pz=z-0.6+Math.floor(q/2)*0.6,y0=t+0.31;
   if(b[1]==='sereh'){for(var r=0;r<7;r++){var a=r*0.9;W.add(new T.ConeGeometry(0.02,0.7,4),r%2?'#8bc34a':'#7cb342',null,px+Math.cos(a)*0.04,y0+0.35,pz+Math.sin(a)*0.04,Math.sin(a)*0.25,0,Math.cos(a)*0.25);}}
   else if(b[1]==='jahe'){Cy(0.012,0.5,px,y0+0.25,pz,'#558b2f',4);for(var r=0;r<5;r++){var a=r*1.26;K(0.07,0.32,0.01,px+Math.cos(a)*0.09,y0+0.3+r*0.04,pz+Math.sin(a)*0.09,q%2?'#43a047':'#66bb6a',null,0,-a,Math.cos(a)*0.6);}}
   else if(q%2===0){for(var r=0;r<7;r++){var a=r*0.9;W.add(new T.ConeGeometry(0.045,0.42,4),'#8fae87',null,px+Math.cos(a)*0.08,y0+0.18,pz+Math.sin(a)*0.08,Math.sin(a)*0.55,0,-Math.cos(a)*0.55);}}
   else W.add(new T.IcosahedronGeometry(0.15,0),'#5aa45a',null,px,y0+0.1,pz);}});
 K(0.06,0.9,0.06,9.35,t+0.45,8.75,'#5d4037');K(0.06,0.9,0.06,10.65,t+0.45,8.75,'#5d4037');
 /* rumpun bambu hidup (dipindah ke timur jalan setapak x 21,1..22,5 supaya jalan ke kolam lapang) + tiang papan nama */
 [[23.2,3.6],[23.5,4.3],[23.0,4.9],[23.6,7.6],[23.1,8.1]].forEach(function(q,k){var h=2.6+(k%3)*0.5;Cy(0.05,h,q[0],t+h/2,q[1],'#7cb342',6);W.add(new T.IcosahedronGeometry(0.35,1),'#558b2f',null,q[0],t+h,q[1]);});
 K(0.08,1.95,0.08,18.35,t+0.97,9.8,'#5d4037');K(0.08,1.95,0.08,20.85,t+0.97,9.8,'#5d4037');K(2.8,1.08,0.05,19.6,t+1.45,9.77,'#2f6f4f');
 var gz=W.selesai('gazebo',new T.MeshLambertMaterial({vertexColors:true,map:tx}));
 klik(gz.userData.el,{t:'lantai'});
 /* kaca depan: 1 mesh, pantulan palsu (gradasi langit) */
 var kc=kanvas(64,128,function(g,w,h){var gr=g.createLinearGradient(0,0,w*0.6,h);gr.addColorStop(0,'#eaf6ff');gr.addColorStop(0.45,'#9fc6e0');gr.addColorStop(0.55,'#d8ecf7');gr.addColorStop(1,'#5f8fae');g.fillStyle=gr;g.fillRect(0,0,w,h);});
 pasangM('gzKaca',pedimen(11.85,20.15,8.08,DT+0.07,-0.13,16,false),new T.MeshBasicMaterial({map:teksturK(kc),transparent:true,opacity:0.55,side:T.DoubleSide,depthWrite:false}));
 /* semak sekeliling (depan kiri, depan kanan, belakang; sisi kiri = taman TOGA): InstancedMesh, 1 draw call */
 var NS=sentuh?24:36,sm=new T.InstancedMesh(new T.IcosahedronGeometry(0.42,1),new T.MeshLambertMaterial(),NS),d=new T.Object3D(),c=new T.Color(),WS=['#4f8a39','#3f7d32','#6fae4f','#558b2f','#4f8a39','#c98aa0','#6fae4f','#7fb35a'];
 for(i=0;i<NS;i++){var sisi=i%3,u=acak(),x,z;if(sisi===0){x=11.1+u*3.6;z=9.3+acak()*0.5;}else if(sisi===1){x=17.4+u*3.0;z=9.35+acak()*0.3;}else{x=12+u*8;z=2.2+acak()*0.4;}
  d.position.set(x,t+0.2,z);var s=0.6+acak()*0.7;d.scale.set(s*1.2,s*0.8,s*1.2);d.updateMatrix();sm.setMatrixAt(i,d.matrix);sm.setColorAt(i,c.set(WS[i%8]));}
 sm.instanceMatrix.needsUpdate=true;sm.computeBoundingSphere();sm.name='gzSemak';E('a-entity',{}).setObject3D('mesh',sm);
 /* bayangan palsu di bawah gazebo */
 var bc=kanvas(128,128,function(g,w,h){var gr=g.createRadialGradient(w/2,h/2,w*0.2,w/2,h/2,w/2);gr.addColorStop(0,'rgba(20,30,10,0.55)');gr.addColorStop(1,'rgba(20,30,10,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);});
 var bq=pasangM('gzBayang',new T.PlaneGeometry(12,9),new T.MeshBasicMaterial({map:teksturK(bc),transparent:true,depthWrite:false}));bq.rotation.x=-Math.PI/2;bq.position.set(16,t+0.016,5.8);
 /* papan nama Taman TOGA */
 var pg=E('a-entity',{position:'10 '+(t+0.98)+' 8.78'});pg.setAttribute('geometry',{primitive:'plane',width:1.5,height:0.56});pg.setAttribute('material',{src:papanDua('Taman TOGA','Sereh · Jahe · Kunyit · Lidah buaya'),shader:'flat'});
 /* papan laporan Adiwiyata di dinding belakang (dalam gazebo) */
 var pc=kanvas(512,320,function(){}),pt=teksturK(pc),pm=pasangM('gzPapanAdi',new T.PlaneGeometry(2.24,1.4),new T.MeshBasicMaterial({map:pt}));pm.position.set(16,1.5,3.135);
 klik(pm.userData.el,{t:'papanAdi'});
 PAPAN_ADI={cv:pc,tx:pt,j:undefined};segarPapanAdi();
}
/* papan laporan Adiwiyata: digambar dari data infoAdiwiyata yang SUDAH di-cache (prefetchAdi setelah masuk); tidak ada panggilan server tambahan.
   Diperiksa tiap 2 detik (hanya membandingkan objek cache di memori), digambar ulang bila data berubah. */
var PAPAN_ADI=null;
function teksPas(g,s,x,y,maks,ukuran,tebal){var fz=ukuran;g.font=(tebal||'')+' '+fz+'px sans-serif';while(g.measureText(s).width>maks&&fz>10){fz-=1;g.font=(tebal||'')+' '+fz+'px sans-serif';}g.fillText(s,x,y);}
function gambarPapanAdi(j){if(!PAPAN_ADI)return;var g=PAPAN_ADI.cv.getContext('2d'),w=512,h=320,bl='';
 g.fillStyle='#fbfaf4';g.fillRect(0,0,w,h);g.fillStyle='#2f6f4f';g.fillRect(0,0,w,56);
 if(j&&j.ok&&j.bulan){bl=j.bulan;try{bl=new Date(j.bulan+'-01T00:00:00Z').toLocaleDateString('id-ID',{month:'long',year:'numeric',timeZone:'UTC'});}catch(e){}}
 g.textBaseline='middle';g.textAlign='left';g.fillStyle='#fff6dc';teksPas(g,'Laporan Adiwiyata'+(bl?' · '+bl:''),18,29,476,30,'bold');
 g.fillStyle='#33402f';
 if(!j||!j.ok){g.textAlign='center';teksPas(g,!SAYA?'Masuk untuk melihat laporan.':(j?'Laporan belum bisa dimuat.':'Memuat laporan…'),256,170,470,26,'600');}
 else{var pp=(j.papan||[]).slice(0,5),y=86;
  g.font='600 17px sans-serif';g.fillStyle='#6b5a3a';g.fillText('Peringkat rombel bulan ini',18,y-14);
  if(!pp.length){g.fillStyle='#33402f';g.textAlign='center';teksPas(g,'Belum ada poin rombel bulan ini.',256,150,470,24,'600');}
  pp.forEach(function(x,k){var yy=y+12+k*35,me=j.kelas&&x.kelas_id===j.kelas.kelas_id;if(me){g.fillStyle='#e3f1df';g.fillRect(10,yy-15,492,31);}
   g.textAlign='left';g.fillStyle='#2f6f4f';teksPas(g,String(x.r)+'.',18,yy,36,22,'bold');g.fillStyle='#33402f';teksPas(g,String(x.nama_kelas)+(me?' (rombelmu)':''),58,yy,250,22,'600');
   g.textAlign='right';g.fillStyle='#1b5e20';teksPas(g,fPoin(x.poin)+' poin · '+fKg(x.gram)+' kg',494,yy,180,20,'bold');});
  g.textAlign='left';g.fillStyle='#6b5a3a';
  if(j.kompos&&j.kompos.aktif&&j.kompos.bulan)teksPas(g,'Kompos MBG sekolah: '+fKg(j.kompos.bulan.gram_sekolah)+' kg sampah MBG',18,276,476,18,'600');}
 g.fillStyle='#2f6f4f';g.fillRect(0,h-22,w,22);g.fillStyle='#fff6dc';g.textAlign='center';teksPas(g,'Ketuk papan ini untuk membuka Adiwiyata & melapor',256,h-11,490,15,'600');
 PAPAN_ADI.j=j;PAPAN_ADI.tx.needsUpdate=true;}
function segarPapanAdi(){if(!PAPAN_ADI)return;var j=(SAYA&&TOKEN)?KC[TOKEN+'|infoAdiwiyata|{}']:null,kd=j||(SAYA?'muat':'luar');if(kd!==PAPAN_ADI.kd){PAPAN_ADI.kd=kd;gambarPapanAdi(j||null);}}
setInterval(segarPapanAdi,2000);
/* akhir v0.2.0 gazebo realistis */
/* Eco: batas halaman sama dengan Kelas Raudhah v0.22.0; bangunan kelas diganti pagar tanaman + gerbang balik (x -6,9..6,9, z 7,4..8,6). */
var HAL={x0:-13.4,x1:26.4,z0:-8.4,z1:19.3};
var TABRAK=[[11.4,12.0,2.5,8.7],[20.0,20.6,2.5,8.7],[11.4,20.6,2.5,3.1],[11.4,14.9,8.1,8.7],[17.1,20.6,8.1,8.7],
 [16.6,21.4,-4.9,-1.1],
 [-6.9,6.9,7.4,8.6],
 [9.35,10.65,3.05,8.85]]; /* v0.2.0: bedeng Taman TOGA di sisi kiri gazebo */
var GERBANG={x:0,lebar:1.3,z0:7.0,z1:8.95,dekat:false};
function tinggiPijak(x,z){
 if(x>=11.7&&x<=20.3&&z>=2.8&&z<=8.4)return 0;if(x>=14.9&&x<=17.1&&z>8.4&&z<=8.7)return -0.15;if(x>=14.9&&x<=17.1&&z>8.7&&z<=9.0)return -0.3;
 return TANAH;}
function batasGerak(p,dt){
 if(p.x<HAL.x0)p.x=HAL.x0;if(p.x>HAL.x1)p.x=HAL.x1;if(p.z<HAL.z0)p.z=HAL.z0;if(p.z>HAL.z1)p.z=HAL.z1;
 for(var i=0;i<TABRAK.length;i++){var r=TABRAK[i];if(p.x>r[0]&&p.x<r[1]&&p.z>r[2]&&p.z<r[3]){var d=[p.x-r[0],r[1]-p.x,p.z-r[2],r[3]-p.z],m=Math.min(d[0],d[1],d[2],d[3]);
  if(m===d[0])p.x=r[0];else if(m===d[1])p.x=r[1];else if(m===d[2])p.z=r[2];else p.z=r[3];}}
 if(TUJUAN){var jr=Math.hypot(TUJUAN.x-p.x,TUJUAN.z-p.z);if(jr<TUJUAN.d-0.04){TUJUAN.d=jr;TUJUAN.t=Date.now();TUJUAN.n=0;}else if((TUJUAN.n=(TUJUAN.n||0)+1)>20&&Date.now()-TUJUAN.t>1200)TUJUAN=null;}
 /* berjalan masuk ke gerbang balik = konfirmasi pindah (sekali per kedatangan; keluar dari area dulu untuk memicu lagi) */
 var dk=Math.abs(p.x-GERBANG.x)<GERBANG.lebar&&p.z>GERBANG.z0&&p.z<GERBANG.z1;
 if(dk&&!GERBANG.dekat){GERBANG.dekat=true;if(!panelBuka&&SAYA){TUJUAN=null;konfRaudhah();}}else if(!dk)GERBANG.dekat=false;
 if(!duduk){var ty=tinggiPijak(p.x,p.z),dy=ty-p.y;if(Math.abs(dy)<0.005)p.y=ty;else p.y+=dy*Math.min(1,(dt||0.016)*12);}}
function animasiHias(){}
function langkahLangit(){bagian='langit';var T=AFRAME.THREE,i;
 /* langit gradasi (bola terbalik, warna per titik) — sama dengan Kelas Raudhah v0.22.0 langkahIndah bagian 1 */
 var sg=new T.SphereGeometry(110,24,12),cA=new T.Color('#3f86c9'),cB=new T.Color('#d8eef7'),col=[],ps=sg.attributes.position;
 for(i=0;i<ps.count;i++){var y=Math.max(0,ps.getY(i)/110),cc=cB.clone().lerp(cA,Math.pow(y,0.6));col.push(cc.r,cc.g,cc.b);}
 sg.setAttribute('color',new T.Float32BufferAttribute(col,3));var lg=pasangM('langit',sg,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,depthWrite:false,fog:false}));lg.renderOrder=-1;}
function langkahTanah(){bagian='tanah';
 /* sama dengan Kelas Raudhah v0.22.0 langkah5, tanpa semak di samping bangunan kelas; v0.2.0: pohon (9,5;6) -> (7,9;6,6) untuk Taman TOGA, (23,5;10,5) -> (24,8;10,6) supaya jalan setapak kanan lapang */
 var tnh=B(0,TANAH-0.05,0,140,0.1,140,'#7cb342',dunia);klik(tnh,{t:'lantai'});
 [[7,-4.5,1.2],[8.5,-1,1.4],[7.2,2.2,1.1],[7.9,6.6,1.3],[-8,-3,1.3],[-7.5,3,1.2],[6,14.6,1.2],[-4.6,13.6,1.3],[5.6,18.6,1.4],[-9,7.6,1.1],[24.8,10.6,1.3]].forEach(function(t){pohon(t[0],t[1],t[2]);});
 S(45,-6,-20,22,'#5e9c6a',dunia,0.6);S(-50,-8,-5,26,'#6aa874',dunia,0.5);S(20,-9,40,24,'#79b27f',dunia,0.5);
 [[-20,30,-60],[15,34,-50],[40,28,10],[-35,32,20]].forEach(function(t){S(t[0],t[1],t[2],7,'#ffffff',dunia,0.35);});
}
/* gerbang bambu kembali ke Kelas Raudhah, di ujung jalan setapak (bekas tempat bangunan kelas): 1 mesh + 1 papan teks */
function langkahGerbang(){bagian='gerbang balik';var t=TANAH,BB='#c9a95c',BBg='#9c7f3e';
 var g=gabung('gerbangBalik',function(K,Cy){
  [-1.45,1.45].forEach(function(x){Cy(0.11,2.75,x,t+1.375,8.1,BB,8);for(var r=0.5;r<2.7;r+=0.6)Cy(0.12,0.05,x,t+r,8.1,BBg,8);});
  Cy(0.09,3.5,0,t+2.66,8.1,BB,8,0,Math.PI/2);Cy(0.07,3.3,0,t+2.4,8.1,BBg,8,0,Math.PI/2);
  K(5.3,0.85,0.6,-4.25,t+0.42,8.0,'#3f7d3a');K(5.3,0.85,0.6,4.25,t+0.42,8.0,'#3f7d3a');
  K(2.4,0.02,0.9,0,t+0.012,8.45,'#d8cfbf');
 });
 klik(g.userData.el,{t:'gerbang'});
 var pt=plane(0,t+1.95,8.1,2.6,0.5,0,'Ke Kelas Raudhah','#2f6f4f',dunia,52,512);pt.id='gerbangPapan';klik(pt,{t:'gerbang'});
}
var SIAP=false;
function pasangScene(){
 bagian='scene';
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: gerak */
 AFRAME.registerComponent('batas',{tick:function(t,dt){ukurFps(t);vrTick(t);animasiHias(t,dt);var p=this.el.object3D.position;dt=Math.min(dt||16,50)/1000;var lc=cam&&cam.components['look-controls'];
 if(lc&&lc.yawObject&&!panelBuka){var T=KEY,pt=((T.arrowleft||T.q||TURN.l)?1:0)-((T.arrowright||T.e||TURN.r)?1:0);if(pt)lc.yawObject.rotation.y+=pt*1.6*dt;
  if(!duduk){var mj=Math.max(-1,Math.min(1,((T.w||T.arrowup)?1:0)-((T.s||T.arrowdown)?1:0)+joy.y)),gs=Math.max(-1,Math.min(1,(T.d?1:0)-(T.a?1:0)+joy.x));if(mj||gs)TUJUAN=null;
   if(TUJUAN&&!mj&&!gs){var tx=TUJUAN.x-p.x,tz=TUJUAN.z-p.z,jr=Math.hypot(tx,tz),lk=KECEPATAN_JALAN*dt;if(jr<=lk||jr<0.02){p.x=TUJUAN.x;p.z=TUJUAN.z;TUJUAN=null;}else{p.x+=tx/jr*lk;p.z+=tz/jr*lk;}}
   if(mj||gs){var yw=lc.yawObject.rotation.y,sp=1.6*(T.shift?2:1)*dt/Math.max(1,Math.hypot(mj,gs));p.x+=(-Math.sin(yw)*mj+Math.cos(yw)*gs)*sp;p.z+=(-Math.cos(yw)*mj-Math.sin(yw)*gs)*sp;}}}
 var bb=document.getElementById('bBer'),sh=(duduk&&!panelBuka)?'block':'none';if(bb&&bb.style.display!==sh)bb.style.display=sh;
 batasGerak(p,dt);}});

/* akhir UMUM gerak */

 sc=document.importNode(document.getElementById('tpl').content,true).firstElementChild;
 sc.setAttribute('renderer','antialias:'+(!sentuh));
 if(sentuh)sc.setAttribute('xr-mode-ui','enabled:false');
 sc.addEventListener('loaded',function(){
  try{sc.canvas.setAttribute('role','img');sc.canvas.setAttribute('aria-label','Eco-Gazebo 3D: halaman sekolah dengan gazebo, Recycling Hub, kolam, dan bedeng. Ketuk tanah untuk berjalan, ketuk tong untuk melapor sampah; menu di kiri atas.');}catch(e){}
  rig=document.getElementById('rig');cam=document.getElementById('cam');dunia=document.getElementById('dunia');
  if(panelBuka)jedaRender();
  var L=[langkahLangit,langkahTanah,langkahHalaman,langkahGerbang],i=0;
  function jalan(){if(i<L.length){L[i++]();requestAnimationFrame(jalan);}else{
   try{sc.components.raycaster.refreshObjects();}catch(e){}
   document.getElementById('muat').style.display='none';bagian='siap';setV(!SRV_GALAT);FPS.mulai=Date.now()+3000;terapkanKualitas();if(panelBuka)jedaRender();SIAP=true;
   /* v0.2.0: muat bertahap — gazebo realistis dibangun setelah bisa berjalan */
   requestAnimationFrame(function(){try{bagian='gazebo';gazeboEco();sc.components.raycaster.refreshObjects();bagian='siap';if(panelBuka)jedaRender();}catch(e){setV(false);}});}}
  requestAnimationFrame(jalan);
 });
 document.body.appendChild(sc);
}
/* UMUM v0.22.0 — sinkronkan dengan Kelas Raudhah: tutup-panel */
document.getElementById('bTutup').onclick=tutupPanel;document.getElementById('kX').onclick=tutupPanel;pasangPegangan();
document.getElementById('bBerdiri').onclick=function(){tutupPanel();berdiri();};

/* akhir UMUM tutup-panel */

/* Eco: rasio piksel lebih rendah dari Kelas Raudhah (anggaran Eco: Hemat <= 1,0; Tinggi <= 1,5). Pilihan kualitas tetap sama (kr_kualitas). */
var terapkanKualitasUmum=terapkanKualitas;
terapkanKualitas=function(){terapkanKualitasUmum();try{if(sc&&sc.renderer)sc.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,KUALITAS==='hemat'?1:1.5));}catch(e){}};
/* ===== Eco: susun antarmuka (blok UMUM), lalu sesuaikan nama dan butir laci ===== */
bangunMasuk();
IK.rumah='<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>';
IK.pindah='<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>';
(function sesuaikanEco(){
 el('ovlJ').textContent='Eco-Gazebo Raudhah';
 var pk=el('ovl').querySelector('.kt > p');if(pk)pk.textContent='Ruang 3D Adiwiyata: lapor sampah, kompos MBG, dan papan poin rombel. Masuk dengan akun Kelas Raudhah yang sama.';
 var hd=el('hud');hd.setAttribute('aria-label','Menu Eco-Gazebo');
 var kk=hd.querySelector('.lKaki span');if(kk)kk.textContent='Eco-Gazebo '+VERSI;
 var nav=el('laciNav'),bv=el('bVR');
 var bA=document.createElement('button');bA.id='mAturAdi';jadiItem(bA,'atur','Atur Adiwiyata');bA.onclick=function(){bukaAturAdi();};bA.style.display='none';
 var bR=document.createElement('button');bR.id='mRaudhah';jadiItem(bR,'pindah','Kembali ke Kelas Raudhah');bR.onclick=function(){konfRaudhah();};
 var bH=document.createElement('button');bH.id='mBeranda';jadiItem(bH,'rumah','Beranda');bH.onclick=function(){konfHome();};
 nav.insertBefore(bA,bv||null);nav.insertBefore(bR,bv||null);nav.insertBefore(bH,bv||null);
 setLabel(el('mAdi'),'Adiwiyata');
 el('bTutup').textContent='Kembali ke gazebo';
 var hx=el('hudX').onclick;el('hudX').onclick=function(){teksKonf(null);hx.apply(this,arguments);};
})();
var renderHudUmum=renderHud;
renderHud=function(){renderHudUmum();var b=el('mAturAdi');if(b)b.style.display=(SAYA&&SAYA.peran==='pemilik'&&!SAYA.juri)?'':'none';if(SAYA)prefetchAdi();};
cekServer();
mulaiMasuk();
/* A-Frame dimuat SETELAH halaman masuk tampil (berkas terpisah, di-cache browser; tanpa CDN) */
function muatAframe(){
 if(window.AFRAME){try{pasangScene();}catch(e){setV(false);}return;}
 bagian='muat A-Frame';var s=document.createElement('script');s.src=BERKAS_AFRAME;
 s.onload=function(){if(window.AFRAME){try{pasangScene();}catch(e){setV(false);}}};
 s.onerror=function(){setV(false);document.getElementById('muat').textContent='A-Frame gagal dimuat. Periksa koneksi, lalu muat ulang halaman.';};
 document.head.appendChild(s);
}
if(document.readyState==='complete')muatAframe();else window.addEventListener('load',muatAframe);
})();
/* akhir eco_v0.2.0.js — Eco-Gazebo v0.2.0 */

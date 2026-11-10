/* eco_v0.7.0.js — Eco-Gazebo Raudhah v0.7.0 (aplikasi Adiwiyata; dipisah dari Kelas Raudhah v0.22.0 pada 31/10/2026).
   Seluruh kode di SATU (function(){ … })(). Blok "UMUM v0.22.0" disalin APA ADANYA dari Kelas Raudhah index_uji_v0.22.0.html
   (diperiksa uji U-SINKRON terhadap halaman Kelas Raudhah terbaru). Blok "PINDAH v0.22.0" = kode Adiwiyata/halaman yang dipindah;
   perubahannya dicatat di kepala blok. Server Apps Script, spreadsheet, akun, dan GOOGLE_CLIENT_ID SAMA dengan Kelas Raudhah.
   Urutan muat: halaman (login + laci + panel) tampil dulu -> berkas ini -> aframe-v1.5.0.min.js (terpisah, di-cache browser) -> adegan 3D. */
(function(){
/* v0.1.1: SERVER_MIN v0.20.2 = Code.gs ASLI; logika Code v0.20.2 s.d. v0.22.0 sama persis (hanya nomor versi; uji S114) */
var VERSI='v0.7.0', SERVER_MIN='v0.20.2', bagian='awal', srv='', mode='', SRV_GALAT=false;
var API_URL='https://script.google.com/macros/s/AKfycbxhPo2-GvJClHxNav_TMjN4sFiLCzyi8yTFvbIQT62yUQ8NPBaAaIZCbTN5fmN85qc/exec';
var GOOGLE_CLIENT_ID='503152505847-niasbva2uksvum09lsm85j8pursok0b8.apps.googleusercontent.com';
/* alamat Kelas Raudhah HALAMAN ASLI (halaman UJI dan ASLI memakai alamat masing-masing; lihat panduan pasang) */
var URL_RAUDHAH='https://diahayu88.github.io/kelas_raudhah/'; /* v0.3.2: tidak dipakai lagi oleh menu (dipertahankan untuk catatan alamat) */
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

/* Eco: lantai/tanah = berjalan pelan (klik 2x = berhenti), tong = lapor (sama dengan Kelas Raudhah v0.22.0), papanAdi = panel Adiwiyata (v0.3.0: gapura ke Kelas Raudhah dihapus; pindah lewat menu ☰) */
function aksi(info,ev){
 if(panelBuka)return;
 if(info.t==='lantai'){var qg=ev.detail&&ev.detail.intersection;if(qg&&F4.toga(qg.point)){TUJUAN=null;F4.buka('toga');return;} /* v0.6.0: bedeng Taman TOGA = panel info */
  var kn=Date.now();if(kn-KLIK_LANTAI<450){TUJUAN=null;KLIK_LANTAI=0;return;}KLIK_LANTAI=kn;var q=ev.detail&&ev.detail.intersection;if(!q)return;if(duduk){if(ev.detail&&ev.detail.gaze)return;berdiri();}TUJUAN={x:q.point.x,z:q.point.z,t:kn,d:1e9};return;}
 if(info.t==='tong'){var qt=ev.detail&&ev.detail.intersection,jt=qt?tongDari(qt.point.x):'';if(jt==='KRT_QR')jt='KRT';if(jt==='RES'){bukaPanel('Tong residu','#616161','<p>Tong <b>abu-abu</b> untuk <b>residu</b>: sampah yang tidak bisa didaur ulang atau dikompos (bungkus berlapis, popok, puntung, styrofoam kotor).</p><p>Residu tidak dilaporkan untuk poin. Kurangi residu dengan membawa wadah makan dan botol minum sendiri.</p>');}else if(jt){LP.jenis=jt;bukaAdi('');}return;}
 if(info.t==='bank'){TUJUAN=null;F5.buka();return;} /* v0.7.0: papan nilai poin Bank Sampah */
 if(info.t==='toga'){TUJUAN=null;F4.buka('toga');return;} /* v0.6.0: papan nama Taman TOGA */
 if(info.t==='papanAdi'){TUJUAN=null;bukaAdi();return;} /* v0.2.0: papan laporan Adiwiyata di dalam gazebo */
 /* v0.4.0: bedeng = Kebun Simulasi (F1); papan atlas fitur: hanya papan "Kebun Simulasi" yang membuka panel */
 if(info.t==='kebun'){TUJUAN=null;KBN.buka();return;}
 if(info.t==='papanEco'){var qp=ev.detail&&ev.detail.intersection;if(!qp)return;var X=qp.point.x,Z=qp.point.z;
  if(X<18.3&&Z>14.9&&Z<16.7){TUJUAN=null;KBN.buka();}else if(Z<1.3&&X>17.7&&X<18.8){TUJUAN=null;F23.buka('sumur');}else if(X>20.85&&Z>4.1&&Z<4.8){TUJUAN=null;F23.buka('plts');}else if(X<8.1&&Z>-0.7&&Z<1.1){TUJUAN=null;F4.buka('hidro');}else if(Z>11.5&&X>7.9&&X<10.7){TUJUAN=null;F5.buka();}return;}
 /* v0.5.0: cangkang fitur: tutup sumur (F2) dan kotak panel PLTS (F3) membuka panel; bagian lain = berjalan seperti tanah */
 if(info.t==='cangkang'){var qc=ev.detail&&ev.detail.intersection,f=qc?F23.cari(qc.point):'',f4=qc?F4.cari(qc.point):'';if(f){TUJUAN=null;F23.buka(f);return;}if(f4){TUJUAN=null;F4.buka(f4);return;}if(qc&&F5.cari(qc.point)){TUJUAN=null;F5.buka();return;} /* v0.7.0: meja timbang Bank Sampah */ /* v0.6.0: rumah hidroponik */
 aksi({t:'lantai'},ev);return;}
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

/* PINDAH v0.22.0 — sinkronkan dengan Kelas Raudhah: adi (diubah: tanpa tombol "← Meja guru" (meja guru ada di Kelas Raudhah); petunjuk menunjuk guru Adiwiyata; takaran EM4 dibuka di panel Atur Adiwiyata Eco; v0.3.0: Kelola rombel ada di Eco) */
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
 if(a==='adRombel'){if(!window.confirm('Buat rombel 7A sampai 9K yang belum ada?'))return true;b.disabled=true;gs('buatRombel').then(function(j){b.disabled=false;if(j&&j.ok){bukaAdi(kid);setTimeout(function(){tampilHasil(j.jumlah?esc(j.jumlah)+' rombel baru dibuat: '+esc(j.dibuat.join(', '))+'. Kode kelas tiap rombel ada di menu ☰ → Kelola rombel.':'Semua rombel 7A–9K sudah ada.');},500);}else tampilHasil(galatSoal(j));});return true;}
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
  var h='<div class="baris"><button class="s2" data-act="mAdi">← Adiwiyata</button><button class="s2" data-act="kelR">Kelola rombel</button></div><h3>Guru Adiwiyata</h3><p><small>♻ Guru Adiwiyata boleh menyetujui laporan sampah, mencatat timbangan, menunjuk kader, dan mengunduh rekap Adiwiyata. '+(j.adiSemua?'Belum ada yang ditunjuk, jadi <b>semua guru</b> boleh.':'Hanya guru bertanda ♻ (dan pemilik).')+'</small></p>';
  j.guru.forEach(function(g){var ubah=g.peran==='guru'&&g.jenis!=='juri';if(g.jenis==='juri')return;h+='<div class="sd gr" data-id="'+esc(g.id)+'"><b>'+esc(g.nama)+'</b> <small>('+esc(g.peran)+')</small>'+(g.aktif?'':' <span class="err">nonaktif</span>')+(g.adi?' <span class="ok">♻ Adiwiyata</span>':'')+(ubah?'<div class="baris"><button class="s2" data-act="grAktif" data-v="'+(g.aktif?'0':'1')+'" aria-label="'+(g.aktif?'Nonaktifkan ':'Aktifkan ')+esc(g.nama)+'">'+(g.aktif?'Nonaktifkan':'Aktifkan')+'</button><button class="s2" data-act="grAdi" data-v="'+(g.adi?'0':'1')+'" aria-label="'+(g.adi?'Lepas ♻ guru Adiwiyata: ':'Jadikan ♻ Adiwiyata: ')+esc(g.nama)+'">'+(g.adi?'Lepas ♻ guru Adiwiyata':'Jadikan ♻ Adiwiyata')+'</button></div>':'')+'</div>';});
  /* v0.3.0: tambah guru, akun sandi guru, dan Log (dulu hanya di Kelas Raudhah → Panel Admin) */
  h+='<h3>Tambah guru (akun Google)</h3><div class="baris"><input id="ge" aria-label="Email Google guru" placeholder="Email Google guru"><input id="gn" aria-label="Nama guru" placeholder="Nama"><button class="p" data-act="tambahGuru">Tambah</button></div>';
  h+='<h3>Akun sandi guru</h3><div class="baris"><input id="gsn" aria-label="Nama guru (akun sandi)" placeholder="Nama guru"><button class="p" data-act="akunGuru">Buat akun sandi</button></div><small>Guru nonaktif tidak bisa masuk; kelas dan data siswanya tetap tersimpan.</small>';
  h+='<h3>Log aktivitas</h3><div class="baris"><button class="s2" data-act="logAdi">Lihat log aktivitas</button></div><p><small>Pengaturan umum aplikasi tetap di Kelas Raudhah → Meja guru → Panel Admin.</small></p>';
  h+='<div id="admK"><p>Memuat pengaturan kompos…</p></div>';
  el('kb').innerHTML=(dc?'<div class="muat" id="sg"></div>':'')+h+akhir;
  if(!dc){isiAdmKompos(pn);pesanTunda();}
 });
}
function aksiAturAdi(a,b){
 if(a==='grAdi'){var g3=b.closest('.gr');if(!g3)return true;b.disabled=true;gs('aturGuruAdi',{id:g3.getAttribute('data-id'),adi:b.getAttribute('data-v')==='1'}).then(function(j){b.disabled=false;if(j&&j.ok)bukaAturAdi();else tampilHasil(galatSoal(j));});return true;}
 if(a==='simpanKompos'){var at={},jn=[],st=el('pkSt');Array.prototype.forEach.call(document.querySelectorAll('#kb .pk'),function(x){at[x.getAttribute('data-k')]=x.value;});
  Array.prototype.forEach.call(document.querySelectorAll('#kb .pkA'),function(c){var x=document.querySelector('#kb .pkJ[data-k="'+c.getAttribute('data-k')+'"]');jn.push({kode:c.getAttribute('data-k'),berat_g:x?x.value:'',aktif:c.checked});});
  b.disabled=true;st.className='hs';st.textContent='Menyimpan…';gs('simpanKompos',{atur:at,jenis:jn}).then(function(j){b.disabled=false;if(j&&j.ok){st.className='hs ok';st.textContent='Pengaturan kompos tersimpan.';}else{st.className='hs no';st.innerHTML=galatSoal(j);}});return true;}
 return false;
}
/* ===== v0.3.0: KELOLA ROMBEL (guru & pemilik) + Guru & Log (pemilik) — diadaptasi dari Kelas Raudhah v0.22.0 bukaKelola / bukaKelasDetail /
   bukaAdmin / aksiAdmin. Aksi server SAMA (daftarKelas, buatKelas, buatAkunSandi, daftarSiswa, aturKelas, aturSiswa, aturGuru, tambahGuru, lihatLog),
   jadi Code.gs tidak berubah. Tidak dibawa: Papan Bintang, progres belajar, rekap nilai (khusus Kelas Raudhah). Semua izin diperiksa server. ===== */
var KLS=null,PESAN_TUNDA=null; /* pesan hasil ditampilkan SETELAH panel selesai digambar ulang (dulu setTimeout 400 ms, bisa tertimpa di HP lambat) */
function pesanTunda(){if(PESAN_TUNDA){tampilHasil(PESAN_TUNDA);PESAN_TUNDA=null;}}
function jenisLogin(j){return {sandi:'akun sandi',daftar:'daftar sendiri',google:'Google',juri:'juri'}[j]||j;}
function bukaKelolaR(){
 if(!SAYA||SAYA.peran==='siswa')return;
 bukaPanel('Kelola rombel','#2e7d32','<div class="muat"></div><p>Memuat…</p>');var pn=PNL;
 gsc('daftarKelas',null,function(j,dc,lama){
  if(pn!==PNL)return;
  if(lama&&!dc){if(!(j&&j.ok)||JSON.stringify(j)===JSON.stringify(lama)){hapusSg();return;}}
  if(!j||!j.ok){el('kb').innerHTML='<p class="err">'+esc(j&&j.error||'Gagal.')+'</p>';return;}
  var h='<div class="baris"><button class="s2" data-act="mAdi">← Adiwiyata</button></div><h3>Rombel</h3><p><small>Bagikan kode kelas kepada siswa untuk mendaftar. Ketuk <b>Siswa</b> untuk memindahkan siswa ke rombelnya, mengaktifkan/menonaktifkan akun, atau membuat sandi baru.'+(SAYA.peran==='pemilik'?' Pemilik melihat semua rombel.':' Guru melihat rombel yang dibuatnya; rombel lain (mis. 7A–9K buatan pemilik) dikelola pemilik.')+'</small></p>';
  if(!j.kelas.length)h+='<p><small>Belum ada rombel.</small></p>';
  j.kelas.forEach(function(k){h+='<div class="baris dr krR"><span>'+esc(k.nama_kelas)+(SAYA.juri?' · rombel demo juri':' · kode <b>'+esc(k.kode_kelas)+'</b>')+(k.status==='nonaktif'?' · <b class="err">kode nonaktif</b>':'')+'</span><button class="p" style="width:auto" data-act="kSiswa" data-k="'+esc(k.kelas_id)+'" aria-label="Siswa '+esc(k.nama_kelas)+'">Siswa</button></div>';});
  if(SAYA.juri)h+='<p><small>Akun juri tidak dapat membuat rombel atau akun baru.</small></p>';
  else{
   h+='<h3>Buat rombel</h3><div class="baris"><input id="kn" aria-label="Nama rombel baru" placeholder="Nama rombel, mis. 7A" maxlength="60"><button class="p" data-act="buatKelas">Buat</button></div>';
   if(SAYA.peran==='pemilik')h+='<small>Untuk membuat sekaligus 33 rombel 7A–9K, gunakan tombol <b>Buat rombel 7A–9K</b> di panel Adiwiyata.</small>';
   h+='<h3>Buat akun sandi siswa</h3><p><small>Untuk siswa tanpa akun Google. Username dan sandi tampil sekali; catat dan berikan kepada siswa.</small></p><div class="baris"><select id="kk" aria-label="Rombel untuk akun siswa">'+j.kelas.map(function(k){return '<option value="'+esc(k.kelas_id)+'">'+esc(k.nama_kelas)+'</option>';}).join('')+'</select></div><div class="baris"><input id="ksn" aria-label="Nama siswa" placeholder="Nama lengkap siswa" maxlength="80"><button class="p" data-act="akunSiswa">Buat</button></div>';
  }
  h+='<p><small>Papan Bintang dan progres belajar tetap di Kelas Raudhah.</small></p><div id="hasilK" class="hasil" role="status" style="display:none"></div>';
  el('kb').innerHTML=(dc?'<div class="muat" id="sg"></div>':'')+h;if(!dc)pesanTunda();
 });
}
function bukaRombelDetail(kid){
 if(!SAYA||SAYA.peran==='siswa')return;
 bukaPanel('Siswa rombel','#2e7d32','<div class="muat"></div><p>Memuat…</p>');var pn=PNL;
 gsc('daftarSiswa',{kelas_id:kid},function(j,dc,lama){
  if(pn!==PNL)return;
  if(lama&&!dc){if(!(j&&j.ok)||JSON.stringify(j)===JSON.stringify(lama)){hapusSg();return;}}
  var kembali='<div class="baris"><button class="s2" data-act="kelR">← Kelola rombel</button></div>';
  if(!j||!j.ok){el('kb').innerHTML=kembali+'<p class="err">'+esc(j&&j.error||'Gagal.')+'</p>';return;}
  KLS=j;var juriK=(SAYA.juri||j.status==='juri'),h=kembali;
  h+='<h3>'+esc(j.nama_kelas)+'</h3><p>'+(juriK?'Rombel demo juri':'Kode kelas <b>'+esc(j.kode_kelas)+'</b>')+' · kode '+esc(j.status)+' · '+esc(j.siswa.length)+' siswa</p>';
  if(!juriK){
   h+='<h3>Atur rombel</h3><div class="baris"><button class="s2" data-act="gKode">Ganti kode kelas</button><button class="s2" data-act="stKelas" data-v="'+(j.status==='aktif'?'nonaktif':'aktif')+'">'+(j.status==='aktif'?'Nonaktifkan kode kelas':'Aktifkan kode kelas')+'</button></div><small>Kode nonaktif atau diganti: siswa baru tidak bisa bergabung dengan kode lama. Siswa yang sudah terdaftar tetap bisa masuk.</small>';
   h+='<div class="lb" id="nkL">Nama rombel</div><div class="baris"><input id="nk" aria-labelledby="nkL" maxlength="60" value="'+esc(j.nama_kelas)+'"><button class="p" data-act="nmKelas">Simpan nama</button></div>';
  }
  h+='<h3>Siswa</h3>';
  if(!j.siswa.length)h+='<p><small>Belum ada siswa di rombel ini.</small></p>';
  var lain=(j.kelasLain||[]).filter(function(k){return k.kelas_id!==j.kelas_id;});
  j.siswa.forEach(function(x){
   h+='<div class="sd sw" data-id="'+esc(x.id)+'"><b>'+esc(x.nama)+'</b>'+(x.pendek?' ('+esc(x.pendek)+')':'')+' <span class="'+(x.aktif?'ok':'err')+'">'+(x.aktif?'aktif':'nonaktif')+'</span><br><small>'+esc(jenisLogin(x.jenis))+': '+esc(x.login)+'</small>';
   if(!juriK){
    h+='<div class="baris"><button class="s2" data-act="swAktif" data-v="'+(x.aktif?'0':'1')+'" aria-label="'+(x.aktif?'Nonaktifkan ':'Aktifkan ')+esc(x.nama)+'">'+(x.aktif?'Nonaktifkan':'Aktifkan')+'</button>'+((x.jenis==='sandi'||x.jenis==='daftar')?'<button class="s2" data-act="swSandi" aria-label="Atur ulang sandi '+esc(x.nama)+'">Atur ulang sandi</button>':'')+'</div>';
    if(lain.length)h+='<div class="baris"><select class="swK" aria-label="Pindahkan '+esc(x.nama)+' ke rombel">'+lain.map(function(k){return '<option value="'+esc(k.kelas_id)+'">'+esc(k.nama_kelas)+(k.status!=='aktif'?' (kode nonaktif)':'')+'</option>';}).join('')+'</select><button class="s2" data-act="swPindah" aria-label="Pindahkan '+esc(x.nama)+'">Pindahkan</button></div>';
   }
   h+='</div>';
  });
  h+='<div id="hasilK" class="hasil" role="status" style="display:none"></div>';
  el('kb').innerHTML=(dc?'<div class="muat" id="sg"></div>':'')+h;if(!dc){el('kartu').scrollTop=0;pesanTunda();}
 });
}
/* Log aktivitas (pemilik): 100 catatan terbaru dari tab Log, bisa disaring menurut nama aksi */
function bukaLogAdi(){
 if(!SAYA||SAYA.peran!=='pemilik'||SAYA.juri)return;
 var cari=(el('lgC')&&el('lgC').value)||'';
 var kembali='<div class="baris"><button class="s2" data-act="aturAdiK">← Atur Adiwiyata</button></div>';
 bukaPanel('Log aktivitas','#6a3fa0',kembali+'<div class="muat"></div><p>Memuat…</p>');var pn=PNL;
 gsc('lihatLog',{n:100,cari:cari},function(j,dc){
  if(pn!==PNL)return;if(!j||!j.ok){el('kb').innerHTML=kembali+'<p class="err">'+esc(j&&j.error||'Gagal.')+'</p>';return;}
  var h=kembali+'<h3>Log</h3><p><small>'+esc(j.log.length)+' catatan terbaru ditampilkan (maks. 100) dari '+esc(j.total)+' baris di tab Log.</small></p><div class="baris"><input id="lgC" aria-label="Saring menurut nama aksi" placeholder="Saring aksi, mis. lapor, timbang, kader" value="'+esc(cari)+'"><button class="p" data-act="logAdi">Tampilkan</button></div>';
  if(!j.log.length)h+='<p><small>Tidak ada catatan.</small></p>';
  h+='<div class="lg">'+j.log.map(function(r){return '<div class="lgR"><small>'+esc(r.waktu)+'</small> <b>'+esc(r.aksi)+'</b> · '+esc(r.pelaku)+'<br><small>'+esc(r.detail)+'</small></div>';}).join('')+'</div>';
  el('kb').innerHTML=(dc?'<div class="muat" id="sg"></div>':'')+h;
 });
}
function aksiKelola(a,b){
 var hasil=function(j,ok){tampilHasil(j&&j.ok?ok:galatSoal(j));};
 if(a==='kelR'){bukaKelolaR();return true;}
 if(a==='aturAdiK'){bukaAturAdi();return true;}
 if(a==='logAdi'){bukaLogAdi();return true;}
 if(a==='kSiswa'){bukaRombelDetail(b.getAttribute('data-k'));return true;}
 if(a==='buatKelas'){b.disabled=true;gs('buatKelas',{nama:el('kn').value}).then(function(j){b.disabled=false;if(j&&j.ok){PESAN_TUNDA='Rombel <b>'+esc(j.nama_kelas||'')+'</b> dibuat'+(j.kode_kelas?' dengan kode <b>'+esc(j.kode_kelas)+'</b>':'')+'.';bukaKelolaR();}else hasil(j);});return true;}
 if(a==='akunSiswa'||a==='akunGuru'){var guru=(a==='akunGuru'),d=guru?{nama:el('gsn').value,peran:'guru'}:{nama:el('ksn').value,kelas_id:el('kk')&&el('kk').value};
  b.disabled=true;gs('buatAkunSandi',d).then(function(j){b.disabled=false;hasil(j,'Akun '+esc(j&&j.peran)+' dibuat untuk <b>'+esc(j&&j.nama)+'</b><br>Username: <b>'+esc(j&&j.username)+'</b><br>Sandi: <b>'+esc(j&&j.sandi)+'</b><br><small>Catat sekarang. Sandi tidak ditampilkan lagi.</small>');});return true;}
 if(a==='tambahGuru'){b.disabled=true;gs('tambahGuru',{email:el('ge').value,nama:el('gn').value}).then(function(j){b.disabled=false;if(j&&j.ok){PESAN_TUNDA='Guru <b>'+esc(j.nama)+'</b> ditambahkan. Ia masuk dengan akun Google tersebut.';bukaAturAdi();}else hasil(j);});return true;}
 if(a==='grAktif'){var g=b.closest('.gr'),on2=b.getAttribute('data-v')==='1';if(!g)return true;if(!on2&&!window.confirm('Nonaktifkan guru ini? Ia langsung keluar. Kelas dan data siswanya tetap tersimpan.'))return true;b.disabled=true;gs('aturGuru',{id:g.getAttribute('data-id'),aktif:on2}).then(function(j){b.disabled=false;if(j&&j.ok)bukaAturAdi();else hasil(j);});return true;}
 if(!KLS&&(a==='gKode'||a==='stKelas'||a==='nmKelas'||a.indexOf('sw')===0))return false;
 if(a==='gKode'){if(!window.confirm('Ganti kode kelas '+KLS.nama_kelas+'? Kode lama tidak bisa dipakai lagi untuk bergabung.'))return true;b.disabled=true;gs('aturKelas',{kelas_id:KLS.kelas_id,ubah:'gantiKode'}).then(function(j){b.disabled=false;if(j&&j.ok){PESAN_TUNDA='Kode baru: <b>'+esc(j.kode_kelas)+'</b>';bukaRombelDetail(KLS.kelas_id);}else hasil(j);});return true;}
 if(a==='stKelas'){var v=b.getAttribute('data-v');b.disabled=true;gs('aturKelas',{kelas_id:KLS.kelas_id,ubah:v}).then(function(j){b.disabled=false;if(j&&j.ok)bukaRombelDetail(KLS.kelas_id);else hasil(j);});return true;}
 if(a==='nmKelas'){b.disabled=true;gs('aturKelas',{kelas_id:KLS.kelas_id,ubah:'nama',nama:el('nk').value}).then(function(j){b.disabled=false;if(j&&j.ok)bukaRombelDetail(KLS.kelas_id);else hasil(j);});return true;}
 var kartu=b.closest&&b.closest('.sw'),id=kartu&&kartu.getAttribute('data-id');
 if(a==='swAktif'&&id){var on=b.getAttribute('data-v')==='1';if(!on&&!window.confirm('Nonaktifkan siswa ini? Ia langsung keluar dan tidak bisa masuk sampai diaktifkan lagi. Laporannya tetap tersimpan.'))return true;b.disabled=true;gs('aturSiswa',{id:id,aktif:on}).then(function(j){b.disabled=false;if(j&&j.ok)bukaRombelDetail(KLS.kelas_id);else hasil(j);});return true;}
 if(a==='swSandi'&&id){if(!window.confirm('Buat sandi baru untuk siswa ini? Sandi lama tidak berlaku lagi.'))return true;b.disabled=true;gs('aturSiswa',{id:id,resetSandi:true}).then(function(j){b.disabled=false;hasil(j,'Sandi baru untuk <b>'+esc(j&&j.login)+'</b>: <b>'+esc(j&&j.sandi)+'</b><br><small>Catat sekarang dan berikan ke siswa. Sandi tidak ditampilkan lagi.</small>');});return true;}
 if(a==='swPindah'&&id){var s2=kartu.querySelector('.swK');if(!s2)return true;if(!window.confirm('Pindahkan siswa ini ke '+s2.options[s2.selectedIndex].text+'? Poin dan bintang pribadinya ikut pindah.'))return true;b.disabled=true;gs('aturSiswa',{id:id,pindahKe:s2.value}).then(function(j){b.disabled=false;if(j&&j.ok)bukaRombelDetail(KLS.kelas_id);else hasil(j);});return true;}
 return false;
}
/* akhir v0.3.0 kelola rombel */
function klikPanel(e){
 var b=e.target.closest&&e.target.closest('[data-act]');if(!b)return;var a=b.getAttribute('data-act');
 if(terlaluCepat(a))return;
 if(KBN.aksi(a,b))return; /* v0.4.0: Kebun Simulasi */
 if(F23.aksi(a,b))return; /* v0.5.0: sumur resapan + PLTS */
 if(F4.aksi(a,b))return; /* v0.6.0: hidroponik + Taman TOGA */
 if(F5.aksi(a,b))return; /* v0.7.0: Bank Sampah */
 if(aksiAturAdi(a,b))return;
 if(aksiKelola(a,b))return;
 if(aksiAdi(a,b))return;
}
/* ===== Eco: konfirmasi pindah halaman (v0.3.2: hanya Beranda; pindah ke Kelas Raudhah dihapus). ===== */
var KONF_ASLI=null;
function teksKonf(t){var k=el('konfK');if(!k)return;var ik=k.querySelector('.kIk');
 if(!KONF_ASLI)KONF_ASLI={j:el('konfJ').textContent,i:el('konfI').textContent,ya:el('kYa').textContent,ik:ik.innerHTML};
 var x=t||KONF_ASLI;el('konfJ').textContent=x.j;el('konfI').textContent=x.i;el('kYa').textContent=x.ya;ik.innerHTML=x.ik;k.classList.toggle('pindah',!!t);}
function keHome(){location.href=URL_HOME;}
function konfKe(t,lanjut){if(terbukaLain())return;laciBuka(false);teksKonf(t);bukaKonf(lanjut);}
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

/* ===== v0.3.0: HALAMAN RINGKAS milik Eco (denah usulan disetujui 01/11/2026). Menggantikan blok PINDAH "halaman" dari Kelas Raudhah v0.22.0.
   Halaman x 4,5..27,5 × z −6..20 (dulu x −14..27): berpusat pada gazebo; gapura "Ke Kelas Raudhah" dan bekas halaman Kelas Raudhah dihapus.
   Gerbang depan sekolah (16; 20) segaris tangga gazebo; jalan melingkar gazebo; kolam bioswale (11; 16) kiri depan; bedeng sayur + komposter EM4 kanan depan;
   Recycling Hub tetap (8–10; 10,6) [v0.4.0: diganti Bank Sampah x 7,8..10,8 × z 9,2..11,8; tong di z 11,42], Taman TOGA tetap (kiri gazebo); gedung sekolah sebagai latar (z −9,5). Kembali ke Kelas Raudhah = menu ☰.
   Mesh: 'halaman' (1 draw call), 'hub' (diketuk = lapor), papan nama gazebo = 1 bidang teks. */
function papanDua(t1,t2){var cv=document.createElement('canvas');cv.width=512;cv.height=192;var g=cv.getContext('2d');g.fillStyle='#2f6f4f';g.fillRect(0,0,512,192);g.strokeStyle='#a77b52';g.lineWidth=10;g.strokeRect(5,5,502,182);
 g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6dc';var fz=40;g.font='bold '+fz+'px sans-serif';while(g.measureText(t1).width>470&&fz>14){fz-=1;g.font='bold '+fz+'px sans-serif';}g.fillText(t1,256,78);
 g.fillStyle='#cfe8d8';fz=32;g.font='600 '+fz+'px sans-serif';while(g.measureText(t2).width>470&&fz>12){fz-=1;g.font='600 '+fz+'px sans-serif';}g.fillText(t2,256,132);return cv.toDataURL();}
function langkahHalaman(){bagian='halaman';var t=TANAH,HJ='#2f6f4f',PG='#3f7d3a',G='#d8cfbf',i;
 /* papan nama gazebo (tiangnya ada di mesh gazebo) */
 var gp=E('a-entity',{position:'16 '+(t+2.76)+' 20.045'});gp.setAttribute('geometry',{primitive:'plane',width:1.76,height:0.66});gp.setAttribute('material',{src:papanDua('Eco-Gazebo Raudhah','MTsN 7 Kediri · Sekolah Adiwiyata'),shader:'flat'}); /* v0.7.0: papan gapura */
 var pn=E('a-entity',{position:'19.6 '+(t+1.45)+' 9.805'});pn.setAttribute('geometry',{primitive:'plane',width:2.7,height:1.0});pn.setAttribute('material',{src:papanDua('The Eco-Gazebo Classroom','Sustainability in Action'),shader:'flat'});
 gabung('halaman',function(K,Cy,Bl){
  /* jalan kerikil: masuk dari gerbang depan lurus ke tangga, lalu melingkari gazebo */
  K(1.6,0.02,6.6,16,t+0.012,16.4,G);K(1.6,0.02,2.9,16,t+0.014,10.45,G);
  K(15.9,0.02,1.2,14.55,t+0.01,12.5,G);K(15.9,0.02,1.2,14.55,t+0.01,-2.6,G);
  K(1.2,0.02,16.3,7.2,t+0.011,4.95,G);K(1.4,0.02,16.3,21.8,t+0.011,4.95,G);
  for(i=0;i<24;i++){Bl(0.04,15.3+(i*7.31)%1.4,t+0.02,13.4+(i*3.7)%6.0,'#bfb4a1',0.4);}
  /* kolam bioswale (11; 16) + batu tepi + tanaman air */
  Cy(2.1,0.03,11,t+0.02,16,'#5aa9d6',28);Cy(1.5,0.032,11,t+0.022,16,'#4b97c4',24);
  for(i=0;i<14;i++){var a=i*Math.PI*2/14;Bl(0.22,11+Math.cos(a)*2.2,t+0.06,16+Math.sin(a)*2.2,i%2?'#9e9e9e':'#8d8d8d',0.5);}
  for(i=0;i<6;i++){var b=i*1.05+0.3;Cy(0.025,0.7,11+Math.cos(b)*1.75,t+0.35,16+Math.sin(b)*1.75,'#558b2f',5);Cy(0.025,0.55,11.1+Math.cos(b)*1.75,t+0.28,15.9+Math.sin(b)*1.75,'#7cb342',5);}
  /* v0.4.0: bedeng sayur 4 lajur (x 18,4..24,4; z 14..17,6) dipindah ke mesh 'kebunBedeng' (F1 Kebun Simulasi, bisa diketuk) */
  /* komposter EM4 (25,9; 15,8) */
  K(1.4,0.9,1.2,25.9,t+0.45,15.8,'#43a047');K(1.5,0.08,1.3,25.9,t+0.94,15.8,'#1b5e20');K(0.5,0.12,0.02,25.9,t+0.6,16.41,'#fff6dc');
  /* bangku kayu menghadap jalan: depan kiri gazebo dan belakang gazebo */
  [[13.2,10.4],[16,-4.2]].forEach(function(q){var x=q[0],z=q[1];K(1.5,0.06,0.42,x,t+0.45,z,'#8d6e63');K(0.06,0.42,0.38,x-0.65,t+0.21,z,'#6d4c41');K(0.06,0.42,0.38,x+0.65,t+0.21,z,'#6d4c41');K(1.5,0.4,0.05,x,t+0.8,z-0.19,'#8d6e63');});
  /* gerbang depan sekolah (16; 20) + pagar tanaman keliling halaman */
  [14.4,17.6].forEach(function(x){K(0.4,2.4,0.4,x,t+1.2,20,'#f4ecd8');K(0.5,0.12,0.5,x,t+2.46,20,HJ);});K(3.7,0.35,0.25,16,t+2.2,20,HJ);
  /* v0.7.0: papan nama di atas gapura + jalan kerikil dan pelataran di luar gerbang (titik mulai: depan gapura) */
  K(1.9,0.74,0.08,16,t+2.76,20,HJ);K(1.6,0.02,3.6,16,t+0.012,22.0,G);K(5.0,0.02,2.0,16,t+0.01,23.0,'#cfc6b4');
  [13.9,18.1].forEach(function(x){K(0.7,0.4,0.7,x,t+0.2,21.2,'#a1887f');Bl(0.32,x,t+0.5,21.2,'#4f8a39',0.8);});
  K(9.7,0.8,0.6,9.35,t+0.4,20,PG);K(9.7,0.8,0.6,22.65,t+0.4,20,PG);K(23.6,0.8,0.6,16,t+0.4,-6.0,PG);K(0.6,0.8,26.6,4.5,t+0.4,7.0,PG);K(0.6,0.8,26.6,27.5,t+0.4,7.0,PG);
  /* gedung sekolah sebagai latar (P5 bawaan: kotak berwarna kabut) */
  K(26,7,2.5,16,t+3.5,-9.5,'#dfe6ea');K(26.4,0.3,2.9,16,t+7.1,-9.5,'#c9d3d8');[1.9,4.4].forEach(function(y){K(24,0.9,0.05,16,t+y,-8.23,'#b8c6ce');});
 });
 /* v0.4.0: Recycling Hub diganti Bank Sampah (cangkang dibangun di fiturEco). 4 tong pilah + kios QR tetap di x yang SAMA (tongDari tidak berubah),
    pindah ke depan bangunan z 11,42 di atas lantai Bank Sampah (tinggi 0,12 m). Ketuk = Lapor sampah (sama dengan Hub lama). */
 var tong=gabung('bankTong',function(K){var y0=t+0.12,zt=11.42;
  [['#1e88e5','#1565c0'],['#fbc02d','#f9a825'],['#43a047','#2e7d32'],['#757575','#616161']].forEach(function(w,j){var x=8.2+j*0.42;K(0.34,0.62,0.34,x,y0+0.31,zt,w[0]);K(0.38,0.05,0.38,x,y0+0.645,zt,w[1]);K(0.16,0.16,0.01,x,y0+0.41,zt+0.175,'#ffffff');});
  K(0.32,0.95,0.2,9.95,y0+0.475,zt,'#2f6f4f');K(0.22,0.22,0.012,9.95,y0+0.78,zt+0.106,'#ffffff');[[-0.07,0.07],[0.07,0.07],[-0.07,-0.07]].forEach(function(q){K(0.05,0.05,0.014,9.95+q[0],y0+0.78+q[1],zt+0.108,'#222222');});});
 klik(tong.userData.el,{t:'tong'});
 KBN.bangunBedeng(); /* v0.4.0: bedeng Kebun Simulasi (1 mesh, diketuk = panel) */
}
/* akhir v0.3.0 halaman ringkas */
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
 K(0.06,0.9,0.06,9.27,t+0.45,5.0,'#5d4037');K(0.06,0.9,0.06,9.27,t+0.45,6.5,'#5d4037'); /* v0.6.0: tiang papan TOGA pindah ke sisi jalan barat (dulu z 8,75 terhalang dinding belakang Bank Sampah) */
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
 var pg=E('a-entity',{position:'9.24 '+(t+0.98)+' 5.75',rotation:'0 -90 0'}); /* v0.6.0: menghadap jalan barat (x 7,2) */pg.setAttribute('geometry',{primitive:'plane',width:1.5,height:0.56});pg.setAttribute('material',{src:papanDua('Taman TOGA','Sereh · Jahe · Kunyit · Lidah buaya'),shader:'flat'});
 klik(pg,{t:'toga'}); /* v0.6.0: papan nama Taman TOGA = panel info */
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
setInterval(function(){segarPapanAdi();try{F5.segar();}catch(e){}},2000); /* v0.7.0: + papan nilai poin Bank Sampah */
/* akhir v0.2.0 gazebo realistis */
/* ===== v0.4.0: CANGKANG 6 FITUR (konsep K0 disetujui pengguna 10/11/2026 20:40). Dibangun 1 bingkai SETELAH gazebo (muat bertahap).
   Semua cangkang = 1 mesh Lambert 'ecoCangkang' (Bank Sampah, rumah hidroponik NFT, tutup sumur resapan + talang + pipa tegak, kotak panel PLTS,
   dudukan galeri di 3 meja, tiang papan Kebun Simulasi) + 1 mesh kaca 'ecoKaca' (dinding/atap hidroponik) + 1 mesh papan 'ecoPapan' (atlas kanvas 512 px).
   Total +3 draw call. Isi rinci F2–F6 (hujan, instalasi listrik, sayur NFT, timbang, karya) menyusul di versi berikut. Diketuk = berjalan (seperti gazebo);
   hanya papan "Kebun Simulasi" yang membuka panel. Letak & TABRAK = denah K0. ===== */
function fiturEco(){var T=AFRAME.THREE,t=TANAH,i,j,k;
 var LAM=function(o){return new T.MeshLambertMaterial(Object.assign({vertexColors:true},o||{}));};
 var ck=gabung('ecoCangkang',function(K,Cy,Bl){var i,j,k;
  /* F5 BANK SAMPAH (x 7,8..10,8 × z 9,2..11,8), terbuka ke jalan melingkar (+z) */
  K(3.0,0.12,2.6,9.3,t+0.06,10.5,'#cfc6b4');
  [[7.95,9.35],[10.65,9.35],[7.95,11.65],[10.65,11.65]].forEach(function(q){K(0.12,2.55,0.12,q[0],t+1.27,q[1],'#8a6440');});
  K(2.8,2.3,0.08,9.3,t+1.27,9.32,'#efe7d2');K(0.08,1.05,2.2,7.97,t+0.64,10.45,'#efe7d2');K(0.08,1.05,2.2,10.63,t+0.64,10.45,'#efe7d2');
  K(2.8,0.12,0.1,9.3,t+2.5,11.65,'#8a6440');
  K(3.5,0.07,1.7,9.3,t+2.66,11.18,'#2e7d32',0,0,0.33);K(3.5,0.07,1.7,9.3,t+2.66,9.82,'#2e7d32',0,0,-0.33);K(3.55,0.1,0.12,9.3,t+2.94,10.5,'#1b5e20');
  [['#1e88e5',8.45],['#fbc02d',9.05],['#43a047',9.65],['#757575',10.25]].forEach(function(s){K(0.55,0.06,0.5,s[1],t+0.18,9.65,'#8d6e63');Bl(0.27,s[1],t+0.5,9.65,s[0],1.35);Bl(0.1,s[1],t+0.86,9.65,s[0],0.6);});
  K(0.6,0.88,1.0,10.3,t+0.56,10.45,'#a77b52');K(0.7,0.05,1.1,10.3,t+1.02,10.45,'#795548');K(0.36,0.06,0.32,10.28,t+1.08,10.2,'#b0bec5');K(0.2,0.12,0.03,10.28,t+1.17,10.05,'#263238');K(0.26,0.03,0.2,10.28,t+1.06,10.75,'#c62828');
  K(2.6,0.08,0.08,9.3,t+2.42,10.5,'#6d4c41');Cy(0.008,0.5,9.3,t+2.13,10.5,'#424242',4);Cy(0.12,0.05,9.3,t+1.82,10.5,'#eceff1',16,Math.PI/2);Cy(0.008,0.25,9.3,t+1.66,10.5,'#424242',4);Bl(0.2,9.3,t+1.38,10.5,'#fbc02d',1.2);
  /* F4 RUMAH HIDROPONIK NFT (x 8,0..11,0 × z −1,8..2,2): rangka, 2 rak A (3 tingkat × 2 sisi pipa), sayur contoh, tandon + pompa; pintu barat */
  K(3.0,0.08,4.0,9.5,t+0.04,0.2,'#d6d0c4');
  [8.05,10.95].forEach(function(x){[-1.75,0.2,2.15].forEach(function(z){K(0.07,2.1,0.07,x,t+1.05,z,'#f5f5f5');});});
  [-1.75,0.2,2.15].forEach(function(z){K(1.62,0.06,0.06,8.78,t+2.48,z,'#f5f5f5',0,0.47);K(1.62,0.06,0.06,10.22,t+2.48,z,'#f5f5f5',0,-0.47);});
  K(0.06,0.06,3.95,9.5,t+2.85,0.2,'#f5f5f5');K(0.06,0.06,3.95,8.05,t+2.1,0.2,'#f5f5f5');K(0.06,0.06,3.95,10.95,t+2.1,0.2,'#f5f5f5');
  K(0.05,1.9,0.05,8.05,t+0.95,-0.25,'#f5f5f5');K(0.05,1.9,0.05,8.05,t+0.95,0.65,'#f5f5f5');K(0.05,0.05,0.9,8.05,t+1.9,0.2,'#f5f5f5');
  [8.95,10.05].forEach(function(xr){[0,1,2].forEach(function(lv){var y=t+0.55+lv*0.38,dx=0.38-lv*0.12;[-1,1].forEach(function(sd){var x=xr+sd*dx;Cy(0.05,3.3,x,y,0.2,'#eeeeee',8,Math.PI/2);
    for(var q=0;q<7;q++)Bl(0.085,x,y+0.09,-1.25+q*0.48,(q+lv)%3?'#7cb342':'#9ccc65',0.75);});});
   K(0.04,1.4,0.04,xr,t+0.7,-1.5,'#bdbdbd');K(0.04,1.4,0.04,xr,t+0.7,1.9,'#bdbdbd');});
  Cy(0.33,0.55,10.45,t+0.36,1.75,'#1565c0',16);Cy(0.34,0.04,10.45,t+0.65,1.75,'#0d47a1',16);K(0.18,0.14,0.14,10.0,t+0.15,1.85,'#424242');Cy(0.02,1.2,9.62,t+0.7,1.9,'#263238',6);
  /* F2 SUMUR RESAPAN: tutup Ø 1,2 m di (19,3; 0,9) + talang kanan atap + pipa tegak sudut belakang kanan + pipa ke sumur; batu pijakan dari jalan belakang */
  Cy(0.62,0.06,19.3,t+0.03,0.9,'#9e9a92',28);Cy(0.55,0.08,19.3,t+0.07,0.9,'#c9c5bd',28);K(0.3,0.03,0.05,19.3,t+0.12,0.9,'#757575');
  Cy(0.06,6.0,20.86,2.36,5.6,'#9e9e9e',8,Math.PI/2);Cy(0.05,2.85,20.86,0.95,2.6,'#bdbdbd',8);
  K(0.42,0.12,0.42,20.86,t+0.06,2.25,'#8d8d8d');K(0.09,0.09,1.47,20.3,t+0.05,1.77,'#bdbdbd',0.857);
  for(k=0;k<5;k++)Cy(0.22,0.04,19.3+((k%2)?0.12:-0.1),t+0.02,-2.05+k*0.42,'#bfb4a1',10);
  K(0.06,1.0,0.06,18.25,t+0.5,0.93,'#6d4c41');
  /* F3 v0.5.0: kotak panel PLTS TERBUKA (pintu dilipat rapat ke dinding, tidak menjorok ke jalan kanan): pelat dasar, SCC (biru), inverter (putih),
     rel DIN berisi MCB DC (merah) dan MCB AC (biru), meteran kWh, baterai di bawah, kabel, arde hijau-kuning ke tanah; pipa kabel ke panel surya atap */
  K(0.2,0.9,0.7,20.82,t+1.1,4.45,'#cfd8dc');K(0.025,0.9,0.66,20.935,t+1.1,3.74,'#b0bec5');K(0.012,0.14,0.14,20.95,t+1.3,3.74,'#fbc02d');
  K(0.006,0.84,0.64,20.925,t+1.1,4.45,'#f5f5f5');
  K(0.035,0.22,0.17,20.945,t+1.33,4.27,'#1565c0');K(0.004,0.06,0.1,20.965,t+1.38,4.27,'#90caf9');
  K(0.05,0.26,0.24,20.95,t+1.31,4.6,'#eceff1');K(0.004,0.05,0.12,20.977,t+1.38,4.6,'#263238');
  K(0.012,0.02,0.58,20.935,t+1.05,4.45,'#9e9e9e');
  [4.22,4.29,4.36,4.5,4.57,4.66].forEach(function(z,k){K(0.04,0.09,0.035,20.95,t+1.05,z,'#fafafa');K(0.006,0.025,0.012,20.972,t+1.06,z,k<3?'#e53935':'#1e88e5');});
  K(0.035,0.15,0.12,20.945,t+0.84,4.62,'#fafafa');K(0.004,0.04,0.08,20.965,t+0.87,4.62,'#263238');
  K(0.06,0.17,0.3,20.955,t+0.79,4.3,'#37474f');K(0.01,0.03,0.03,20.99,t+0.89,4.2,'#e53935');K(0.01,0.03,0.03,20.99,t+0.89,4.4,'#212121');
  K(0.012,0.012,0.18,20.97,t+1.2,4.27,'#e53935');K(0.012,0.25,0.012,20.97,t+1.17,4.38,'#212121');K(0.012,0.012,0.22,20.97,t+0.97,4.5,'#212121');
  Cy(0.008,1.2,21.0,t+0.4,4.82,'#7cb342',4);Cy(0.02,0.25,21.0,t+0.1,4.95,'#bdbdbd',6);Cy(0.025,1.38,20.84,t+2.24,4.45,'#78909c',6);
  /* 3 lampu gantung di atas meja (kabel + kap); bohlam menyala = mesh 'pltsLampu' (F3) */
  [13.4,16,18.6].forEach(function(x){var yt=2.45+0.95*(1-Math.pow((x-16)/4.6,2));Cy(0.006,yt-2.25,x,(yt+2.25)/2,5.6,'#424242',4);Cy(0.13,0.12,x,2.2,5.6,'#33691e',12);});
  /* F6 dudukan galeri karya di 3 meja gazebo */
  [13.4,16,18.6].forEach(function(x){Cy(0.3,0.025,x,0.79,5.6,'#263238',20);});
  /* F1 tiang papan Kebun Simulasi */
  K(0.06,0.9,0.06,17.9,t+0.45,15.8,'#6d4c41');
 },LAM());
 klik(ck.userData.el,{t:'cangkang'}); /* v0.5.0: ketuk sumur/kotak panel = panel fitur; bagian lain = berjalan */
 F23.bangun();
 F5.bangun(); /* v0.7.0: papan nilai poin Bank Sampah */
 gabung('ecoKaca',function(K){
  K(1.66,0.02,4.0,8.78,t+2.5,0.2,'#e3f2fd',0,0.47);K(1.66,0.02,4.0,10.22,t+2.5,0.2,'#e3f2fd',0,-0.47);
  K(0.02,2.1,4.0,10.95,t+1.05,0.2,'#e3f2fd');K(2.9,2.1,0.02,9.5,t+1.05,-1.75,'#e3f2fd');K(2.9,2.1,0.02,9.5,t+1.05,2.15,'#e3f2fd');
  K(0.02,2.1,1.9,8.05,t+1.05,-1.2,'#e3f2fd');K(0.02,2.1,1.45,8.05,t+1.05,1.42,'#e3f2fd');
 },LAM({transparent:true,opacity:0.28,depthWrite:false,side:T.DoubleSide}));
 /* atlas papan 512×512: [judul, sub, warna, x0,y0,x1,y1 piksel] */
 var PP=[['BANK SAMPAH RAUDHAH','Pilah · Timbang · Tabung','#2f6f4f',0,0,512,84],['HIDROPONIK NFT','tanpa tanah · hemat air','#2f6f4f',0,88,384,170],
  ['SUMUR RESAPAN','air hujan meresap ke tanah','#1565c0',0,174,256,302],['PANEL PLTS','listrik dari matahari','#8a5a00',256,174,512,302],['KEBUN SIMULASI','ketuk bedeng untuk menanam','#2e7d32',0,306,320,466]];
 var cv=kanvas(512,512,function(g){var i;g.fillStyle='#000';g.fillRect(0,0,512,512);
  for(i=0;i<PP.length;i++){var p=PP[i],x=p[3],y=p[4],w=p[5]-x,h=p[6]-y,fz;g.fillStyle=p[2];g.fillRect(x,y,w,h);g.strokeStyle='#a77b52';g.lineWidth=Math.max(4,h*0.08);g.strokeRect(x+g.lineWidth/2,y+g.lineWidth/2,w-g.lineWidth,h-g.lineWidth);
   g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff6dc';fz=Math.floor(h*0.36);g.font='bold '+fz+'px sans-serif';while(g.measureText(p[0]).width>w*0.86&&fz>8){fz--;g.font='bold '+fz+'px sans-serif';}g.fillText(p[0],x+w/2,y+h*0.39);
   g.fillStyle='#e8f3ec';fz=Math.floor(h*0.22);g.font='600 '+fz+'px sans-serif';while(g.measureText(p[1]).width>w*0.86&&fz>8){fz--;g.font='600 '+fz+'px sans-serif';}g.fillText(p[1],x+w/2,y+h*0.74);}});
 function uvP(p){return [p[3]/512,1-p[6]/512,p[5]/512,1-p[4]/512];}
 /* quads: p pusat, u setengah-lebar (arah kanan papan), v setengah-tinggi; muka = u×v */
 var pq=quads([{p:[9.3,t+2.28,11.72],u:[1.3,0,0],v:[0,0.21,0],uv:uvP(PP[0])},{p:[7.99,t+2.25,0.2],u:[0,0,0.75],v:[0,0.16,0],uv:uvP(PP[1])},
  {p:[18.25,t+1.1,0.895],u:[-0.4,0,0],v:[0,0.2,0],uv:uvP(PP[2])},{p:[20.95,t+1.74,4.45],u:[0,0,-0.25],v:[0,0.125,0],uv:uvP(PP[3])},{p:[17.865,t+1.05,15.8],u:[0,0,0.55],v:[0,0.275,0],uv:uvP(PP[4])}]);
 var pm=pasangM('ecoPapan',pq,new T.MeshBasicMaterial({map:teksturK(cv)}));klik(pm.userData.el,{t:'papanEco'});
}
/* akhir v0.4.0 cangkang fitur */
/* ===== v0.4.0: F1 KEBUN SIMULASI tanam–panen (bedeng depan). Seluruh kode di dalam penutup KBN supaya nama mesin prototipe (S, G, …) tidak
   bertabrakan dengan nama Eco (S = awan, G = …). MESIN (TANAMAN, ZONA, baru, catat, tahap, namaTahap, AKSI, lakukan, lewatHari, diagnosa, campur)
   DISALIN APA ADANYA dari konsep/f1/simulasi_tanam_prototipe_v0.2.html (aturan bersumber: KONSEP_ECO_FITUR_v0.4.0.md §4).
   Tempo (K2/K2a 10/11): 1 siklus kangkung = 15 menit tetap (1 hari = 36 dtk), Jeda; waktu hanya berjalan saat panel Kebun terbuka dan tab terlihat.
   Pengaturan guru (5–60 menit, izin lompat hari) menyusul bersama perubahan Code.gs berikutnya (K2a bawaan). Tanpa server: kemajuan di localStorage
   per akun ('eco_kebun_v1_<id>'); bila localStorage gagal, simulasi tetap jalan di memori (dengan pemberitahuan).
   3D: 'kebunBedeng' (4 lajur + permukaan tanah berubah: basah/genangan, kering/retak; 1 draw call, diketuk = panel) dan 'kebunTanaman'
   (InstancedMesh 40 tanaman; geometrinya dibangun ulang hanya bila keadaan visual berubah: sehat / terlalu basah / kering / pupuk berlebih (+ pucat, mati),
   tahap dan ukuran, bunga & buah cabai/tomat). Tanaman dibangun saat siswa ≤ 6 m dari bedeng atau panel dibuka; disembunyikan saat > 8 m.
   Saat panel terbuka render dijeda (aturan UMUM), jadi adegan digambar SEKALI tiap keadaan berubah (renderSekali).
   HP tegak: kamera turun setinggi tanaman (mata 0,42 m, sela lajur x 23,0) dan panel ringkas 44 % layar; layar mendatar/laptop: berdiri di sudut
   (17,3; 19,1) menghadap bedeng, digeser supaya bedeng tidak tertutup panel kanan. Posisi & arah pandang dikembalikan saat panel ditutup. ===== */
var KBN=(function(){
/* ---------- MESIN (apa adanya dari prototipe v0.2) ---------- */
var TANAMAN={
 kangkung:{nama:'Kangkung',panen:25,buah:false,uap:1.15,serap:1.0,daunL:44,daunW:9,ket:'panen ±21–30 hari · suka lembap'},
 sawi:{nama:'Sawi / pakcoy',panen:35,buah:false,uap:1.0,serap:1.1,daunL:38,daunW:17,ket:'panen ±30–45 hari · daun lebar'},
 bayam:{nama:'Bayam',panen:28,buah:false,uap:1.0,serap:1.0,daunL:30,daunW:14,ket:'panen ±25–30 hari'},
 cabai:{nama:'Cabai rawit',panen:75,buah:true,warnaBuah:'#e53935',uap:0.9,serap:1.2,daunL:26,daunW:8,ket:'panen awal ±70–90 hari · berbuah'},
 tomat:{nama:'Tomat',panen:65,buah:true,warnaBuah:'#ef5350',uap:1.05,serap:1.3,daunL:30,daunW:12,ket:'panen mulai ±9 minggu · berbuah'}
};
var ZONA={air:[60,80],hara:[40,75],garam:[0,35]};
var S=null;
var G={menit:15,lompat:false},jeda=false; /* Eco v0.4.0: tetap 15 menit, tanpa lompat hari (pengaturan guru menyusul, K2a) */
function dph(){return G.menit*60/TANAMAN.kangkung.panen;}
function batas(v){return Math.max(0,Math.min(100,v));}
function baru(k){var L=(S&&S.lencana)||[];S={k:k,hari:1,air:68,hara:50,garam:5,organik:10,sehat:85,maju:0,jenuh:0,mentah:0,lepas:0,mati:false,panen:false,sumSehat:0,nHari:0,log:[],lencana:L,pesan:null};
 catat('Benih '+TANAMAN[k].nama+' ditanam. Tanah lembap, hara cukup.');S.pesan=diagnosa();simpan();gambar();}
function catat(t){S.log.unshift('Hari '+S.hari+': '+t);if(S.log.length>40)S.log.pop();}
function tahap(){var p=S.maju,b=TANAMAN[S.k].buah;
 if(p<0.05)return 0;if(p<0.15)return 1;if(p<0.35)return 2;if(b){if(p<0.6)return 3;if(p<0.8)return 4;if(p<1)return 5;return 6;}if(p<1)return 3;return 6;}
function namaTahap(){var t=tahap(),b=TANAMAN[S.k].buah;return (b?['Benih','Kecambah','Bibit','Vegetatif','Berbunga','Berbuah','Siap panen']:['Benih','Kecambah','Bibit','Vegetatif','','','Siap panen'])[t];}
var AKSI={
 siram:{judul:'Siram',p:'Berapa banyak air?',pil:[['1 gayung (sedikit)',12],['2 gayung',24],['1 ember (banyak)',45]]},
 npk:{judul:'Pupuk NPK',p:'Pupuk kimia larut cepat. Berapa banyak?',pil:[['½ sendok',1],['1 sendok',2],['3 sendok (berlebihan)',6]]},
 kompos:{judul:'Kompos',p:'Kompos MBG dari komposter EM4 sekolah:',pil:[['1 genggam kompos matang',1],['2 genggam kompos matang',2],['Kompos belum matang (baru 5 hari)',-1]]},
 hari:{judul:'Akhiri hari',p:'Lompat waktu (diizinkan guru):',pil:[['1 hari',1],['5 hari (berhenti bila ada masalah)',5]]}
};
function lakukan(a,v){if(S.mati||S.panen)return;
 if(a==='siram'){var sebelum=S.air,isi=S.air+v,lebih=Math.max(0,isi-100);S.air=batas(isi);
  if(lebih>0){S.garam=batas(S.garam-lebih*0.5);S.hara=batas(S.hara-lebih*0.12);catat('Disiram '+v+' %. Air berlebih mengalir keluar, ikut mencuci garam dan sebagian hara.');}
  else catat('Disiram: kelembapan '+Math.round(sebelum)+' → '+Math.round(S.air)+' %.');}
 if(a==='npk'){var k=S.air<40?1.5:1;S.hara=batas(S.hara+14*v);S.garam=batas(S.garam+12*v*k);
  catat('Pupuk NPK '+(v===1?'½':v===2?'1':'3')+' sendok: hara naik cepat, kadar garam tanah naik'+(k>1?' (tanah kering: garam makin pekat)':'')+'.');}
 if(a==='kompos'){if(v<0){S.organik=batas(S.organik+15);S.mentah=3;catat('Kompos belum matang ditabur: masih panas dan mikrobanya menyerap nitrogen tanah.');}
  else{S.organik=batas(S.organik+18*v);S.hara=batas(S.hara+4*v);S.lepas+=8*v;catat('Kompos matang '+v+' genggam: tanah lebih gembur, hara dilepas perlahan beberapa hari.');}}
 if(a==='hari'){for(var i=0;i<v;i++){var d=lewatHari();if(S.mati||S.panen)break;if(v>1&&i<v-1&&d.tingkat!=='ok'){break;}}}
 S.pesan=diagnosa();simpan();gambar();}
function lewatHari(){var T=TANAMAN[S.k],ukuran=0.6+0.8*Math.min(1,S.maju),d0=S.sehat,dS=0;
 /* jenuh dihitung dari keadaan tanah sepanjang hari ini (setelah disiram) */
 S.jenuh=S.air>=92?S.jenuh+1:0;
 /* air menguap; bahan organik membuat tanah menahan air lebih lama */
 S.air=batas(S.air-9*T.uap*ukuran*(1-0.35*S.organik/100));
 /* bedengan meniriskan air berlebih (gravitasi) */
 if(S.air>88)S.air=batas(S.air-6);
 /* hara: diserap tanaman; kompos melepas hara perlahan */
 var rilis=Math.min(S.lepas,3);S.lepas-=rilis;S.hara=batas(S.hara+rilis-3.2*T.serap*ukuran*(S.mentah>0?1.6:1));
 S.garam=batas(S.garam-2);S.organik=batas(S.organik-0.8);
 var masalah=[];
 if(S.air<30){dS-=12;masalah.push('kering');}else if(S.air<ZONA.air[0]){dS-=4;masalah.push('kurangAir');}
 if(S.jenuh>=2){dS-=10;masalah.push('basah');}else if(S.air>ZONA.air[1]+8){dS-=2;}
 if(S.hara<25){dS-=6;masalah.push('lapar');}else if(S.hara<ZONA.hara[0]){dS-=2;masalah.push('pucat');}
 var g=S.garam*(S.air<40?1.5:1);if(g>60){dS-=12;masalah.push('garam');}else if(g>ZONA.garam[1]){dS-=5;masalah.push('garamSedang');}
 if(S.mentah>0){dS-=6;S.mentah--;masalah.push('mentah');}
 if(!masalah.length)dS+=5;
 S.sehat=batas(S.sehat+dS);
 var laju=S.sehat>=70?1:S.sehat>=40?0.6:0.2;S.maju=Math.min(1,S.maju+laju/T.panen);
 S.sumSehat+=S.sehat;S.nHari++;S.hari++;
 if(S.sehat<=0){S.mati=true;catat('Tanaman mati setelah beberapa hari salah urus.');}
 else if(S.maju>=1){catat('Tanaman siap dipanen!');}
 else catat('Hari berganti. Kesehatan '+Math.round(d0)+' → '+Math.round(S.sehat)+' %.');
 return diagnosa();}
function diagnosa(){var g=S.garam*(S.air<40?1.5:1),T=TANAMAN[S.k];
 if(S.mati)return{tingkat:'b',j:'Tanaman mati.',t:'Masalah dibiarkan berhari-hari sampai sel tanaman rusak. Baca riwayat di bawah untuk mencari penyebabnya, lalu tanam ulang.'};
 if(S.maju>=1)return{tingkat:'ok',j:'Siap panen!',t:'Rata-rata kesehatan '+Math.round(S.sumSehat/Math.max(1,S.nHari))+' %. Tekan Panen.'};
 if(S.jenuh>=2)return{tingkat:'b',j:'Daun menguning dan layu walau tanah basah.',t:'Pori tanah penuh air sehingga akar kekurangan oksigen; jamur mudah tumbuh dan akar bisa busuk. Jangan menyiram dulu 1–2 hari.'};
 if(S.air<30)return{tingkat:'b',j:'Daun menggulung dan terkulai.',t:'Sel kehilangan tekanan turgor dan tanaman menutup stomata, pertumbuhan berhenti. Siram sekarang.'};
 if(g>60)return{tingkat:'b',j:'Tepi dan ujung daun cokelat "terbakar".',t:'Garam pupuk di tanah terlalu pekat sehingga air tertarik keluar dari akar. Siram banyak untuk mencuci garam, jangan menambah NPK.'};
 if(S.mentah>0)return{tingkat:'w',j:'Pertumbuhan terhambat setelah diberi kompos.',t:'Kompos belum matang masih terurai: panas dan mikrobanya memakai nitrogen tanah. Kompos perlu dimatangkan dulu (komposter EM4).'};
 if(S.hara<25)return{tingkat:'b',j:'Daun pucat menguning mulai dari daun tua, tanaman kerdil.',t:'Kekurangan nitrogen. Beri kompos matang (lambat tapi aman) atau sedikit NPK.'};
 if(g>ZONA.garam[1])return{tingkat:'w',j:'Ujung daun mulai cokelat.',t:'Kadar garam pupuk mulai tinggi, apalagi bila tanah kering. Kurangi pupuk kimia.'};
 if(S.air<ZONA.air[0])return{tingkat:'w',j:'Tanah mulai kering.',t:'Air di bawah zona pas (60–80 %). Tanaman masih sehat, tetapi sebaiknya disiram.'};
 if(S.air>ZONA.air[1]+8)return{tingkat:'w',j:'Tanah sangat basah.',t:'Bila jenuh 2 hari, akar kekurangan oksigen. Tunda menyiram.'};
 if(S.hara<ZONA.hara[0])return{tingkat:'w',j:'Hara menipis.',t:'Daun tua bisa mulai pucat. Kompos matang melepas hara perlahan.'};
 return{tingkat:'ok',j:'Tanaman sehat.',t:'Air, hara, dan garam di zona pas: akar mendapat air dan udara, daun hijau segar. Tekan "Akhiri hari".'};}
function campur(a,b,t){t=Math.max(0,Math.min(1,t));var p=function(c,i){return parseInt(c.substr(i,2),16);};var r=[1,3,5].map(function(i){return Math.round(p(a,i)+(p(b,i)-p(a,i))*t).toString(16).padStart(2,'0');});return '#'+r.join('');}
/* ---------- akhir mesin ---------- */

/* ---------- penyimpanan per akun (try/catch: localStorage bisa dimatikan/penuh/mode privat) ---------- */
var KB={buka:false,membuka:false,uid:null,gagal:false,pil:null,bukaD:{},simpanPose:null,im:null,bedeng:null,kunciV:'',kunciT:'',dekat:false};
function kunci(){return 'eco_kebun_v1_'+String(KB.uid||'tamu');}
function sahS(x){return x&&typeof x==='object'&&(x.k===null||x.k===undefined||TANAMAN[x.k])&&Array.isArray(x.log)&&isFinite(x.hari)&&isFinite(x.air)&&isFinite(x.sehat)&&isFinite(x.maju);}
function simpan(){try{localStorage.setItem(kunci(),JSON.stringify(S));KB.gagal=false;}catch(e){KB.gagal=true;}}
function muat(){S=null;try{var t=localStorage.getItem(kunci());if(t){var x=JSON.parse(t);if(sahS(x))S=x;}}catch(e){S=null;KB.gagal=true;}}
function akun(){var id=(typeof SAYA!=='undefined'&&SAYA&&SAYA.id)?String(SAYA.id):null;if(id!==KB.uid||S===undefined){KB.uid=id;KB.gagal=false;jeda=false;KB.pil=null;if(id)muat();else S=null;return true;}return false;}

/* ---------- panel ---------- */
function hEsc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
var PENDEK={'Air tanah':'Air','Kesehatan':'Sehat'};
function ln(n,v,warna,zona,teks){return '<div class="kbLn"><b>'+(PENDEK[n]?'<span class="kbF">'+n+'</span><span class="kbP">'+PENDEK[n]+'</span>':n)+'</b><span class="kbBar" aria-hidden="true">'+(zona?'<u style="left:'+zona[0]+'%;width:'+(zona[1]-zona[0])+'%"></u>':'')+'<i style="width:'+Math.round(v)+'%;background:'+warna+'"></i></span><em>'+(teks||Math.round(v)+'%')+'</em></div>';}
function htmlBenih(){var o='<p><b>Pilih benih untuk petakmu.</b> Waktu berjalan sendiri: 1 hari = '+Math.round(dph())+' detik (kangkung ± '+G.menit+' menit). Waktu berhenti saat panel ditutup. Kemajuan tersimpan di perangkat ini saja.</p><div class="kbBenih">';
 for(var k in TANAMAN)o+='<button class="s2" data-act="kbBenih" data-v="'+k+'"><b>'+TANAMAN[k].nama+'</b><small>'+TANAMAN[k].ket+' · ± '+Math.round(TANAMAN[k].panen*dph()/60)+' menit</small></button>';
 o+='</div>'+(S&&S.lencana&&S.lencana.length?'<p class="kbLenc"><small>Lencana panenmu:</small> '+S.lencana.map(function(l){return '<span>'+hEsc(l)+'</span>';}).join('')+'</p>':'');
 return o;}
function htmlKebun(){var T=TANAMAN[S.k],d=S.pesan||diagnosa(),t=tahap(),nT=T.buah?6:4,ti=T.buah?t:Math.min(t,3)+(t===6?1:0),g=S.garam*(S.air<40?1.5:1),i;
 var o='<div class="kbInfo"><span><b>'+T.nama+'</b> · '+namaTahap()+'</span><span>Hari <b>'+S.hari+'</b> / ±'+T.panen+'</span></div>';
 o+='<div class="kbJam" aria-hidden="true"><i id="kbJam" style="width:'+Math.round(100*(S.detik||0)/dph())+'%"></i></div><div class="kbTh" aria-hidden="true">';
 for(i=0;i<=nT;i++)o+='<i class="'+(i<=ti?'on':'')+'"></i>';
 o+='</div><div class="kbLns">'+ln('Air tanah',S.air,'#1e88e5',ZONA.air)+ln('Hara',S.hara,'#7cb342',ZONA.hara)+ln('Garam',Math.min(100,g),'#fb8c00',ZONA.garam)+ln('Kesehatan',S.sehat,S.sehat>=70?'#43a047':S.sehat>=40?'#f9a825':'#e53935')+ln('Organik',S.organik,'#8d6e63')+'</div>';
 o+='<div class="kbMsg '+(d.tingkat==='ok'?'':d.tingkat)+'" role="status"><b>'+d.j+'</b> '+(G.lompat?d.t:d.t.replace('Tekan "Akhiri hari".','Waktu berjalan sendiri; amati perubahannya tiap hari.'))+'</div>';
 if(S.mati||S.panen)o+='<div class="kbAksi"><button class="p" data-act="kbUlang">Tanam ulang</button><button class="s2" data-act="kbGanti">Ganti benih</button></div>';
 else if(S.maju>=1)o+='<div class="kbAksi"><button class="p" data-act="kbPanen">Panen</button><button class="s2" data-act="kbGanti">Ganti benih</button></div>';
 else{o+='<div class="kbAksi">';['siram','npk','kompos'].forEach(function(a){o+='<button class="p" data-act="kbPil" data-v="'+a+'" aria-expanded="'+(KB.pil===a)+'">'+(a==='kompos'?'Kompos MBG':AKSI[a].judul)+'</button>';});
  o+=(G.lompat?'<button class="s2" data-act="kbPil" data-v="hari" aria-expanded="'+(KB.pil==='hari')+'">Akhiri hari ▸</button>':'<button class="s2" data-act="kbJeda" aria-pressed="'+jeda+'">'+(jeda?'Lanjut ▶':'Jeda ⏸')+'</button>')+'</div>';
  if(KB.pil&&AKSI[KB.pil])o+='<div class="kbPil" id="kbPilihan"><p>'+AKSI[KB.pil].p+'</p><div class="baris">'+AKSI[KB.pil].pil.map(function(q){return '<button class="p" data-act="kbX" data-x="'+KB.pil+'" data-v="'+q[1]+'">'+q[0]+'</button>';}).join('')+'</div></div>';}
 o+='<details><summary>Riwayat petak</summary><ol class="kbLog">'+S.log.map(function(l){return '<li>'+hEsc(l)+'</li>';}).join('')+'</ol></details>';
 return o;}
function htmlSumber(){return '<details><summary>Aturan &amp; sumber (untuk guru)</summary><p><small>Simulasi disederhanakan untuk pembelajaran; angka bukan ukuran laboratorium. Waktu: 1 siklus kangkung = '+G.menit+' menit (cabai rawit ± '+Math.round(75*dph()/60)+' menit, tomat ± '+Math.round(65*dph()/60)+' menit). Pengaturan tempo oleh guru menyusul.</small></p><table class="kbTbl">'+
 '<tr><th>Aturan</th><th>Dasar</th></tr>'+
 '<tr><td>Zona air pas 60–80 %</td><td>Rentang kelembapan 60–80 % air tersedia memberi hasil sayur lebih baik (UMD Extension, Irrigation Management).</td></tr>'+
 '<tr><td>Jenuh ≥ 2 hari → kuning &amp; layu walau basah</td><td>Tanah jenuh membuat akar kekurangan oksigen; gejala layu, kerdil, daun kuning, bisa mati (Purdue; Vegetable Crops Hotline).</td></tr>'+
 '<tr><td>Kering → layu, tepi daun cokelat</td><td>Gejala pertama kekeringan adalah layu; tepi daun mati karena sel dehidrasi (Virginia Tech Extension SPES-749).</td></tr>'+
 '<tr><td>NPK berlebih → ujung terbakar; lebih parah saat kering; siram banyak mencuci garam</td><td>WSU HortSense "Fertilizer burn"; Plantix "Fertilizer Burn".</td></tr>'+
 '<tr><td>Kurang hara → pucat mulai daun tua</td><td>Daun menguning terkait kekurangan N (Vegetable Crops Hotline).</td></tr>'+
 '<tr><td>Kompos matang: hara pelan, menahan air; kompos belum matang menghambat</td><td>Kompos belum matang menghambat pertumbuhan dan perkecambahan (AGRIS/FAO); kompos perlu diinkubasi ± 30 hari, aktivator EM-4 ± 16 hari (Agrocentrum UPN Jatim).</td></tr>'+
 '<tr><td>Umur panen</td><td>Kangkung 21–30 hari; bayam 25–30; pakcoy 30–45; cabai rawit ±70–90; tomat mulai ±9 minggu (Kompas; Kapanlagi; Rumah123).</td></tr></table></details>';}
/* gambar(): dipanggil mesin setelah tiap perubahan; menggambar panel (bila terbuka) + tanaman 3D */
function gambar(){visual();if(!KB.buka)return;
 var kb=el('kb');if(!kb)return;var ak=document.activeElement,sel=null;
 if(ak&&kb.contains(ak)&&ak.getAttribute){var a=ak.getAttribute('data-act');if(a)sel='[data-act="'+a+'"]'+(ak.getAttribute('data-v')?'[data-v="'+ak.getAttribute('data-v')+'"]':'')+(ak.getAttribute('data-x')?'[data-x="'+ak.getAttribute('data-x')+'"]':'');else if(ak.tagName==='SUMMARY')sel='summary';}
 var o=(S&&S.k?htmlKebun():htmlBenih())+(KB.gagal?'<p class="kbNote" role="note"><small>⚠ Kemajuan tidak bisa disimpan di perangkat ini (penyimpanan browser mati/penuh). Simulasi tetap berjalan, tetapi hilang bila halaman ditutup.</small></p>':'')+htmlSumber();
 kb.innerHTML=o;
 Array.prototype.forEach.call(kb.querySelectorAll('details'),function(dt){var sm=dt.querySelector('summary');if(sm&&KB.bukaD[sm.textContent])dt.open=true;});
 if(sel){var f=kb.querySelector(sel);if(f){try{f.focus({preventScroll:true});}catch(e){}}}
 renderSekali();}
function aksi(a,b){if(a.indexOf('kb')!==0||!KB.buka||!S&&a!=='kbBenih')return a.indexOf('kb')===0;
 var v=b.getAttribute('data-v');
 if(a==='kbBenih'){if(TANAMAN[v]){jeda=false;KB.pil=null;baru(v);keAtas();}return true;}
 if(!S||!S.k)return true;
 if(a==='kbPil'){KB.pil=KB.pil===v?null:v;gambar();var pp=el('kbPilihan');if(pp&&pp.scrollIntoView)try{pp.scrollIntoView({block:'nearest'});}catch(e){}return true;}
 if(a==='kbX'){var x=b.getAttribute('data-x');KB.pil=null;if(AKSI[x]&&(x!=='hari'||G.lompat))lakukan(x,+v);keAtas();return true;}
 if(a==='kbJeda'){jeda=!jeda;gambar();return true;}
 if(a==='kbUlang'){baru(S.k);return true;}
 if(a==='kbGanti'){S.k=null;KB.pil=null;simpan();gambar();return true;}
 if(a==='kbPanen'&&S.maju>=1&&!S.panen&&!S.mati){var T=TANAMAN[S.k],r=Math.round(S.sumSehat/Math.max(1,S.nHari)),nilai=r>=80?'A':r>=60?'B':'C';
  S.panen=true;S.lencana=(S.lencana||[]).concat([T.nama+' '+nilai]).slice(-12);catat('Dipanen dengan nilai '+nilai+' (rata-rata kesehatan '+r+' %).');
  S.pesan={tingkat:'ok',j:'Panen berhasil, nilai '+nilai+'!',t:nilai==='A'?'Perawatanmu konsisten. Lencana tersimpan di perangkat ini.':'Coba lagi dan jaga air, hara, dan garam tetap di zona pas.'};simpan();gambar();return true;}
 return true;}
/* setelah aksi: gulir ke atas supaya pesan sebab-akibat & batang terlihat; fokus ke pesan (dibacakan pembaca layar lewat role=status) */
function keAtas(){var kb=el('kb'),k=el('kartu');[kb,k].forEach(function(x){if(x)x.scrollTop=0;});var m=kb&&kb.querySelector('.kbMsg,.kbInfo');if(m&&m.scrollIntoView)try{m.scrollIntoView({block:'nearest'});}catch(e){}}
document.addEventListener('toggle',function(e){if(!KB.buka||!e.target||e.target.tagName!=='DETAILS')return;var sm=e.target.querySelector('summary');if(sm)KB.bukaD[sm.textContent]=e.target.open;},true);
/* jam simulasi: hanya saat panel Kebun terbuka, tidak dijeda, tab terlihat */
setInterval(function(){cekDekat();
 if(!KB.buka||!S||!S.k||S.mati||S.panen||S.maju>=1||jeda||document.visibilityState!=='visible')return;
 S.detik=(S.detik||0)+1;if(S.detik>=dph()){S.detik=0;TPNL=Date.now();lakukan('hari',1);return;} /* TPNL: ketukan <500 ms setelah panel digambar ulang diabaikan */
 var j=el('kbJam');if(j)j.style.width=Math.round(100*S.detik/dph())+'%';if(S.detik%5===0)simpan();},1000);

/* ---------- 3D ---------- */
var LAJUR=[19.0,20.6,22.2,23.8];
function wadahG(){var T=AFRAME.THREE,bag=[],mt=new T.Matrix4();
 function tambah(geo,c,x,y,z,rx,ry,rz,sx,sy,sz){geo=geo.index?geo.toNonIndexed():geo;mt.compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx||0,ry||0,rz||0)),new T.Vector3(sx||1,sy||1,sz||1));geo.applyMatrix4(mt);
  if(!geo.attributes.normal)geo.computeVertexNormals();var n=geo.attributes.position.count,cl=new T.Color(c),a=new Float32Array(n*3);for(var q=0;q<n;q++){a[q*3]=cl.r;a[q*3+1]=cl.g;a[q*3+2]=cl.b;}geo.setAttribute('color',new T.BufferAttribute(a,3));bag.push(geo);}
 return {K:function(w,h,d,x,y,z,c,ry){tambah(new T.BoxGeometry(w,h,d),c,x,y,z,0,ry||0,0);},Cy:function(r,h,x,y,z,c,sg,rx,rz){tambah(new T.CylinderGeometry(r,r,h,sg||8),c,x,y,z,rx,0,rz);},
  Co:function(r,h,x,y,z,c,rx,rz){tambah(new T.ConeGeometry(r,h,5),c,x,y,z,rx,0,rz);},Bl:function(r,x,y,z,c,sy){tambah(new T.IcosahedronGeometry(r,0),c,x,y,z,0,0,0,1,sy||1,1);},
  Tr:function(a,b,d,c){var g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a.concat(b,d),3));g.computeVertexNormals();tambah(g,c,0,0,0);},
  selesai:function(){var tot=0,o=0;bag.forEach(function(g){tot+=g.attributes.position.count;});var P=new Float32Array(Math.max(3,tot*3)),N=new Float32Array(Math.max(3,tot*3)),C=new Float32Array(Math.max(3,tot*3));
   bag.forEach(function(g){P.set(g.attributes.position.array,o*3);N.set(g.attributes.normal.array,o*3);C.set(g.attributes.color.array,o*3);o+=g.attributes.position.count;g.dispose();});
   var gm=new T.BufferGeometry();gm.setAttribute('position',new T.BufferAttribute(P,3));gm.setAttribute('normal',new T.BufferAttribute(N,3));gm.setAttribute('color',new T.BufferAttribute(C,3));if(!tot)gm.setDrawRange(0,0);gm.computeBoundingSphere();return gm;}};}
/* keadaan visual dari keadaan simulasi (urutan prioritas sama dengan diagnosa) */
function keadaan(){if(!S||!S.k)return null;var g=S.garam*(S.air<40?1.5:1),k;
 if(S.mati)k='mati';else if(S.jenuh>=2)k='basah';else if(S.air<30)k='kering';else if(g>60)k='garam';else if(S.hara<25)k='pucat';else if(g>ZONA.garam[1])k='garam1';else k='sehat';
 return {k:S.k,t:S.panen?6:tahap(),p:Math.round(Math.min(1,S.maju)*20)/20,kond:k};}
var WARNA={sehat:['#2e7d32','#43a047','#66bb6a'],garam:['#2e7d32','#43a047','#6d4c41'],garam1:['#2e7d32','#43a047','#8d6e63'],pucat:['#9e9d24','#c0ca33','#dce775'],basah:['#9e9d24','#cddc39','#e6ee9c'],kering:['#6d6a1f','#8a7d3a','#b39b5c'],mati:['#4e342e','#5d4037','#6d4c41']};
var TURUN={sehat:0,garam:0.15,garam1:0.05,pucat:0.12,basah:0.5,kering:0.85,mati:1};
var TINGGI={kangkung:0.32,sawi:0.24,bayam:0.24,cabai:0.55,tomat:0.62};
function geoTanaman(v){var W=wadahG(),T=TANAMAN[v.k],i;
 if(v.t===0){W.Bl(0.035,0,0.005,0,'#5d4037',0.45);return W.selesai();}
 var tumbuh=v.t===6?1:Math.max(0.12,v.p),gr=0.35+0.65*Math.min(1,tumbuh*1.6),cw=WARNA[v.kond]||WARNA.sehat,tr=TURUN[v.kond]||0,
  H=TINGGI[v.k]*(0.25+0.75*tumbuh)*(1-tr*0.35),L=T.daunL/44*0.16*gr,Wd=T.daunW/44*0.16*gr,n=v.t===1?2:v.t===2?4:Math.min(10,4+Math.round(tumbuh*6));
 W.Cy(0.008+0.006*tumbuh,H,0,H/2,0,v.kond==='mati'?'#5d4037':v.kond==='kering'?'#827717':'#558b2f',5,0,tr*0.25);
 function daun(x,y,z,arah,pjg,lebar,turun){var ca=Math.cos(arah),sa=Math.sin(arah),ex=x+ca*pjg,ez=z+sa*pjg,ey=y+pjg*(0.55-turun),mx=x+ca*pjg*0.5,mz=z+sa*pjg*0.5,my=y+pjg*(0.45-turun*0.35),
   px=-sa*lebar,pz=ca*lebar,tx=x+ca*pjg*0.72,tz=z+sa*pjg*0.72,ty=y+pjg*(0.52-turun*0.75);
  var A=[x,y,z],Lf=[mx+px,my,mz+pz],R=[mx-px,my,mz-pz],TL=[tx+px*0.6,ty,tz+pz*0.6],TR=[tx-px*0.6,ty,tz-pz*0.6],E2=[ex,ey,ez];
  W.Tr(A,Lf,R,cw[0]);W.Tr(Lf,TL,R,cw[1]);W.Tr(R,TL,TR,cw[1]);W.Tr(TL,E2,TR,cw[2]);}
 for(i=0;i<n;i++){var f=(i+1)/(n+1),yy=H*(v.k==='cabai'||v.k==='tomat'?0.2+0.75*f:0.15+0.6*f),sx=Math.sin(tr*0.25)*yy*0.5;daun(sx,yy,0,i*2.4,L*(1.1-0.35*f),Wd,tr);}
 if(T.buah&&v.t>=4&&v.kond!=='mati'){var top=H;
  if(v.t===4)for(i=0;i<3;i++)W.Bl(0.014,Math.cos(i*2.1)*0.05,top*0.85,Math.sin(i*2.1)*0.05,'#ffffff');
  else for(i=0;i<(v.t===6?5:3);i++){var a=i*1.3,rr=0.06+0.02*(i%2),yb=top*(0.45+0.1*i),cb=v.t===6?T.warnaBuah:'#7cb342';
   if(v.k==='cabai')W.Co(0.012,0.07,Math.cos(a)*rr,yb,Math.sin(a)*rr,cb,Math.PI,0);else W.Bl(0.03,Math.cos(a)*rr,yb,Math.sin(a)*rr,cb);}}
 return W.selesai();}
function geoBedeng(){var W=wadahG(),air=S&&S.k?S.air:62,jenuh=S&&S.k?S.jenuh:0,i,j;
 var atas=S&&S.k?campur('#a1887f','#3e2723',air/100):'#5b4033';
 LAJUR.forEach(function(x,q){W.K(1.2,0.17,3.6,x,TANAH+0.085,15.8,'#6d4c41');W.K(1.1,0.012,3.5,x,TANAH+0.176,15.8,atas);
  if(jenuh>=1){W.Cy(0.3,0.006,x-0.2,TANAH+0.184,15.2,'#5d8fb3',14);W.Cy(0.24,0.006,x+0.25,TANAH+0.184,16.6,'#5d8fb3',14);}
  if(S&&S.k&&air<30)for(j=0;j<6;j++)W.K(0.45,0.004,0.016,x-0.18+(j%2)*0.33,TANAH+0.184,14.4+j*0.55,'#4e342e',j*0.7+q);});
 return W.selesai();}
function bangunBedeng(){var T=AFRAME.THREE;KB.bedeng=pasangM('kebunBedeng',geoBedeng(),new T.MeshLambertMaterial({vertexColors:true}));klik(KB.bedeng.userData.el,{t:'kebun'});KB.kunciT='';akun();visual();}
function bangunTanaman(){var T=AFRAME.THREE,i,d=new T.Object3D(),acak=(function(s){return function(){s=(s*16807)%2147483647;return(s-1)/2147483646;};})(20261110);
 var im=new T.InstancedMesh(geoTanaman({k:'kangkung',t:0,p:0,kond:'sehat'}),new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}),40),n=0;
 LAJUR.forEach(function(x0){for(var r=0;r<2;r++)for(var m=0;m<5;m++){d.position.set(x0-0.27+r*0.54+(acak()-0.5)*0.06,TANAH+0.182,14.45+m*0.68+(r?0.3:0));d.rotation.set(0,acak()*6.28,0);var s=0.85+acak()*0.3;d.scale.set(s,s,s);d.updateMatrix();im.setMatrixAt(n++,d.matrix);}});
 im.instanceMatrix.needsUpdate=true;im.name='kebunTanaman';var e=E('a-entity',{});e.setObject3D('mesh',im);im.userData.el=e;KB.im=im;KB.kunciV='';visual();}
function visual(){if(!KB.bedeng)return;var v=keadaan(),kv=v?[v.k,v.t,v.p,v.kond].join('|'):'kosong',kt=S&&S.k?[Math.round(S.air/4),S.jenuh>=1,S.air<30].join('|'):'kosong';
 if(kt!==KB.kunciT){KB.kunciT=kt;var gb=geoBedeng();KB.bedeng.geometry.dispose();KB.bedeng.geometry=gb;}
 if(!KB.im)return;KB.im.visible=!!v&&(KB.dekat||KB.buka);
 if(v&&kv!==KB.kunciV){KB.kunciV=kv;var g=geoTanaman(v);KB.im.geometry.dispose();KB.im.geometry=g;KB.im.computeBoundingSphere();}}
/* muat bertahap: tanaman dibangun saat siswa <= 6 m dari bedeng; disembunyikan saat > 8 m (panel terbuka = selalu tampil) */
function cekDekat(){if(!KB.bedeng||!rig)return;var p=rig.object3D.position,dx=Math.max(18.4-p.x,0,p.x-24.4),dz=Math.max(14-p.z,0,p.z-17.6),jr=Math.hypot(dx,dz);
 var dk=KB.dekat?jr<=8:jr<=6;if(dk!==KB.dekat||(dk&&!KB.im)){KB.dekat=dk;if(dk&&!KB.im)bangunTanaman();else visual();}}
function renderSekali(){try{if(sc&&sc.renderer&&sc.camera&&panelBuka)sc.renderer.render(sc.object3D,sc.camera);}catch(e){}}
/* pose kamera saat panel terbuka; disimpan dan dikembalikan saat panel ditutup */
function arah(lc,yaw,pitch){lc.yawObject.rotation.y=yaw;lc.pitchObject.rotation.x=pitch;cam.object3D.rotation.y=yaw;cam.object3D.rotation.x=pitch;}
function pose(){if(!sc||!rig||!cam||(sc.is&&sc.is('vr-mode')))return;var lc=cam.components['look-controls'];if(!lc||!lc.yawObject)return;var p=rig.object3D.position;
 if(!KB.simpanPose)KB.simpanPose={x:p.x,y:p.y,z:p.z,cy:cam.object3D.position.y,yaw:lc.yawObject.rotation.y,pitch:lc.pitchObject.rotation.x};
 TUJUAN=null;var cy=KB.simpanPose.cy;
 if(innerHeight>innerWidth){p.set(23.0,TANAH,18.3);cam.object3D.position.y=0.42-TANAH;arah(lc,0,-0.25);}
 else{p.set(17.3,TANAH,19.1);cam.object3D.position.y=cy;var dx=21.4-17.3,dz=15.8-19.1,kw=el('kartu').getBoundingClientRect().width,f=Math.max(0.3,Math.min(1,(innerWidth-kw)/innerWidth)),
  tH=Math.tan(((sc.camera&&sc.camera.fov)||70)*Math.PI/360)*innerWidth/innerHeight;arah(lc,Math.atan2(-dx,-dz)-Math.atan((1-f)*tH),Math.atan2(-0.3-(TANAH+cy),Math.hypot(dx,dz)));}
 renderSekali();}
function kembalikan(){var q=KB.simpanPose;KB.simpanPose=null;if(!q||!rig||!cam)return;var lc=cam.components['look-controls'];rig.object3D.position.set(q.x,q.y,q.z);cam.object3D.position.y=q.cy;if(lc&&lc.yawObject)arah(lc,q.yaw,q.pitch);}
function buka(){if(!SAYA)return;if(!akun()&&!KB.gagal)muat(); /* baca ulang tiap dibuka (tab lain); bila penyimpanan gagal, keadaan di memori dipakai */
 KB.pil=null;KB.membuka=true;bukaPanel('Kebun Simulasi','#2e7d32','');KB.membuka=false;KB.buka=true;
 var k=el('kartu');if(k)k.classList.add('kebun');if(KB.bedeng&&!KB.im)bangunTanaman();gambar();pose();
 var kh=el('kh');if(kh)try{kh.focus({preventScroll:true});}catch(e){}}
/* dipanggil saat panel ditutup atau diganti panel lain */
function lepas(){if(!KB.buka)return;KB.buka=false;KB.pil=null;var k=el('kartu');if(k)k.classList.remove('kebun');if(S)simpan();kembalikan();visual();}
addEventListener('resize',function(){if(KB.buka)setTimeout(pose,250);});
return {buka:buka,lepas:lepas,aksi:aksi,membuka:function(){return KB.membuka;},bangunBedeng:bangunBedeng,segar:function(){if(akun()){KB.kunciT='';KB.kunciV='';visual();}}};
})();
/* bukaPanel/tutupPanel (blok UMUM) dibungkus: panel lain menggantikan Kebun → pose kamera dikembalikan dulu */
var bukaPanelUmum=bukaPanel,tutupPanelUmum=tutupPanel;
bukaPanel=function(){try{if(!KBN.membuka())KBN.lepas();}catch(e){}return bukaPanelUmum.apply(this,arguments);};
tutupPanel=function(){try{KBN.lepas();}catch(e){}return tutupPanelUmum.apply(this,arguments);}; /* try: panel SELALU bisa ditutup walau kebun galat */ /* dipasang SEBELUM blok UMUM tutup-panel (onclick bTutup/kX memakai fungsi ini) */
/* akhir v0.4.0 kebun simulasi */
/* ===== v0.5.0: F2 SUMUR RESAPAN + F3 PLTS & KOTAK PANEL (konsep K0/K1 disetujui 10/11/2026; pengguna 22:21 memilih "v0.5.0 F2 + F3 saja").
   Tanpa server. Pemicu: ketuk tutup sumur / papan SUMUR RESAPAN (F2), ketuk kotak panel / papan PANEL PLTS (F3).
   F2: hujan ringan 10 / sedang 30 / lebat 75 mm (kategori BMKG), atap gazebo 53 m² (dari kode X0..X1 × Z0..Z1), sumur contoh Ø 1 m × dalam 2 m,
   resapan = permeabilitas minimum SNI 8456:2017 (2 cm/jam) × luas dinding + dasar (perkiraan atas, KONSEP §4), hujan dianggap 1 jam (asumsi pembelajaran).
   Gambar potongan melintang (SVG) di panel; tantangan hitung jumlah sumur.
   F3: 3 tab. Daya & cuaca: PLTS 2,2 kWp (asumsi ukuran panel adegan), produksi 1.293–1.453 kWh/kWp/tahun (nilai tengah 1.373; ELKOMIKA Itenas, PNJ),
   kurva harian sinus 06–18, faktor cuaca berawan 0,5 / hujan 0,2 (penyederhanaan), baterai contoh 2,4 kWh (12 V 200 Ah), faktor emisi Jawa–Bali 0,817 kg CO₂/kWh
   (Climate Compatible Growth). Lampu gazebo menyala (mesh 'pltsLampu', MeshBasic, +1 draw call hanya saat menyala) bila malam + beban lampu aktif.
   Rakit instalasi: 3 tantangan (lampu DC 12 V; lampu AC 220 V; lengkap + meteran kWh + arde), kesalahan dijelaskan (komponen PLTS off-grid: PNB, ITPLN,
   UNJ, PLN, Polije, Kompas). Keselamatan & perawatan. Lencana rakit di localStorage per akun 'eco_plts_v1_<id>' (try/catch). ===== */
var F23=(function(){
var ATAP=53.1,D=1.0,H=2.0,PERM=0.02,R=D/2,KAP=Math.PI*R*R*H,LUAS=Math.PI*D*H+Math.PI*R*R,RESAP=LUAS*PERM; /* m³, m², m³/jam */
var HUJAN={ringan:[10,'Ringan','5–20 mm/hari'],sedang:[30,'Sedang','20–50 mm/hari'],lebat:[75,'Lebat','50–100 mm/hari']};
var KWP=2.2,KWH_KWP=1373,EH=KWP*KWH_KWP/365,CUACA={cerah:[1,'Cerah'],berawan:[0.5,'Berawan'],hujan:[0.2,'Hujan']},JAM={pagi:[8,'Pagi 08.00'],siang:[12,'Siang 12.00'],sore:[16,'Sore 16.00'],malam:[20,'Malam 20.00']};
var BEBAN={lampu:[30,'Lampu LED 3 × 10 W'],kipas:[80,'Kipas 2 × 40 W'],pompa:[8,'Pompa hidroponik 8 W'],hp:[10,'Pengisi HP 10 W']},BAT=2400,EMISI=0.817;
var KOMP={panel:'Panel surya',mcbdc:'MCB DC',scc:'SCC',baterai:'Baterai',inverter:'Inverter',mcbac:'MCB AC',kwh:'Meteran kWh',lampudc:'Lampu DC 12 V',lampuac:'Lampu AC 220 V'};
var TANT={1:{j:'Tantangan 1: lampu LED DC 12 V di gazebo',r:['panel','mcbdc','scc','baterai','lampudc'],arde:false},
 2:{j:'Tantangan 2: lampu AC 220 V (lampu rumah biasa)',r:['panel','mcbdc','scc','baterai','inverter','mcbac','lampuac'],arde:false},
 3:{j:'Tantangan 3: instalasi lengkap + meteran kWh + arde',r:['panel','mcbdc','scc','baterai','inverter','mcbac','kwh','lampuac'],arde:true}};
var ST={f:'',hujan:'sedang',sumur:true,jawab:null,tab:'daya',jam:'siang',cuaca:'cerah',beban:{lampu:true,kipas:false,pompa:true,hp:false},t:1,rantai:[],arde:false,hasil:null,lenc:[],uid:null,gagal:false,lampu:null};
function f(n,d){return Number(n).toLocaleString('id-ID',{maximumFractionDigits:d==null?2:d,minimumFractionDigits:0});}
function kunci(){return 'eco_plts_v1_'+String(ST.uid||'tamu');}
function muat(){var id=(SAYA&&SAYA.id)?String(SAYA.id):null;if(id===ST.uid)return;ST.uid=id;ST.lenc=[];try{var x=JSON.parse(localStorage.getItem(kunci())||'null');if(x&&Array.isArray(x.lenc))ST.lenc=x.lenc.filter(function(n){return n===1||n===2||n===3;});}catch(e){ST.gagal=true;}}
function simpan(){try{localStorage.setItem(kunci(),JSON.stringify({lenc:ST.lenc}));ST.gagal=false;}catch(e){ST.gagal=true;}}
function pil(act,v,teks,on){return '<button class="'+(on?'p':'s2')+'" data-act="'+act+'" data-v="'+v+'" aria-pressed="'+(!!on)+'">'+teks+'</button>';}
/* ---------- F2 ---------- */
function hitung(){var mm=HUJAN[ST.hujan][0],V=ATAP*mm/1000,tamp=ST.sumur?Math.min(V,KAP+RESAP):0,luap=V-tamp,isi=ST.sumur?Math.min(1,Math.max(0,(V-RESAP)/KAP)):0;return {mm:mm,V:V,tamp:tamp,luap:luap,isi:isi};}
function svgSumur(h){var o='<svg viewBox="0 0 340 200" role="img" aria-label="Potongan melintang: atap gazebo, talang, pipa, '+(ST.sumur?'sumur resapan terisi '+Math.round(h.isi*100)+' %':'tanpa sumur, air menggenang')+'"><rect width="340" height="200" fill="#d6ecf7"/>';
 var n=ST.hujan==='ringan'?14:ST.hujan==='sedang'?28:55,i;for(i=0;i<n;i++){var x=(i*53)%330+5,y=(i*37)%70;o+='<line x1="'+x+'" y1="'+y+'" x2="'+(x-4)+'" y2="'+(y+12)+'" stroke="#5c9bd1" stroke-width="1.5"/>';}
 o+='<rect y="120" width="340" height="80" fill="#8d6e63"/><rect y="118" width="340" height="6" fill="#7cb342"/>';
 o+='<path d="M10 70 Q70 40 130 70 L130 76 Q70 46 10 76Z" fill="#5f9e45"/><rect x="18" y="74" width="6" height="46" fill="#c9a36b"/><rect x="116" y="74" width="6" height="46" fill="#c9a36b"/>';
 o+='<rect x="128" y="68" width="16" height="6" fill="#9e9e9e"/><rect x="138" y="68" width="6" height="52" fill="#bdbdbd"/>';
 if(ST.sumur){o+='<rect x="138" y="116" width="72" height="6" fill="#bdbdbd"/><rect x="200" y="112" width="60" height="8" fill="#9e9a92"/>';
  o+='<rect x="206" y="124" width="48" height="70" fill="#5d4037" stroke="#3e2723" stroke-width="2"/>';
  var hh=Math.round(66*h.isi);if(hh>0)o+='<rect x="208" y="'+(192-hh)+'" width="44" height="'+hh+'" fill="#42a5f5"/>';
  for(i=0;i<6;i++)o+='<path d="M'+(206+(i%2?48:0))+' '+(134+i*10)+' l'+(i%2?10:-10)+' 4" stroke="#90caf9" stroke-width="2"/>';
  o+='<text x="230" y="108" text-anchor="middle" font-size="11" fill="#1f2933">sumur Ø 1 m</text>';
  if(h.luap>0.001)o+='<path d="M262 118 Q290 110 320 122" stroke="#1e88e5" stroke-width="4" fill="none"/><text x="300" y="104" text-anchor="middle" font-size="11" fill="#0d47a1">meluap → kolam</text>';}
 else{o+='<ellipse cx="200" cy="121" rx="'+(30+h.mm*1.4)+'" ry="5" fill="#42a5f5" opacity=".85"/><text x="250" y="108" text-anchor="middle" font-size="11" fill="#0d47a1">menggenang → selokan</text>';}
 return o+'</svg>';}
function htmlSumur(){var h=hitung(),o='<p>Air hujan dari atap gazebo dialirkan talang dan pipa tegak ke <b>sumur resapan</b>, lalu meresap ke dalam tanah sebagai cadangan air tanah.</p>';
 o+='<div class="baris" role="group" aria-label="Hujan">';for(var k in HUJAN)o+=pil('f2Hujan',k,HUJAN[k][1]+' '+HUJAN[k][0]+' mm',ST.hujan===k);o+='</div>';
 o+='<div class="baris" role="group" aria-label="Bandingkan">'+pil('f2Sumur','1','Dengan sumur',ST.sumur)+pil('f2Sumur','0','Tanpa sumur',!ST.sumur)+'</div>';
 o+='<div class="f23Svg">'+svgSumur(h)+'</div>';
 o+='<table class="kbTbl"><tr><td>Air hujan dari atap ('+f(ATAP,1)+' m² × '+h.mm+' mm)</td><td><b>'+f(h.V)+' m³</b> ('+f(h.V*1000,0)+' liter)</td></tr>';
 if(ST.sumur)o+='<tr><td>Tertampung + meresap selama 1 jam</td><td><b>'+f(h.tamp)+' m³</b></td></tr><tr><td>Meluap lewat pelimpah ke kolam bioswale</td><td><b>'+f(Math.max(0,h.luap))+' m³</b></td></tr>';
 else o+='<tr><td>Mengalir di permukaan halaman</td><td><b>'+f(h.V)+' m³</b> (menggenang, terbuang ke selokan)</td></tr>';
 o+='</table><div class="kbMsg '+(ST.sumur?(h.luap>0.001?'w':''):'b')+'" role="status">'+(ST.sumur?(h.luap>0.001?'<b>Sumur penuh.</b> Hujan lebat melebihi daya tampung satu sumur; sisanya dialirkan ke kolam bioswale.':'<b>Semua air tertampung.</b> Air hujan meresap ke tanah, tidak menggenang.'):'<b>Tanpa sumur, '+f(h.V*1000,0)+' liter air terbuang.</b> Halaman tergenang dan air tanah tidak bertambah.')+'</div>';
 var benar=Math.ceil(ATAP*0.075/(KAP+RESAP));
 o+='<h3>Tantangan hitung</h3><p>Hujan <b>lebat 75 mm</b> dari atap '+f(ATAP,1)+' m². Satu sumur (Ø 1 m, dalam 2 m) menampung '+f(KAP)+' m³ dan meresapkan ±'+f(RESAP)+' m³ per jam. Berapa sumur yang dibutuhkan agar tidak ada yang meluap?</p><div class="baris" role="group" aria-label="Jawaban">';
 [1,2,3,4].forEach(function(n){o+=pil('f2Jawab',n,n+' sumur',ST.jawab===n);});o+='</div>';
 if(ST.jawab!=null)o+='<div class="kbMsg '+(ST.jawab===benar?'':'w')+'" role="status">'+(ST.jawab===benar?'<b>Benar, '+benar+' sumur.</b> ':'<b>Belum tepat.</b> ')+'Air = 53,1 × 0,075 = '+f(ATAP*0.075)+' m³; satu sumur ≈ '+f(KAP)+' + '+f(RESAP)+' = '+f(KAP+RESAP)+' m³; '+f(ATAP*0.075)+' ÷ '+f(KAP+RESAP)+' = '+f(ATAP*0.075/(KAP+RESAP))+' → dibulatkan ke atas = '+benar+' sumur.</div>';
 o+='<details><summary>Syarat sumur resapan &amp; sumber (untuk guru)</summary><ul><li>Permeabilitas tanah &gt; 2 cm/jam; muka air tanah &gt; 2 m.</li><li>Jarak minimum: 1 m dari fondasi, 3 m dari sumur air bersih, 5 m dari resapan septik. Sumur di adegan berjarak 1,05 m dari lantai gazebo.</li></ul><p><small>SNI 8456:2017 (dikutip J. Sipil &amp; Lingkungan IPB; Composite UNG); SNI 03-2453-2002 (Spektrum Sipil Unram). Kategori hujan: BMKG (ringan 5–20, sedang 20–50, lebat 50–100 mm/hari). Penyederhanaan: hujan 1 jam, resapan dari seluruh dinding + dasar dengan permeabilitas minimum, seluruh air atap masuk talang.</small></p></details>';
 return o;}
/* ---------- F3 ---------- */
function daya(){var cf=CUACA[ST.cuaca][0],E=EH*cf,h=JAM[ST.jam][0],P=(h>6&&h<18)?E/(24/Math.PI)*Math.sin(Math.PI*(h-6)/12)*1000:0,B=0;for(var k in BEBAN)if(ST.beban[k])B+=BEBAN[k][0];return {E:E,P:P,B:B,net:P-B};}
function htmlDaya(){var d=daya(),o='<div class="baris" role="group" aria-label="Jam">';for(var k in JAM)o+=pil('f3Jam',k,JAM[k][1],ST.jam===k);o+='</div><div class="baris" role="group" aria-label="Cuaca">';
 for(k in CUACA)o+=pil('f3Cuaca',k,CUACA[k][1],ST.cuaca===k);o+='</div><p><b>Beban yang dinyalakan:</b></p><div class="baris" role="group" aria-label="Beban">';
 for(k in BEBAN)o+=pil('f3Beban',k,BEBAN[k][1],ST.beban[k]);o+='</div>';
 o+='<table class="kbTbl"><tr><td>Daya panel surya sekarang</td><td><b>'+f(d.P,0)+' W</b></td></tr><tr><td>Beban menyala</td><td><b>'+f(d.B,0)+' W</b></td></tr>';
 o+='<tr><td>Baterai</td><td><b>'+(d.net>=0?'mengisi +'+f(d.net,0)+' W':'dipakai '+f(-d.net,0)+' W')+'</b></td></tr>';
 if(d.net<0)o+='<tr><td>Baterai penuh ('+f(BAT/1000,1)+' kWh) cukup untuk</td><td><b>± '+f(BAT/(-d.net),1)+' jam</b></td></tr>';
 o+='<tr><td>Produksi hari ini ('+CUACA[ST.cuaca][1].toLowerCase()+')</td><td><b>'+f(d.E,1)+' kWh</b></td></tr><tr><td>CO₂ dihindari hari ini</td><td><b>'+f(d.E*EMISI,1)+' kg</b></td></tr></table>';
 var nyala=lampuNyala();
 o+='<div class="kbMsg '+(d.net<0?'w':'')+'" role="status">'+(d.P===0?'<b>Malam: panel tidak menghasilkan listrik.</b> Semua beban memakai energi yang disimpan baterai siang tadi.'+(nyala?' Lampu gazebo menyala dari baterai.':''):d.net>=0?'<b>Surplus.</b> Listrik matahari cukup untuk beban, sisanya mengisi baterai.':'<b>Defisit.</b> Beban lebih besar dari daya panel saat ini; kekurangannya diambil dari baterai.')+'</div>';
 o+='<p><small>Asumsi: PLTS '+f(KWP,1)+' kWp (2 panel atap adegan), produksi rata-rata '+f(KWH_KWP,0)+' kWh/kWp/tahun (rentang 1.293–1.453, ELKOMIKA Itenas; radiasi ±4,8 kWh/m²/hari, Prosiding PNJ); faktor cuaca berawan 0,5 dan hujan 0,2 = penyederhanaan; baterai contoh 12 V 200 Ah; faktor emisi jaringan Jawa–Bali 0,817 kg CO₂/kWh (Climate Compatible Growth).</small></p>';
 return o;}
function periksa(){var T=TANT[ST.t],r=ST.rantai,i;
 if(!r.length)return {ok:false,t:'Rangkaian masih kosong. Mulai dari <b>panel surya</b>, sumber listrik PLTS.'};
 for(i=0;i<Math.max(r.length,T.r.length);i++){var e=T.r[i],g=r[i];if(e===g)continue;
  if(g===undefined)return {ok:false,t:'Rangkaian belum lengkap. Komponen berikutnya: <b>'+KOMP[e]+'</b>.'};
  if(e===undefined)return {ok:false,t:'Ada komponen berlebih setelah beban: <b>'+KOMP[g]+'</b>. Beban dipasang paling akhir.'};
  if(i===0)return {ok:false,t:'Rangkaian PLTS dimulai dari <b>panel surya</b> (sumber listrik), bukan '+KOMP[g]+'.'};
  if(e==='inverter'&&(g==='lampuac'||g==='mcbac'||g==='kwh'))return {ok:false,t:'<b>Pasang inverter dulu.</b> Lampu AC 220 V tidak bisa disambung langsung ke baterai DC 12 V; inverter mengubah listrik DC menjadi AC.'};
  if(g==='lampuac'&&e==='lampudc')return {ok:false,t:'Tantangan ini memakai <b>lampu DC 12 V</b>, jadi tidak perlu inverter. Lampu AC 220 V butuh inverter.'};
  if(g==='inverter'&&e==='lampudc')return {ok:false,t:'Lampu DC 12 V bisa langsung dari sistem baterai DC; <b>inverter tidak diperlukan</b> di sini.'};
  return {ok:false,t:({mcbdc:'Setelah panel surya pasang <b>MCB DC</b>: pengaman yang memutus arus bila terjadi korsleting atau beban lebih di sisi DC.',scc:'Pasang <b>SCC</b> (Solar Charge Controller) sebelum baterai: SCC mengatur pengisian agar baterai tidak kelebihan atau kekurangan muatan.',baterai:'<b>Baterai</b> dipasang setelah SCC: menyimpan energi siang untuk dipakai malam.',mcbac:'Setelah inverter pasang <b>MCB AC</b>: pengaman sisi AC sebelum beban.',kwh:'Pasang <b>meteran kWh</b> sebelum beban untuk mengukur energi yang dipakai.',lampudc:'Beban (lampu) dipasang paling akhir.',lampuac:'Beban (lampu) dipasang paling akhir.',inverter:'Di posisi ini seharusnya <b>inverter</b> (DC → AC).'})[e]||('Urutan belum tepat: seharusnya '+KOMP[e]+'.')};}
 if(T.arde&&!ST.arde)return {ok:false,t:'Urutan sudah benar, tetapi <b>belum ada arde (pembumian)</b>. Arde menyalurkan arus bocor atau sambaran petir ke tanah supaya rangka panel tidak menyetrum.'};
 return {ok:true,t:'<b>Benar!</b> Listrik mengalir: '+r.map(function(k){return KOMP[k];}).join(' → ')+(ST.arde?' + arde':'')+'.'};}
function htmlRakit(){var T=TANT[ST.t],o='<div class="baris" role="group" aria-label="Tantangan">';
 [1,2,3].forEach(function(n){o+=pil('f3Tant',n,'Tantangan '+n+(ST.lenc.indexOf(n)>=0?' ✓':''),ST.t===n);});
 o+='</div><p><b>'+T.j+'.</b> Ketuk komponen sesuai urutan aliran listrik dari panel surya sampai lampu.</p><div class="f3Rantai" aria-label="Rangkaian">'+(ST.rantai.length?ST.rantai.map(function(k){return '<span>'+KOMP[k]+'</span>';}).join('<i aria-hidden="true">→</i>'):'<small>(kosong)</small>')+(ST.arde?'<i aria-hidden="true">+</i><span>Arde</span>':'')+'</div>';
 o+='<div class="f3Komp" role="group" aria-label="Komponen">';for(var k in KOMP)o+='<button class="s2" data-act="f3Tambah" data-v="'+k+'">'+KOMP[k]+'</button>';
 o+=pil('f3Arde','1','Arde (pembumian)',ST.arde)+'</div><div class="baris"><button class="s2" data-act="f3Hapus">Hapus terakhir</button><button class="s2" data-act="f3Ulang">Ulang</button><button class="p" data-act="f3Periksa">Periksa</button></div>';
 if(ST.hasil)o+='<div class="kbMsg '+(ST.hasil.ok?'':'b')+'" role="status">'+ST.hasil.t+'</div>';
 if(ST.gagal)o+='<p><small>⚠ Lencana tidak bisa disimpan di perangkat ini.</small></p>';
 o+='<details><summary>Fungsi komponen &amp; sumber (untuk guru)</summary><ul><li><b>Panel surya</b>: mengubah cahaya matahari menjadi listrik DC.</li><li><b>MCB DC/AC</b>: pengaman yang memutus arus saat korsleting atau beban lebih.</li><li><b>SCC</b>: mengatur pengisian agar baterai tidak kelebihan/kekurangan muatan.</li><li><b>Baterai</b>: menyimpan energi.</li><li><b>Inverter</b>: mengubah DC menjadi AC 220 V.</li><li><b>Meteran kWh</b>: mengukur energi terpakai.</li><li><b>Arde</b>: menyalurkan arus bocor/petir ke tanah.</li></ul><p><small>Repository PNB; Tesis ITPLN Bab II; J. Pendidikan Teknik Elektro UNJ (MCB DC/AC); PLN "Komponen PLTS"; Polije "Dasar-Dasar Pemasangan Panel Surya" (grounding & penangkal petir).</small></p></details>';
 return o;}
function htmlAman(){return '<div class="kbMsg b" role="note"><b>Ini simulasi.</b> Instalasi listrik sungguhan dipasang dan diperiksa oleh teknisi berkompeten. Siswa <b>tidak membuka</b> panel listrik sekolah dan tidak menyentuh kabel.</div>'+
 '<h3>Keselamatan</h3><ul><li><b>MCB</b> memutus arus otomatis saat korsleting atau beban lebih, sehingga kabel tidak panas dan terbakar.</li><li><b>Arde (pembumian)</b> menyalurkan arus bocor dan sambaran petir ke tanah; rangka panel dan kotak panel harus dibumikan.</li><li>Sisi DC panel surya tetap bertegangan selama ada cahaya, walau MCB AC dimatikan.</li></ul>'+
 '<h3>Perawatan</h3><ul><li>Bersihkan permukaan panel dari debu dan daun dengan air dan kain lembut (oleh petugas, dari tempat aman).</li><li>Jaga panel bebas bayangan pohon atau bangunan; bayangan kecil saja menurunkan daya.</li><li>Periksa lampu indikator SCC dan inverter secara berkala.</li></ul>'+
 '<p><small>Sumber: Polije "Dasar-Dasar Pemasangan Panel Surya"; Kompas (PLTS off-grid sebaiknya dipasang teknisi); J. Pendidikan Teknik Elektro UNJ.</small></p>';}
function htmlPlts(){var o='<div class="baris" role="group" aria-label="Bagian">'+pil('f3Tab','daya','Daya & cuaca',ST.tab==='daya')+pil('f3Tab','rakit','Rakit instalasi',ST.tab==='rakit')+pil('f3Tab','aman','Keselamatan',ST.tab==='aman')+'</div>';
 return o+(ST.tab==='daya'?htmlDaya():ST.tab==='rakit'?htmlRakit():htmlAman());}
/* ---------- 3D: bohlam gazebo ---------- */
function lampuNyala(){return ST.jam==='malam'&&!!ST.beban.lampu;}
function bangun(){var T=AFRAME.THREE;ST.lampu=gabung('pltsLampu',function(K,Cy,Bl){[13.4,16,18.6].forEach(function(x){Bl(0.07,x,2.12,5.6,'#fff3c4',0.8);Cy(0.11,0.01,x,2.14,5.6,'#ffe082',12);});},new T.MeshBasicMaterial({vertexColors:true}));ST.lampu.visible=false;}
function visual(){if(ST.lampu)ST.lampu.visible=lampuNyala();try{if(sc&&sc.renderer&&sc.camera&&panelBuka)sc.renderer.render(sc.object3D,sc.camera);}catch(e){}}
/* ---------- panel ---------- */
function gambar(){var kb=el('kb');if(!kb||!ST.f)return;var ak=document.activeElement,sel=null;if(ak&&kb.contains(ak)&&ak.getAttribute&&ak.getAttribute('data-act'))sel='[data-act="'+ak.getAttribute('data-act')+'"]'+(ak.getAttribute('data-v')?'[data-v="'+ak.getAttribute('data-v')+'"]':'');
 var dt={};Array.prototype.forEach.call(kb.querySelectorAll('details'),function(d){var s=d.querySelector('summary');if(s)dt[s.textContent]=d.open;});
 kb.innerHTML=ST.f==='sumur'?htmlSumur():htmlPlts();
 Array.prototype.forEach.call(kb.querySelectorAll('details'),function(d){var s=d.querySelector('summary');if(s&&dt[s.textContent])d.open=true;});
 if(sel){var x=kb.querySelector(sel);if(x)try{x.focus({preventScroll:true});}catch(e){}}visual();}
function buka(fi){if(!SAYA)return;muat();ST.f=fi;bukaPanel(fi==='sumur'?'Sumur Resapan':'PLTS & Panel Listrik',fi==='sumur'?'#1565c0':'#8a5a00','');gambar();var kh=el('kh');if(kh)try{kh.focus({preventScroll:true});}catch(e){}}
function cari(p){var t=TANAH;if(Math.hypot(p.x-19.3,p.z-0.9)<0.68&&p.y<t+0.3)return 'sumur';if(p.x>20.7&&p.x<21.0&&p.z>3.35&&p.z<4.85&&p.y>t+0.6&&p.y<t+1.6)return 'plts';return '';}
function aksi(a,b){if(!/^f[23]/.test(a))return false;if(!ST.f||el('panel').style.display!=='flex')return true;var v=b.getAttribute('data-v');
 if(a==='f2Hujan'&&HUJAN[v])ST.hujan=v;else if(a==='f2Sumur')ST.sumur=v==='1';else if(a==='f2Jawab')ST.jawab=+v;
 else if(a==='f3Tab'&&/^(daya|rakit|aman)$/.test(v))ST.tab=v;else if(a==='f3Jam'&&JAM[v])ST.jam=v;else if(a==='f3Cuaca'&&CUACA[v])ST.cuaca=v;else if(a==='f3Beban'&&BEBAN[v])ST.beban[v]=!ST.beban[v];
 else if(a==='f3Tant'&&TANT[v]){ST.t=+v;ST.rantai=[];ST.arde=false;ST.hasil=null;}
 else if(a==='f3Tambah'&&KOMP[v]){if(ST.rantai.length<12)ST.rantai.push(v);ST.hasil=null;}
 else if(a==='f3Arde'){ST.arde=!ST.arde;ST.hasil=null;}else if(a==='f3Hapus'){ST.rantai.pop();ST.hasil=null;}else if(a==='f3Ulang'){ST.rantai=[];ST.arde=false;ST.hasil=null;}
 else if(a==='f3Periksa'){ST.hasil=periksa();if(ST.hasil.ok&&ST.lenc.indexOf(ST.t)<0){ST.lenc.push(ST.t);simpan();}}
 gambar();if(a==='f3Periksa'||a==='f2Jawab'){var m=el('kb').querySelectorAll('.kbMsg');m=m[m.length-1];if(m&&m.scrollIntoView)try{m.scrollIntoView({block:'nearest'});}catch(e){}}return true;}
return {buka:buka,cari:cari,aksi:aksi,bangun:bangun};
})();
/* akhir v0.5.0 sumur resapan + PLTS */
/* ===== v0.6.0: F4 HIDROPONIK NFT + PANEL INFO TAMAN TOGA (pengguna 10/11 23:24: "v0.6.0 hidroponik + pohon realistis + panel info Taman TOGA").
   Tanpa server. Pemicu F4: ketuk lantai/rak/tandon rumah hidroponik (x 8,0..11,0 × z −1,8..2,2) atau papan HIDROPONIK NFT. Pemicu TOGA: ketuk bedeng/tanaman
   Taman TOGA (x 9,4..10,6 × z 3,05..8,45, di atas bibir bedeng) atau papan nama Taman TOGA.
   F4 (pola mesin F1, langkah per hari dengan tombol; tidak memakai jam nyata): pilih sayur, atur ppm (AB mix / tambah air), pH (pH up/down), timer pompa.
   Zona ppm/pH: Agrisevika UPN Jatim Tabel 1 (selada 560–840 ppm pH 6,0–7,0; kangkung 1.050–1.400 pH 5,5–6,5; pakcoy 1.050–1.400 pH 7,0 →
   simulasi memberi toleransi ±0,5, sejalan pH 6,2–7,6 pada NFT pakcoy/selada di Agritech Unhas). Umur panen hidroponik: kangkung 20–25, selada 30–45,
   pakcoy 30–40 hari (Rumah123) → simulasi 25 / 35 / 35. Pompa: 9–12 jam/hari tidak berbeda nyata dengan 24 jam (SINTECH UDB); pompa 8 W (Kementan);
   0 dan 6 jam = penyederhanaan. Perubahan harian ppm (−5 %, diserap) dan pH (+0,1) = PENYEDERHANAAN (di instalasi nyata ppm bisa naik karena air menguap).
   Listrik pompa dibandingkan dengan produksi PLTS F3 (2,2 kWp × 1.373 kWh/kWp/tahun ÷ 365 = 8,3 kWh/hari cerah). Kemajuan di localStorage per akun
   'eco_hidro_v1_<id>' (try/catch + validasi). 3D tidak berubah (sayur contoh rak tetap; hemat draw call).
   TOGA: 5 kartu tanaman (sereh, jahe, kunyit, lidah buaya, mint): bagian yang dipakai, pemanfaatan tradisional, cara memperbanyak, perawatan + kuis 3 soal.
   Klaim kesehatan dibatasi "dimanfaatkan secara tradisional"; catatan aman FROTI (KMK HK.01.07/MENKES/187/2017) dan pedoman empon-empon KKN-PPM UGM 2020. ===== */
var F4=(function(){
var SAYUR={selada:{nama:'Selada',ppm:[560,840],ph:[6.0,7.0],phT:'6,0–7,0',panen:35,ket:'panen ±30–45 hari'},
 kangkung:{nama:'Kangkung',ppm:[1050,1400],ph:[5.5,6.5],phT:'5,5–6,5',panen:25,ket:'panen ±20–25 hari'},
 pakcoy:{nama:'Pakcoy',ppm:[1050,1400],ph:[6.5,7.5],phT:'7,0 (±0,5)',panen:35,ket:'panen ±30–40 hari'}};
var POMPA=[0,6,12,24],WATT=8,EH=2.2*1373/365;
var TOGA=[
 {k:'sereh',n:'Sereh',l:'Cymbopogon citratus',b:'batang bawah dan daun',m:'bumbu masak, minuman hangat, dan aroma segar',p:'memisahkan anakan dari rumpun',r:'suka sinar matahari penuh; potong daun tua supaya rumpun tidak terlalu rimbun'},
 {k:'jahe',n:'Jahe',l:'Zingiber officinale',b:'rimpang (batang di dalam tanah)',m:'bumbu dan minuman penghangat badan; tanaman obat yang paling banyak dipakai masyarakat (Riskesdas 2010: 50,36 %)',p:'menanam potongan rimpang yang sudah bertunas',r:'tanah gembur, tidak tergenang air; teduh sebagian'},
 {k:'kunyit',n:'Kunyit',l:'Curcuma longa',b:'rimpang (dalamnya jingga)',m:'bumbu (pewarna kuning) dan jamu; dipakai masyarakat untuk mengatasi letih lesu',p:'menanam potongan rimpang bertunas',r:'tanah gembur, cukup air tetapi tidak tergenang; dipanen setelah daun mulai menguning'},
 {k:'lidah',n:'Lidah buaya',l:'Aloe vera',b:'gel (lendir bening) di dalam daun tebal',m:'perawatan kulit dan rambut secara tradisional',p:'memisahkan anakan di pangkal tanaman',r:'tanaman sukulen: siram sedikit, jangan sampai tergenang'},
 {k:'mint',n:'Mint',l:'Mentha sp.',b:'daun',m:'aroma segar untuk minuman dan masakan',p:'stek batang (batang dipotong lalu ditanam)',r:'suka tanah lembap; pangkas pucuk supaya tumbuh rimbun'}];
var KUIS=[{t:'Bagian jahe dan kunyit yang dimanfaatkan adalah …',p:['Daun','Rimpang','Bunga'],j:1},
 {t:'Cara paling mudah memperbanyak mint adalah …',p:['Stek batang','Biji','Rimpang'],j:0},
 {t:'Lidah buaya mati bila …',p:['Kena matahari','Tergenang air terus','Ditanam di pot'],j:1}];
var H=null,ST={f:'',uid:null,gagal:false,pil:'sereh',kuis:{}};
function f(n,d){return Number(n).toLocaleString('id-ID',{maximumFractionDigits:d==null?1:d,minimumFractionDigits:0});}
function kunci(){return 'eco_hidro_v1_'+String(ST.uid||'tamu');}
function sah(x){return x&&typeof x==='object'&&(x.k===null||SAYUR[x.k])&&isFinite(x.hari)&&isFinite(x.ppm)&&isFinite(x.ph)&&POMPA.indexOf(x.pompa)>=0&&isFinite(x.sehat)&&isFinite(x.maju)&&Array.isArray(x.log)&&Array.isArray(x.lenc);}
function kosong(L){return {k:null,hari:0,ppm:400,ph:7.6,pompa:12,sehat:85,maju:0,panen:false,mati:false,log:[],lenc:L||[],kwh:0,pesan:''};}
function muat(){var id=(SAYA&&SAYA.id)?String(SAYA.id):null;if(id===ST.uid&&H)return;ST.uid=id;H=null;try{var x=JSON.parse(localStorage.getItem(kunci())||'null');if(sah(x))H=x;}catch(e){ST.gagal=true;}if(!H)H=kosong();}
function simpan(){try{localStorage.setItem(kunci(),JSON.stringify(H));ST.gagal=false;}catch(e){ST.gagal=true;}}
function pil(act,v,teks,on){return '<button class="'+(on?'p':'s2')+'" data-act="'+act+'" data-v="'+v+'" aria-pressed="'+(!!on)+'">'+teks+'</button>';}
function tbl(act,v,teks){return '<button class="s2" data-act="'+act+'" data-v="'+v+'">'+teks+'</button>';}
function catat(t){H.log.unshift('Hari '+H.hari+': '+t);if(H.log.length>30)H.log.pop();}
/* ---------- mesin hidroponik (per hari) ---------- */
function nilai(){var S=SAYUR[H.k],r=[],d=0,lo=S.ppm[0],hi=S.ppm[1];
 if(H.ppm<lo*0.6){d-=8;r.push(['b','Larutan terlalu encer: daun <b>pucat kekuningan</b>, tumbuh lambat (kurang hara). Tambah AB mix.']);}
 else if(H.ppm<lo){d-=4;r.push(['w','Larutan agak encer: tanaman kurang hara. Tambah sedikit AB mix.']);}
 else if(H.ppm>hi*1.3){d-=10;r.push(['b','Larutan terlalu pekat: <b>ujung daun terbakar dan layu</b> karena akar sulit menyerap air. Tambah air baku.']);}
 else if(H.ppm>hi){d-=5;r.push(['w','Larutan agak pekat. Tambah sedikit air baku.']);}
 var pl=S.ph[0],ph=S.ph[1],sel=H.ph<pl?pl-H.ph:H.ph>ph?H.ph-ph:0;
 if(sel>1){d-=8;r.push(['b','pH jauh di luar zona: hara ada tetapi <b>sulit diserap akar</b>; daun menguning. Pakai '+(H.ph>ph?'pH down':'pH up')+'.']);}
 else if(sel>0){d-=4;r.push(['w','pH sedikit di luar zona ('+S.phT+'). Pakai '+(H.ph>ph?'pH down':'pH up')+'.']);}
 if(H.pompa===0){d-=25;r.push(['b','Pompa mati: air tidak mengalir di pipa, <b>akar kering dan tanaman layu</b>.']);}
 else if(H.pompa<9){d-=6;r.push(['w','Pompa hanya '+H.pompa+' jam/hari: akar sering kekurangan air dan oksigen. Pakai 9–12 jam.']);}
 if(!d)d=3;return {d:d,r:r};}
function lewat(){if(!H.k||H.panen||H.mati)return;var S=SAYUR[H.k],n=nilai();H.hari++;H.sehat=Math.max(0,Math.min(100,H.sehat+n.d));
 H.maju=Math.min(1,H.maju+(H.sehat>=60?1:H.sehat/100*0.6)/S.panen);H.kwh+=WATT*H.pompa/1000;
 H.ppm=Math.round(H.ppm*0.95);H.ph=Math.round((H.ph+0.1)*10)/10;
 if(H.sehat<=0){H.mati=true;H.pesan='b|<b>Tanaman mati.</b> Periksa ppm, pH, dan pompa, lalu mulai lagi.';catat('tanaman mati');}
 else if(H.maju>=1){H.panen=true;if(H.lenc.indexOf(H.k)<0)H.lenc.push(H.k);H.pesan='|<b>Siap panen!</b> '+S.nama+' dipanen hari ke-'+H.hari+'. Listrik pompa selama tanam: '+f(H.kwh,2)+' kWh.';catat('panen');}
 else{H.pesan='';if(n.d<0)catat(n.r.map(function(x){return x[1].replace(/<[^>]+>/g,'');})[0]);}}
function mulai(k){var L=H.lenc;H=kosong(L);H.k=k;H.hari=1;catat('pindah tanam '+SAYUR[k].nama+' ke pipa NFT');}
/* ---------- tampilan F4 ---------- */
function bar(n,v,mx,zona,teks){var w=Math.max(0,Math.min(100,v/mx*100)),z=zona?'<u style="left:'+(zona[0]/mx*100)+'%;width:'+((zona[1]-zona[0])/mx*100)+'%"></u>':'';
 return '<div class="kbLn"><b>'+n+'</b><span class="kbBar" aria-hidden="true">'+z+'<i style="width:'+w+'%;background:'+(zona&&(v<zona[0]||v>zona[1])?'#f9a825':'#43a047')+'"></i></span><em>'+teks+'</em></div>';}
function htmlPilih(){var o='<p>Hidroponik NFT: akar sayur dialiri lapisan tipis <b>larutan nutrisi</b> di dalam pipa, tanpa tanah. Pompa mengangkat larutan dari tandon, lalu larutan kembali ke tandon.</p><p><b>Pilih sayur untuk ditanam:</b></p><div class="kbBenih">';
 for(var k in SAYUR)o+='<button class="s2" data-act="f4Sayur" data-v="'+k+'"><b>'+SAYUR[k].nama+(H.lenc.indexOf(k)>=0?' ✓':'')+'</b><small>'+f(SAYUR[k].ppm[0],0)+'–'+f(SAYUR[k].ppm[1],0)+' ppm · pH '+SAYUR[k].phT+'</small><small>'+SAYUR[k].ket+'</small></button>';
 return o+'</div>';}
function htmlHidro(){if(!H.k)return htmlPilih()+htmlBanding()+htmlSumber();var S=SAYUR[H.k],n=nilai(),o='';
 o+='<div class="kbInfo"><span><b>'+S.nama+'</b> · hari '+H.hari+'</span><span>'+(H.panen?'Siap panen':H.mati?'Mati':Math.round(H.maju*100)+' % menuju panen')+'</span></div>';
 o+=bar('ppm',H.ppm,2000,S.ppm,f(H.ppm,0))+bar('pH',H.ph,14,S.ph,f(H.ph,1))+bar('Kesehatan',H.sehat,100,null,Math.round(H.sehat)+' %');
 if(H.pesan){var q=H.pesan.split('|');o+='<div class="kbMsg '+q[0]+'" role="status">'+q[1]+'</div>';}
 else if(n.r.length)o+=n.r.map(function(x){return '<div class="kbMsg '+x[0]+'" role="status">'+x[1]+'</div>';}).join('');
 else o+='<div class="kbMsg" role="status"><b>Semua pas.</b> ppm '+f(S.ppm[0],0)+'–'+f(S.ppm[1],0)+', pH '+S.phT+', pompa '+H.pompa+' jam. Tanaman tumbuh sehat.</div>';
 if(!H.panen&&!H.mati){o+='<p><b>Nutrisi</b></p><div class="kbAksi">'+tbl('f4Atur','ab','+ AB mix (+200 ppm)')+tbl('f4Atur','air','+ Air baku (−150 ppm)')+tbl('f4Atur','phd','pH down (−0,3)')+tbl('f4Atur','phu','pH up (+0,3)')+'</div>';
  o+='<p><b>Timer pompa (jam per hari)</b></p><div class="baris" role="group" aria-label="Timer pompa">';POMPA.forEach(function(j){o+=pil('f4Pompa',j,j+' jam',H.pompa===j);});o+='</div>';
  o+='<p><small>Listrik pompa '+WATT+' W × '+H.pompa+' jam = <b>'+f(WATT*H.pompa,0)+' Wh/hari</b> = '+f(WATT*H.pompa/(EH*10),1)+' % produksi PLTS gazebo saat cerah (±'+f(EH,1)+' kWh/hari).</small></p>';
  o+='<div class="kbAksi">'+tbl('f4Hari','1','Lanjut 1 hari')+tbl('f4Hari','3','Lanjut 3 hari')+'</div>';}
 else o+='<div class="kbAksi">'+tbl('f4Baru','1','Tanam lagi')+'</div>';
 if(H.log.length)o+='<details><summary>Catatan harian</summary><ul class="kbLog">'+H.log.slice(0,12).map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul></details>';
 if(H.lenc.length)o+='<p class="kbLenc">'+H.lenc.map(function(k){return '<span>Panen '+SAYUR[k].nama+'</span>';}).join('')+'</p>';
 if(ST.gagal)o+='<p><small>⚠ Kemajuan tidak bisa disimpan di perangkat ini; simulasi tetap berjalan.</small></p>';
 return o+htmlBanding()+htmlSumber();}
function htmlBanding(){return '<details><summary>Bandingkan: kebun tanah vs hidroponik</summary><table class="kbTbl"><tr><td></td><td><b>Tanah (Kebun Simulasi)</b></td><td><b>Hidroponik NFT</b></td></tr>'+
 '<tr><td>Media</td><td>tanah + kompos</td><td>larutan nutrisi di pipa</td></tr><tr><td>Hara</td><td>pupuk/kompos, sulit diukur</td><td>AB mix, diukur dengan meter ppm</td></tr>'+
 '<tr><td>Air</td><td>disiram; sebagian meresap dan menguap</td><td>bersirkulasi kembali ke tandon</td></tr><tr><td>Yang dipantau</td><td>kelembapan tanah, gulma</td><td>ppm, pH, pompa</td></tr>'+
 '<tr><td>Listrik</td><td>tidak perlu</td><td>pompa '+WATT+' W (bisa dari PLTS)</td></tr><tr><td>Panen kangkung</td><td>±21–30 hari</td><td>±20–25 hari</td></tr></table></details>';}
function htmlSumber(){return '<details><summary>Aturan &amp; sumber (untuk guru)</summary><p><small>Zona ppm &amp; pH: Agrisevika UPN Jatim, Tabel 1 (pakcoy pH 7,0; simulasi memberi toleransi ±0,5; NFT pakcoy/selada stabil pada pH 6,2–7,6 menurut Agritech Unhas). Umur panen hidroponik: Rumah123 (kangkung 20–25, selada 30–45, pakcoy 30–40 hari); kebun tanah: Kompas. Pompa: 9–12 jam/hari tidak berbeda nyata dengan 24 jam (SINTECH UDB); pompa 8 W (Repository Kementan). <b>Penyederhanaan:</b> ppm turun 5 %/hari karena diserap (di instalasi nyata ppm bisa naik bila air menguap, jadi ukur setiap hari), pH naik 0,1/hari, efek pompa 0 dan 6 jam, besar penurunan kesehatan. Waktu maju dengan tombol hari.</small></p></details>';}
/* ---------- tampilan TOGA ---------- */
function htmlToga(){var o='<p><b>TOGA</b> = Tanaman Obat Keluarga: tanaman bumbu dan jamu yang ditanam di pekarangan. Pilih tanaman untuk mengenalnya.</p><div class="baris" role="group" aria-label="Tanaman">';
 TOGA.forEach(function(t){o+=pil('tgPil',t.k,t.n,ST.pil===t.k);});o+='</div>';
 var t=TOGA.filter(function(x){return x.k===ST.pil;})[0];
 o+='<div class="kbPil"><p><b>'+t.n+'</b> <i>('+t.l+')</i></p><table class="kbTbl"><tr><td>Bagian yang dipakai</td><td>'+t.b+'</td></tr><tr><td>Dimanfaatkan untuk</td><td>'+t.m+'</td></tr><tr><td>Cara memperbanyak</td><td>'+t.p+'</td></tr><tr><td>Perawatan</td><td>'+t.r+'</td></tr></table></div>';
 o+='<div class="kbMsg w" role="note"><b>Aman dulu.</b> Jangan mencicipi atau memetik tanaman tanpa izin guru. Ramuan tradisional bukan pengganti obat dokter dan tidak dipakai untuk keadaan darurat. Bahan alami pun punya aturan: misalnya kunyit tidak disarankan bagi orang yang sedang minum obat pengencer darah.</div>';
 o+='<h3>Kuis TOGA</h3>';KUIS.forEach(function(q,i){o+='<p>'+(i+1)+'. '+q.t+'</p><div class="baris" role="group" aria-label="Soal '+(i+1)+'">';q.p.forEach(function(p,j){o+=pil('tgKuis',i+'-'+j,p,ST.kuis[i]===j);});o+='</div>';
  if(ST.kuis[i]!=null)o+='<div class="kbMsg '+(ST.kuis[i]===q.j?'':'w')+'" role="status">'+(ST.kuis[i]===q.j?'<b>Benar.</b>':'<b>Belum tepat.</b> Jawaban: '+q.p[q.j]+'.')+'</div>';});
 var nb=KUIS.filter(function(q,i){return ST.kuis[i]===q.j;}).length;if(Object.keys(ST.kuis).length===KUIS.length)o+='<p><b>Skor: '+nb+' / '+KUIS.length+'</b></p>';
 o+='<details><summary>Sumber (untuk guru)</summary><p><small>Kemenkes (2020): jahe, kunyit, sereh termasuk tanaman obat yang disarankan dimanfaatkan; Formularium Ramuan Obat Tradisional Indonesia (KMK HK.01.07/MENKES/187/2017): ramuan tidak dipakai untuk kegawatdaruratan; FOHAI (Permenkes 6/2016): Riskesdas 2010 jahe 50,36 %; Buku Pedoman Empon-Empon KKN-PPM UGM 2020: kunyit untuk letih lesu, tidak disarankan bersama obat pengencer darah. Cara memperbanyak dan perawatan = pengetahuan budidaya umum.</small></p></details>';
 return o;}
/* ---------- panel ---------- */
function gambar(){var kb=el('kb');if(!kb||!ST.f)return;var ak=document.activeElement,sel=null;if(ak&&kb.contains(ak)&&ak.getAttribute&&ak.getAttribute('data-act'))sel='[data-act="'+ak.getAttribute('data-act')+'"]'+(ak.getAttribute('data-v')!=null?'[data-v="'+ak.getAttribute('data-v')+'"]':'');
 var dt={};Array.prototype.forEach.call(kb.querySelectorAll('details'),function(d){var s=d.querySelector('summary');if(s)dt[s.textContent]=d.open;});
 kb.innerHTML=ST.f==='hidro'?htmlHidro():htmlToga();
 Array.prototype.forEach.call(kb.querySelectorAll('details'),function(d){var s=d.querySelector('summary');if(s&&dt[s.textContent])d.open=true;});
 if(sel){var x=kb.querySelector(sel);if(x)try{x.focus({preventScroll:true});}catch(e){}}}
function buka(fi){if(!SAYA)return;muat();ST.f=fi;bukaPanel(fi==='hidro'?'Hidroponik NFT':'Taman TOGA',fi==='hidro'?'#2e7d32':'#6d4c41','');gambar();var kh=el('kh');if(kh)try{kh.focus({preventScroll:true});}catch(e){}}
function cari(p){var t=TANAH;if(p.x>8.0&&p.x<11.0&&p.z>-1.8&&p.z<2.2&&p.y<t+2.0)return 'hidro';return '';}
function toga(p){var t=TANAH;return p.x>9.38&&p.x<10.62&&p.z>3.05&&p.z<8.45&&p.y>t+0.2;}
function aksi(a,b){if(!/^(f4|tg)/.test(a))return false;if(!ST.f||el('panel').style.display!=='flex')return true;var v=b.getAttribute('data-v');
 if(a==='f4Sayur'&&SAYUR[v]){mulai(v);simpan();}
 else if(H&&H.k&&!H.panen&&!H.mati&&a==='f4Atur'){if(v==='ab')H.ppm=Math.min(3000,H.ppm+200);else if(v==='air')H.ppm=Math.max(0,H.ppm-150);else if(v==='phd')H.ph=Math.max(3,Math.round((H.ph-0.3)*10)/10);else if(v==='phu')H.ph=Math.min(9.5,Math.round((H.ph+0.3)*10)/10);H.pesan='';simpan();}
 else if(H&&H.k&&!H.panen&&!H.mati&&a==='f4Pompa'&&POMPA.indexOf(+v)>=0){H.pompa=+v;H.pesan='';simpan();}
 else if(H&&H.k&&a==='f4Hari'&&(v==='1'||v==='3')){for(var i=0;i<+v;i++)lewat();simpan();}
 else if(a==='f4Baru'){H=kosong(H.lenc);simpan();}
 else if(a==='tgPil'&&TOGA.some(function(t){return t.k===v;}))ST.pil=v;
 else if(a==='tgKuis'){var q=String(v).split('-').map(Number);if(KUIS[q[0]]&&q[1]>=0&&q[1]<3)ST.kuis[q[0]]=q[1];}
 gambar();if(a==='f4Hari'||a==='tgKuis'){var m=el('kb').querySelector('.kbMsg');if(a==='tgKuis'){var ms=el('kb').querySelectorAll('.kbMsg');m=null;var qi=+String(v).split('-')[0],gr=el('kb').querySelector('[aria-label="Soal '+(qi+1)+'"]');if(gr&&gr.nextElementSibling&&gr.nextElementSibling.classList.contains('kbMsg'))m=gr.nextElementSibling;}if(m&&m.scrollIntoView)try{m.scrollIntoView({block:'nearest'});}catch(e){}}return true;}
return {buka:buka,cari:cari,toga:toga,aksi:aksi};
})();
/* akhir v0.6.0 hidroponik + TOGA */
/* ===== v0.7.0: F5 BANK SAMPAH tahap 1 (tanpa perubahan server; konsep K4 "poin dulu", KONSEP §3 F5).
   Pemicu: ketuk meja timbang di Bank Sampah (ecoCangkang, F5.cari) atau papan NILAI POIN di dinding belakang / papan atlas BANK SAMPAH.
   Data: aksi infoAdiwiyata yang SUDAH ada (Code v0.22.0; gsc = cache + segar): papan (peringkat rombel bulan ini), kelas, laporanku, jenis (kg),
   jenisLapor. Panel "Bank Sampah" 3 tab: Tabungan rombel (poin, kg, peringkat, kader, 10 besar), Nilai poin & hitung (tabel poin per jenis +
   kalkulator perkiraan), Riwayat setoranku (laporan 30 hari terakhir dari server). Tombol "Setor / lapor sampah" membuka panel Adiwiyata lama.
   Papan 'bankPapan' (kanvas 512×320, MeshBasic, +1 draw call) di dinding belakang Bank Sampah: nilai poin per jenis dari cache (diperiksa tiap 2 dtk
   bersama papan laporan Adiwiyata; tanpa panggilan server tambahan). Pengertian bank sampah: Permen LHK No. 14/2021 Pasal 1 angka 6. ===== */
var F5=(function(){
var ST={tab:'tabung',jenis:'',jml:1,pn:-1,j:null,papan:null,kd:null};
function hE(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function f(n,d){return Number(n).toLocaleString('id-ID',{maximumFractionDigits:d==null?2:d,minimumFractionDigits:0});}
function daftarJenis(j){var o=[],ada={};((j&&j.jenisLapor)||[]).concat((j&&j.jenis)||[]).forEach(function(x){if(x&&x.kode&&!ada[x.kode]){ada[x.kode]=1;o.push({kode:String(x.kode),nama:String(x.nama||x.kode),satuan:x.satuan==='buah'?'buah':'kg',p:Number(x.poin_per_satuan)||0});}});return o;}
function pil(act,v,teks,on){return '<button class="'+(on?'p':'s2')+'" data-act="'+act+'" data-v="'+hE(v)+'" aria-pressed="'+(!!on)+'">'+teks+'</button>';}
function jumlahTeks(x){return x.satuan==='buah'?f(x.jumlah,0)+' buah':f((Number(x.jumlah)||0)/1000)+' kg';}
var STATUS={menunggu:'menunggu',disetujui:'disetujui',ditolak:'ditolak',batal:'dibatalkan'};
function htmlTabung(j){var o='',pp=j.papan||[],k=j.kelas,me=null;if(k)pp.forEach(function(x){if(x.kelas_id===k.kelas_id)me=x;});
 if(k){o+='<div class="kbPil"><p><b>Buku tabungan rombel '+hE(k.nama_kelas||k.kelas_id)+'</b></p><table class="kbTbl"><tr><td>Poin bulan ini</td><td><b>'+(me?fPoin(me.poin):'0')+'</b></td></tr><tr><td>Sampah tercatat</td><td><b>'+(me?fKg(me.gram):'0')+' kg</b></td></tr><tr><td>Peringkat</td><td><b>'+(me?me.r+' dari '+pp.length:'belum masuk peringkat')+'</b></td></tr>'+
  (k.kader&&k.kader.length?'<tr><td>Kader (petugas timbang)</td><td>'+k.kader.map(hE).join(', ')+'</td></tr>':'')+'</table></div>';}
 o+='<h3>Peringkat rombel bulan ini</h3>';
 if(!pp.length)o+='<p>Belum ada poin rombel bulan ini. Setor sampah terpilah agar rombelmu masuk peringkat.</p>';
 else{o+='<table class="kbTbl"><tr><th>#</th><th>Rombel</th><th>Poin</th><th>kg</th></tr>';pp.slice(0,10).forEach(function(x){var m=k&&x.kelas_id===k.kelas_id;o+='<tr'+(m?' class="f5Me"':'')+'><td>'+x.r+'</td><td>'+hE(x.nama_kelas)+(m?' (rombelmu)':'')+'</td><td>'+fPoin(x.poin)+'</td><td>'+fKg(x.gram)+'</td></tr>';});o+='</table>';}
 return o;}
function htmlNilai(j){var L=daftarJenis(j),o='<p>Setiap jenis sampah terpilah punya nilai poin. Poin rombel bertambah setelah setoran <b>ditimbang atau disetujui</b> kader/guru.</p>';
 if(!L.length)return o+'<p>Daftar jenis sampah belum tersedia.</p>';
 o+='<table class="kbTbl"><tr><th>Jenis</th><th>Poin</th></tr>'+L.map(function(x){return '<tr><td>'+hE(x.nama)+'</td><td>'+f(x.p)+' per '+x.satuan+'</td></tr>';}).join('')+'</table>';
 if(!ST.jenis||!L.some(function(x){return x.kode===ST.jenis;}))ST.jenis=L[0].kode;var J=L.filter(function(x){return x.kode===ST.jenis;})[0];
 o+='<h3>Hitung perkiraan poin</h3><div class="baris" role="group" aria-label="Jenis sampah">'+L.map(function(x){return pil('f5Jenis',x.kode,hE(x.nama),x.kode===ST.jenis);}).join('')+'</div>';
 o+='<div class="baris f5Jml" role="group" aria-label="Jumlah"><button class="s2" data-act="f5Kurang" aria-label="Kurangi">−</button><span role="status"><b>'+f(ST.jml,1)+' '+J.satuan+'</b></span><button class="s2" data-act="f5Tambah" aria-label="Tambah">+</button></div>';
 o+='<div class="kbMsg" role="status">'+f(ST.jml,1)+' '+J.satuan+' '+hE(J.nama)+' × '+f(J.p)+' = <b>± '+f(ST.jml*J.p)+' poin</b> (perkiraan).</div>';
 return o;}
function htmlRiwayat(j){var L=j.laporanku||[],o='<p>Setoranmu yang dilaporkan lewat tong Bank Sampah (30 hari terakhir).</p>';
 if(!L.length)return o+'<p>Belum ada setoran. Ketuk salah satu tong pilah atau tombol di bawah untuk melapor.</p>';
 o+='<table class="kbTbl"><tr><th>Tanggal</th><th>Setoran</th><th>Poin</th><th>Status</th></tr>'+L.slice(0,20).map(function(x){return '<tr><td>'+hE(String(x.tanggal).slice(5).split('-').reverse().join('/'))+'</td><td>'+hE(x.nama_jenis)+' '+jumlahTeks(x)+'</td><td>'+fPoin(x.poin)+'</td><td>'+hE(STATUS[x.status]||x.status)+'</td></tr>';}).join('')+'</table>';
 return o;}
function html(){var j=ST.j,o='<p class="f5Alur" aria-label="Alur bank sampah"><span>Pilah</span><i aria-hidden="true">→</i><span>Timbang</span><i aria-hidden="true">→</i><span>Catat</span><i aria-hidden="true">→</i><span>Tabung poin</span></p>';
 o+='<div class="baris" role="group" aria-label="Bagian">'+pil('f5Tab','tabung','Tabungan',ST.tab==='tabung')+pil('f5Tab','nilai','Nilai poin',ST.tab==='nilai')+pil('f5Tab','riwayat','Riwayatku',ST.tab==='riwayat')+'</div>';
 if(!j)o+='<div class="muat"></div><p>Memuat…</p>';else if(!j.ok)o+='<p class="err">'+hE(j.error||'Gagal memuat.')+'</p>';
 else o+=ST.tab==='tabung'?htmlTabung(j):ST.tab==='nilai'?htmlNilai(j):htmlRiwayat(j);
 o+='<div class="baris"><button class="p" data-act="f5Lapor">Setor / lapor sampah</button></div>';
 o+='<details><summary>Apa itu bank sampah? (untuk guru)</summary><p><small>Bank sampah adalah fasilitas untuk mengelola sampah dengan prinsip 3R (kurangi, pakai ulang, daur ulang), sekaligus sarana edukasi dan perubahan perilaku (Permen LHK No. 14/2021 Pasal 1 angka 6). Di Eco-Gazebo, "tabungan" berupa poin rombel; nilai poin per jenis diatur guru di lembar Sampah. Tabungan rupiah per siswa = tahap 2 (butuh perubahan server, menunggu persetujuan).</small></p></details>';
 return o;}
function gambar(){var kb=el('kb');if(!kb||ST.pn!==PNL)return;var ak=document.activeElement,sel=null;if(ak&&kb.contains(ak)&&ak.getAttribute&&ak.getAttribute('data-act'))sel='[data-act="'+ak.getAttribute('data-act')+'"]'+(ak.getAttribute('data-v')!=null?'[data-v="'+ak.getAttribute('data-v')+'"]':'');
 var dt={};Array.prototype.forEach.call(kb.querySelectorAll('details'),function(d){var s=d.querySelector('summary');if(s)dt[s.textContent]=d.open;});
 kb.innerHTML=html();Array.prototype.forEach.call(kb.querySelectorAll('details'),function(d){var s=d.querySelector('summary');if(s&&dt[s.textContent])d.open=true;});
 if(sel){var x=kb.querySelector(sel);if(x)try{x.focus({preventScroll:true});}catch(e){}}}
function buka(){if(!SAYA){tampilLogin('Masuk dulu.');return;}ST.j=null;bukaPanel('Bank Sampah','#2f6f4f','');ST.pn=PNL;gambar();var kh=el('kh');if(kh)try{kh.focus({preventScroll:true});}catch(e){}
 var pn=PNL;gsc('infoAdiwiyata',null,function(j,dc){if(pn!==PNL)return;if(!j&&dc)return;ST.j=j||{ok:false};gambar();});}
function cari(p){var t=TANAH;return p.x>9.95&&p.x<10.7&&p.z>9.9&&p.z<11.0&&p.y>t+0.3&&p.y<t+1.4?'bank':'';}
function aksi(a,b){if(!/^f5/.test(a))return false;if(ST.pn!==PNL||el('panel').style.display!=='flex')return true;var v=b.getAttribute('data-v');
 if(a==='f5Lapor'){bukaAdi('');return true;}
 if(a==='f5Tab'&&/^(tabung|nilai|riwayat)$/.test(v))ST.tab=v;
 else if(a==='f5Jenis'){ST.jenis=String(v);ST.jml=1;}
 else if(a==='f5Tambah'||a==='f5Kurang'){var L=daftarJenis(ST.j),J=L.filter(function(x){return x.kode===ST.jenis;})[0],lk=J&&J.satuan==='kg'?0.5:1;ST.jml=Math.max(lk,Math.min(J&&J.satuan==='kg'?50:500,Math.round((ST.jml+(a==='f5Tambah'?lk:-lk))*10)/10));}
 gambar();return true;}
/* ---------- papan nilai poin di dinding ---------- */
function bangun(){var T=AFRAME.THREE,cv=document.createElement('canvas');cv.width=512;cv.height=320;var tx=teksturK(cv),m=pasangM('bankPapan',new T.PlaneGeometry(1.6,1.0),new T.MeshBasicMaterial({map:tx}));
 m.position.set(8.95,TANAH+1.62,9.375);klik(m.userData.el,{t:'bank'});ST.papan={cv:cv,tx:tx};ST.kd=null;segar();}
function gambarPapan(j){var g=ST.papan.cv.getContext('2d'),w=512,h=320,L=daftarJenis(j&&j.ok?j:null);g.fillStyle='#fbfaf4';g.fillRect(0,0,w,h);g.fillStyle='#2f6f4f';g.fillRect(0,0,w,56);
 g.textBaseline='middle';g.textAlign='left';g.fillStyle='#fff6dc';teksPas(g,'Nilai Poin Bank Sampah',18,29,476,30,'bold');g.fillStyle='#33402f';
 if(!j||!j.ok||!L.length){g.textAlign='center';teksPas(g,!SAYA?'Masuk untuk melihat nilai poin.':(j?'Nilai poin belum tersedia.':'Memuat…'),256,170,470,26,'600');}
 else L.slice(0,6).forEach(function(x,k){var y=88+k*34;if(k%2===0){g.fillStyle='#eef5e9';g.fillRect(10,y-16,492,32);}g.textAlign='left';g.fillStyle='#33402f';teksPas(g,x.nama,20,y,290,22,'600');g.textAlign='right';g.fillStyle='#1b5e20';teksPas(g,f(x.p)+' poin / '+x.satuan,494,y,180,22,'bold');});
 g.fillStyle='#2f6f4f';g.fillRect(0,h-24,w,24);g.fillStyle='#fff6dc';g.textAlign='center';teksPas(g,'Ketuk papan atau meja timbang: Buku Tabungan',256,h-12,490,15,'600');ST.papan.tx.needsUpdate=true;}
function segar(){if(!ST.papan)return;var j=(SAYA&&TOKEN)?KC[TOKEN+'|infoAdiwiyata|{}']:null,kd=j||(SAYA?'muat':'luar');if(kd!==ST.kd){ST.kd=kd;gambarPapan(j||null);}}
return {buka:buka,cari:cari,aksi:aksi,bangun:bangun,segar:segar};
})();
/* akhir v0.7.0 bank sampah */
/* ===== v0.6.0: POHON EKO lebih realistis (permintaan pengguna 10/11 23:00). Pengganti pemanggilan pohon() UMUM di langkahTanah (fungsi pohon() UMUM TIDAK diubah).
   9 pohon tepi halaman digabung jadi SATU mesh Lambert berwarna per titik (dulu 27 entitas = hingga 27 draw call): batang lancip 7 sisi, 2 dahan,
   5 gumpal daun ikosahedron (detail 1) dengan permukaan tidak rata (geser titik deterministik) dan gradasi warna gelap di bawah–terang di atas,
   + bayangan tanah palsu (cakram gelap). ±470 segitiga/pohon (sama dengan versi lama ±450). ===== */
function pohonEco(daftar){var T=AFRAME.THREE,t=TANAH,bag=[],mt=new T.Matrix4(),i,j,k;
 var acak=(function(s){return function(){s=(s*16807)%2147483647;return(s-1)/2147483646;};})(20261110);
 function hash(x,y,z){var h=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return h-Math.floor(h);}
 function tambah(g,warna,pos,rot,sk,daun){g=g.index?g.toNonIndexed():g;mt.compose(pos,new T.Quaternion().setFromEuler(rot||new T.Euler()),sk||new T.Vector3(1,1,1));
  var P=g.attributes.position,n=P.count,c=new Float32Array(n*3),cl=new T.Color(warna),v=new T.Vector3(),y0=1e9,y1=-1e9,q;
  if(daun){for(q=0;q<n;q++){v.fromBufferAttribute(P,q);var r=0.82+0.36*hash(Math.round(v.x*1000),Math.round(v.y*1000),Math.round(v.z*1000));P.setXYZ(q,v.x*r,v.y*r*0.92,v.z*r);}}
  g.applyMatrix4(mt);for(q=0;q<n;q++){var yy=P.getY(q);if(yy<y0)y0=yy;if(yy>y1)y1=yy;}
  for(q=0;q<n;q++){var u=daun?(P.getY(q)-y0)/Math.max(1e-3,y1-y0):0.5,f=daun?0.62+0.55*u+0.08*(hash(q,P.getX(q),1)-0.5):1;c[q*3]=Math.min(1,cl.r*f);c[q*3+1]=Math.min(1,cl.g*f);c[q*3+2]=Math.min(1,cl.b*f);}
  g.setAttribute('color',new T.BufferAttribute(c,3));g.deleteAttribute('uv');g.computeVertexNormals();bag.push(g);}
 var DAUN=['#2e7d32','#3b7d2a','#43a047','#4e7d26','#357a38'];
 daftar.forEach(function(d,ix){var x=d[0],z=d[1],s=d[2],V=function(a,b,c){return new T.Vector3(a,b,c);},hB=2.1*s,ry=acak()*Math.PI*2;
  tambah(new T.CylinderGeometry(1.25*s,1.25*s,0.01,12),'#6a9e3a',V(x+0.25*s,t+0.006,z+0.2*s));
  tambah(new T.CylinderGeometry(0.085*s,0.17*s,hB,7),'#5d4330',V(x,t+hB/2,z),new T.Euler(0,ry,0));
  for(j=0;j<2;j++){var a=ry+j*Math.PI+0.4;tambah(new T.CylinderGeometry(0.035*s,0.07*s,0.95*s,5),'#5d4330',V(x+Math.cos(a)*0.3*s,t+1.75*s,z+Math.sin(a)*0.3*s),new T.Euler(Math.sin(a)*0.75,0,-Math.cos(a)*0.75));}
  var dw=DAUN[ix%DAUN.length];tambah(new T.IcosahedronGeometry(0.95*s,1),dw,V(x,t+2.75*s,z),new T.Euler(0,ry,0),V(1,0.85,1),true);
  for(k=0;k<4;k++){var b=ry+k*Math.PI/2+acak()*0.5,rr=(0.55+acak()*0.2)*s;tambah(new T.IcosahedronGeometry(rr,1),DAUN[(ix+k+1)%DAUN.length],V(x+Math.cos(b)*0.62*s,t+(2.35+acak()*0.6)*s,z+Math.sin(b)*0.62*s),new T.Euler(acak(),acak(),0),V(1,0.82,1),true);}});
 var tot=0,off=0;bag.forEach(function(g){tot+=g.attributes.position.count;});var P=new Float32Array(tot*3),N=new Float32Array(tot*3),C=new Float32Array(tot*3);
 bag.forEach(function(g){P.set(g.attributes.position.array,off*3);N.set(g.attributes.normal.array,off*3);C.set(g.attributes.color.array,off*3);off+=g.attributes.position.count;g.dispose();});
 var gm=new T.BufferGeometry();gm.setAttribute('position',new T.BufferAttribute(P,3));gm.setAttribute('normal',new T.BufferAttribute(N,3));gm.setAttribute('color',new T.BufferAttribute(C,3));gm.computeBoundingSphere();
 return pasangM('pohonEco',gm,new T.MeshLambertMaterial({vertexColors:true}));}
/* akhir v0.6.0 pohon eko */
/* v0.3.0: halaman ringkas x 4,5..27,5 × z −6..20 (pagar tanaman); batas jalan 0,6 m di dalam pagar. TABRAK: gazebo (sama), kolam (11; 16),
   bedeng sayur, komposter EM4, Taman TOGA. Gapura ke Kelas Raudhah dan pagarnya dihapus. */
var HAL={x0:5.1,x1:26.9,z0:-5.4,z1:19.3};
var TABRAK=[[11.4,12.0,2.5,8.7],[20.0,20.6,2.5,8.7],[11.4,20.6,2.5,3.1],[11.4,14.9,8.1,8.7],[17.1,20.6,8.1,8.7],
 [8.6,13.4,13.6,18.4],
 [18.3,24.5,13.9,17.7],[25.1,26.7,15.1,16.5],
 [9.2,10.65,3.05,8.85], /* v0.6.0: x0 9,35 → 9,2 (papan + tiang TOGA di sisi barat) */
 /* v0.4.0 (denah K0): Bank Sampah, rumah hidroponik, tutup sumur resapan */
 [7.8,10.8,9.2,11.8],[8.0,11.0,-1.8,2.2],[18.7,19.9,0.3,1.5]];
function tinggiPijak(x,z){
 if(x>=11.7&&x<=20.3&&z>=2.8&&z<=8.4)return 0;if(x>=14.9&&x<=17.1&&z>8.4&&z<=8.7)return -0.15;if(x>=14.9&&x<=17.1&&z>8.7&&z<=9.0)return -0.3;
 return TANAH;}
/* v0.7.0: titik mulai di depan gapura (16; 23,4). Selain halaman, boleh berjalan di LORONG gerbang (x 14,75..17,25; z 19,3..20,4)
   dan PELATARAN luar (x 12..20; z 20,4..24,0). Wilayah ditentukan dari posisi bingkai sebelumnya (LALU); lompatan > 1 m (pindah posisi oleh
   kode: pose kebun, uji) memakai wilayah posisi baru. Halaman, pagar tanaman, dan TABRAK lain tidak berubah. */
var GERBANG={x0:14.75,x1:17.25,z1:20.4,px0:12,px1:20,pz1:24.0},LALU=null,RUTE=null,WPT=null;
function wilayahG(x,z){var G=GERBANG;return z<=HAL.z1?0:(z<G.z1&&x>G.x0&&x<G.x1)?1:(z>=G.z1&&x>=G.px0&&x<=G.px1)?2:0;} /* di luar lorong/pelataran = halaman (didorong kembali ke dalam) */
function batasGerak(p,dt){
 var w=(LALU&&Math.hypot(p.x-LALU.x,p.z-LALU.z)<=1)?wilayahG(LALU.x,LALU.z):wilayahG(p.x,p.z),G=GERBANG;
 if(p.z<HAL.z0)p.z=HAL.z0;if(p.z>G.pz1)p.z=G.pz1;
 if(w===2){if(p.x<G.px0)p.x=G.px0;if(p.x>G.px1)p.x=G.px1;if(p.z<G.z1&&(p.x<G.x0||p.x>G.x1))p.z=G.z1;}
 else if(w===1){if(p.x<G.x0)p.x=G.x0;if(p.x>G.x1)p.x=G.x1;}
 else{if(p.x<HAL.x0)p.x=HAL.x0;if(p.x>HAL.x1)p.x=HAL.x1;if(p.z>HAL.z1&&(p.x<G.x0||p.x>G.x1))p.z=HAL.z1;}
 LALU={x:p.x,z:p.z};
 /* rute lewat gerbang: tujuan di wilayah lain (halaman <-> pelataran) → titik antara (16; 18,8) dan (16; 21,0), supaya tidak tersangkut di pagar tanaman.
    Gerak UMUM mengosongkan TUJUAN saat titik antara tercapai, jadi titik berikut diambil bila posisi = titik antara terakhir (WPT). */
 function lanjut(){var nx=RUTE.shift();TUJUAN={x:nx.x,z:nx.z,t:Date.now(),d:1e9,rt:1,wp:RUTE.length?1:0};WPT=TUJUAN.wp?{x:nx.x,z:nx.z}:null;}
 if(!TUJUAN){if(RUTE&&RUTE.length&&WPT&&Math.hypot(WPT.x-p.x,WPT.z-p.z)<0.05)lanjut();else{RUTE=null;WPT=null;}}
 else if(!TUJUAN.rt){var wt=wilayahG(TUJUAN.x,TUJUAN.z);TUJUAN.rt=1;if(wt!==w){var A={x:16,z:18.8},Bp={x:16,z:21.0};RUTE=(w===0?[A,Bp]:w===2?[Bp,A]:[wt===0?A:Bp]).concat([{x:TUJUAN.x,z:TUJUAN.z}]);lanjut();}}
 else if(TUJUAN.wp&&RUTE&&RUTE.length&&Math.hypot(TUJUAN.x-p.x,TUJUAN.z-p.z)<0.3)lanjut();
 for(var i=0;i<TABRAK.length;i++){var r=TABRAK[i];if(p.x>r[0]&&p.x<r[1]&&p.z>r[2]&&p.z<r[3]){var d=[p.x-r[0],r[1]-p.x,p.z-r[2],r[3]-p.z],m=Math.min(d[0],d[1],d[2],d[3]);
  if(m===d[0])p.x=r[0];else if(m===d[1])p.x=r[1];else if(m===d[2])p.z=r[2];else p.z=r[3];}}
 if(TUJUAN){var jr=Math.hypot(TUJUAN.x-p.x,TUJUAN.z-p.z);if(jr<TUJUAN.d-0.04){TUJUAN.d=jr;TUJUAN.t=Date.now();TUJUAN.n=0;}else if((TUJUAN.n=(TUJUAN.n||0)+1)>20&&Date.now()-TUJUAN.t>1200)TUJUAN=null;}
 if(!duduk){var ty=tinggiPijak(p.x,p.z),dy=ty-p.y;if(Math.abs(dy)<0.005)p.y=ty;else p.y+=dy*Math.min(1,(dt||0.016)*12);}}
function animasiHias(){}
function langkahLangit(){bagian='langit';var T=AFRAME.THREE,i;
 /* langit gradasi (bola terbalik, warna per titik) — sama dengan Kelas Raudhah v0.22.0 langkahIndah bagian 1 */
 var sg=new T.SphereGeometry(110,24,12),cA=new T.Color('#3f86c9'),cB=new T.Color('#d8eef7'),col=[],ps=sg.attributes.position;
 for(i=0;i<ps.count;i++){var y=Math.max(0,ps.getY(i)/110),cc=cB.clone().lerp(cA,Math.pow(y,0.6));col.push(cc.r,cc.g,cc.b);}
 sg.setAttribute('color',new T.Float32BufferAttribute(col,3));var lg=pasangM('langit',sg,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,depthWrite:false,fog:false}));lg.renderOrder=-1;}
function langkahTanah(){bagian='tanah';
 /* sama dengan Kelas Raudhah v0.22.0 langkah5; v0.3.0: pohon ditata ulang di tepi halaman ringkas (tidak ada di jalan, kolam, bedeng) */
 var tnh=B(0,TANAH-0.05,0,140,0.1,140,'#7cb342',dunia);klik(tnh,{t:'lantai'});
 pohonEco([[6.0,-3.8,1.2],[5.7,1.8,1.1],[5.6,6.8,1.3],[5.8,16.6,1.2],[25.6,-3.6,1.3],[25.4,3.2,1.2],[25.6,9.4,1.1],[11.2,-4.6,1.0],[20.8,-4.6,1.1]]); /* v0.6.0: pohon Eco 1 mesh (pohon() UMUM tidak dipakai lagi di sini) */
 S(45,-6,-20,22,'#5e9c6a',dunia,0.6);S(-50,-8,-5,26,'#6aa874',dunia,0.5);S(20,-9,40,24,'#79b27f',dunia,0.5);
 [[-20,30,-60],[15,34,-50],[40,28,10],[-35,32,20]].forEach(function(t){S(t[0],t[1],t[2],7,'#ffffff',dunia,0.35);});
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
  try{sc.canvas.setAttribute('role','img');sc.canvas.setAttribute('aria-label','Eco-Gazebo 3D: halaman sekolah dengan gazebo, Bank Sampah, rumah hidroponik, sumur resapan, kolam, dan bedeng Kebun Simulasi. Ketuk tanah untuk berjalan, ketuk tong untuk melapor sampah, ketuk bedeng untuk menanam; menu di kiri atas.');}catch(e){}
  rig=document.getElementById('rig');cam=document.getElementById('cam');dunia=document.getElementById('dunia');
  if(panelBuka)jedaRender();
  var L=[langkahLangit,langkahTanah,langkahHalaman],i=0;
  function jalan(){if(i<L.length){L[i++]();requestAnimationFrame(jalan);}else{
   try{sc.components.raycaster.refreshObjects();}catch(e){}
   document.getElementById('muat').style.display='none';bagian='siap';setV(!SRV_GALAT);FPS.mulai=Date.now()+3000;terapkanKualitas();if(panelBuka)jedaRender();SIAP=true;
   /* v0.2.0: muat bertahap — gazebo realistis dibangun setelah bisa berjalan */
   requestAnimationFrame(function(){try{bagian='gazebo';gazeboEco();sc.components.raycaster.refreshObjects();bagian='siap';if(panelBuka)jedaRender();}catch(e){setV(false);}
    /* v0.4.0: cangkang 6 fitur 1 bingkai sesudah gazebo */
    requestAnimationFrame(function(){try{bagian='fitur';fiturEco();sc.components.raycaster.refreshObjects();bagian='siap';if(panelBuka)jedaRender();}catch(e){setV(false);}});});}}
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
IK.rombel='<path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75"/>';
IK.rumah='<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>';
IK.pindah='<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>';
(function sesuaikanEco(){
 el('ovlJ').textContent='Eco-Gazebo Raudhah';
 var pk=el('ovl').querySelector('.kt > p');if(pk)pk.textContent='Ruang 3D Adiwiyata: lapor sampah di Bank Sampah, kompos MBG, kebun simulasi, dan papan poin rombel. Masuk dengan akun Kelas Raudhah yang sama.';
 var hd=el('hud');hd.setAttribute('aria-label','Menu Eco-Gazebo');
 var kk=hd.querySelector('.lKaki span');if(kk)kk.textContent='Eco-Gazebo '+VERSI;
 var nav=el('laciNav'),bv=el('bVR');
 var bK=document.createElement('button');bK.id='mKelolaR';jadiItem(bK,'rombel','Kelola rombel');bK.onclick=function(){bukaKelolaR();};bK.style.display='none';
 var bA=document.createElement('button');bA.id='mAturAdi';jadiItem(bA,'atur','Atur Adiwiyata');bA.onclick=function(){bukaAturAdi();};bA.style.display='none';
 /* v0.3.2: butir "Kembali ke Kelas Raudhah" dihapus (permintaan pengguna 01/11); Beranda dipertahankan */
 var bH=document.createElement('button');bH.id='mBeranda';jadiItem(bH,'rumah','Beranda');bH.onclick=function(){konfHome();};
 nav.insertBefore(bK,bv||null);nav.insertBefore(bA,bv||null);nav.insertBefore(bH,bv||null);
 setLabel(el('mAdi'),'Adiwiyata');
 el('bTutup').textContent='Kembali ke gazebo';
 var hx=el('hudX').onclick;el('hudX').onclick=function(){teksKonf(null);hx.apply(this,arguments);};
})();
var renderHudUmum=renderHud;
renderHud=function(){renderHudUmum();var bk=el('mKelolaR');if(bk)bk.style.display=(SAYA&&SAYA.peran==='guru')?'':'none'; /* pemilik: tombol Kelola rombel di Atur Adiwiyata (laci HP mendatar tetap 7 butir) */var b=el('mAturAdi');if(b)b.style.display=(SAYA&&SAYA.peran==='pemilik'&&!SAYA.juri)?'':'none';if(SAYA)prefetchAdi();try{KBN.segar();}catch(e){}};
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
/* akhir eco_v0.7.0.js — Eco-Gazebo v0.7.0 */

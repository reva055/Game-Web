/* Backsound Monopoli Atom: looping + tombol ON/OFF + 2 lagu.
   home = lagu tampilan awal/menu, quiz = lagu saat kuis (permainan) dimulai.
   Musik mulai otomatis saat interaksi pertama (aturan autoplay browser). */
const Music=(()=>{
 const SRC={home:"backsound.mp3",quiz:"backsound-kuis.mp3"},A={};
 for(const k in SRC){const a=new Audio(SRC[k]);a.loop=true;a.preload="auto";a.volume=.6;A[k]=a;
  a.addEventListener("ended",()=>{a.currentTime=0;play()})}   /* cadangan loop */
 let cur="home",want=true,started=false,held=false;
 try{want=localStorage.getItem("musik")!=="off"}catch(e){}
 const btn=document.createElement("button");
 btn.className="btn";btn.type="button";
 btn.style.cssText="position:fixed;right:10px;bottom:10px;z-index:9;padding:8px 14px;font-size:16px;cursor:pointer;padding:6px 12px;font-size:clamp(11px,2vmin,14px);border-radius:999px";
 function ui(){btn.textContent=(want?"🔊":"🔇")+(true?" Musik: "+(want?"ON":"OFF"):"");btn.setAttribute("aria-pressed",want);btn.setAttribute("aria-label","Musik "+(want?"menyala":"mati"));btn.title="Klik untuk menyalakan/mematikan musik"}
 function play(){if(!want||held)return;const p=A[cur].play();if(p&&p.then)p.then(()=>{started=true;unbind()}).catch(()=>{})}
 const ev=["pointerdown","keydown","touchstart"];
 function unbind(){ev.forEach(e=>document.removeEventListener(e,play,true))}
 ev.forEach(e=>document.addEventListener(e,play,true));
 function stop(){for(const k in A)A[k].pause()}
 document.addEventListener("visibilitychange",()=>{document.hidden?stop():(started&&play())});
 btn.onclick=e=>{e.stopPropagation();want=!want;try{localStorage.setItem("musik",want?"on":"off")}catch(_){}
  if(want){play()}else{stop()}ui()};
 ui();document.body.appendChild(btn);play();
 return{play,
  /* track("home"|"quiz"): ganti lagu */
  track(t){if(t===cur||!A[t])return;A[cur].pause();cur=t;A[t].currentTime=0;play()},
  /* hold(true): jeda sementara (mis. saat video YouTube diputar), hold(false): lanjut */
  hold(h){held=h;h?stop():play()},toggle:()=>btn.click()}
})();

const _s=start;start=function(a,b){_s(a,b);Music.track('quiz')};
const _i=intro;intro=function(){_i();Music.track('home')};

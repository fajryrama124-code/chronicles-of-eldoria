const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
ctx.imageSmoothingEnabled=false;
const W=2400,H=1800;
let view={x:0,y:0};
const player={x:1200,y:900,w:28,h:36,speed:3.1,hp:100,maxHp:100,xp:0,level:1,gold:25,dir:1,attack:0,inv:0};
const keys={}; let moveX=0,moveY=0,joyOn=false;
const enemies=[
 {x:1050,y:760,type:"slime",hp:30,max:30,spd:.75,alive:true,cd:0},
 {x:1390,y:820,type:"goblin",hp:45,max:45,spd:.9,alive:true,cd:0},
 {x:1320,y:1050,type:"wolf",hp:38,max:38,spd:1.15,alive:true,cd:0},
 {x:980,y:1060,type:"mushroom",hp:25,max:25,spd:.55,alive:true,cd:0},
 {x:1540,y:1030,type:"bat",hp:28,max:28,spd:1.25,alive:true,cd:0}
];
const npcs=[
 {x:1160,y:760,name:"Elder Mira",icon:"🧙"},
 {x:1260,y:760,name:"Blacksmith",icon:"⚒️"},
 {x:1350,y:940,name:"Merchant",icon:"🧑"}
];
const trees=[]; const rocks=[]; const houses=[];
function seedWorld(){
 for(let i=0;i<85;i++){let x=80+Math.random()*(W-160),y=80+Math.random()*(H-160);
   if(Math.hypot(x-1200,y-900)<310)continue; trees.push({x,y,s:22+Math.random()*18});
 }
 for(let i=0;i<28;i++) rocks.push({x:60+Math.random()*(W-120),y:60+Math.random()*(H-120),s:10+Math.random()*10});
 houses.push({x:1080,y:690,w:130,h:90},{x:1270,y:690,w:130,h:90},{x:1430,y:700,w:150,h:105},{x:1080,y:1080,w:150,h:95});
}
seedWorld();

function resize(){canvas.width=innerWidth;canvas.height=innerHeight} resize(); addEventListener("resize",resize);
addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

function setMove(x,y){moveX=x;moveY=y;if(Math.abs(x)>.1)player.dir=x>0?1:-1}
const joy=document.getElementById("joystick"),stick=document.getElementById("stick");
function joyMove(x,y){const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy),m=38;if(d>m){dx=dx/d*m;dy=dy/d*m}stick.style.transform=`translate(${dx}px,${dy}px)`;setMove(dx/m,dy/m)}
joy.addEventListener("pointerdown",e=>{e.preventDefault();joyOn=true;joy.setPointerCapture(e.pointerId);joyMove(e.clientX,e.clientY)});
joy.addEventListener("pointermove",e=>{if(joyOn){e.preventDefault();joyMove(e.clientX,e.clientY)}});
["pointerup","pointercancel"].forEach(t=>joy.addEventListener(t,()=>{joyOn=false;setMove(0,0);stick.style.transform="translate(0,0)"}));

document.getElementById("attack").addEventListener("pointerdown",e=>{e.preventDefault();doAttack()});
document.getElementById("interact").addEventListener("pointerdown",e=>{e.preventDefault();interact()});
document.querySelectorAll(".member").forEach((b,i)=>b.addEventListener("click",()=>{document.querySelectorAll(".member").forEach(x=>x.classList.remove("active"));b.classList.add("active");toast(["Warrior","Archer","Mage","Knight","Rogue"][i]+" dipilih")}));
document.getElementById("menuBtn").onclick=()=>document.getElementById("menuPanel").classList.toggle("open");
document.getElementById("closeMenu").onclick=()=>document.getElementById("menuPanel").classList.remove("open");

function toast(t){const el=document.getElementById("toast");el.textContent=t;el.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>el.style.opacity=0,1500)}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function doAttack(){
 if(player.attack>0)return; player.attack=22;
 let hit=false;
 enemies.forEach(e=>{if(e.alive&&dist(player,e)<78){e.hp-=18;hit=true;if(e.hp<=0){e.alive=false;player.xp+=25;player.gold+=5;toast("Monster dikalahkan! +25 EXP +5 G")}}});
 if(!hit) toast("⚔️ Tebasan mengenai udara");
}
function interact(){
 let n=npcs.find(n=>Math.hypot(n.x-player.x,n.y-player.y)<85);
 if(n) toast(n.name+": Selamat datang di Eldoria!");
 else toast("Tidak ada yang bisa diajak bicara di sini.");
}
function update(){
 let kx=(keys["d"]||keys["arrowright"]?1:0)-(keys["a"]||keys["arrowleft"]?1:0);
 let ky=(keys["s"]||keys["arrowdown"]?1:0)-(keys["w"]||keys["arrowup"]?1:0);
 let x=moveX||kx,y=moveY||ky,l=Math.hypot(x,y);if(l>1){x/=l;y/=l}
 player.x=Math.max(30,Math.min(W-30,player.x+x*player.speed));
 player.y=Math.max(30,Math.min(H-30,player.y+y*player.speed));
 if(player.attack>0)player.attack--; if(player.inv>0)player.inv--;
 enemies.forEach(e=>{if(!e.alive)return;let d=dist(player,e);if(d<300&&d>42){e.x+=(player.x-e.x)/d*e.spd;e.y+=(player.y-e.y)/d*e.spd}if(d<48&&e.cd<=0&&player.inv<=0){player.hp-=6;player.inv=25;e.cd=55;if(player.hp<=0){player.hp=player.maxHp;player.x=1200;player.y=900;toast("Kamu tumbang! Kembali ke desa.")}}if(e.cd>0)e.cd--});
 if(player.xp>=100){player.xp-=100;player.level++;player.maxHp+=15;player.hp=player.maxHp;toast("LEVEL UP! Kamu mencapai level "+player.level)}
 view.x=Math.max(0,Math.min(W-innerWidth,player.x-innerWidth/2));
 view.y=Math.max(0,Math.min(H-innerHeight,player.y-innerHeight/2));
}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.floor(x-view.x),Math.floor(y-view.y),w,h)}
function draw(){
 ctx.fillStyle="#6b954d";ctx.fillRect(0,0,canvas.width,canvas.height);
 // tile pattern
 for(let y=Math.floor(view.y/32)*32;y<view.y+innerHeight+32;y+=32)for(let x=Math.floor(view.x/32)*32;x<view.x+innerWidth+32;x+=32){
   ctx.fillStyle=((x/32+y/32)%2===0)?"#6f9a50":"#6a934b";ctx.fillRect(x-view.x,y-view.y,32,32);
 }
 // river
 ctx.fillStyle="#4f8fb1";ctx.fillRect(720-view.x,0,150, H);
 for(let y=0;y<H;y+=24){ctx.fillStyle="#75b1c8";ctx.fillRect(740-view.x,y-view.y,65,2)}
 // plaza
 ctx.fillStyle="#b99b68";ctx.fillRect(1040-view.x,630-view.y,520,520);
 ctx.fillStyle="#cdb47f";ctx.fillRect(1150-view.x,750-view.y,300,300);
 // roads
 ctx.fillStyle="#b99b68";ctx.fillRect(0,860-view.y,W,80);
 ctx.fillRect(1160-view.x,0,80, H);
 // houses
 houses.forEach(h=>{rect(h.x,h.y,h.w,h.h,"#8c5c3c");ctx.fillStyle="#5a3427";ctx.beginPath();ctx.moveTo(h.x-view.x-10,h.y-view.y);ctx.lineTo(h.x+h.w/2-view.x,h.y-55-view.y);ctx.lineTo(h.x+h.w+10-view.x,h.y-view.y);ctx.fill();rect(h.x+h.w/2-12,h.y+h.h-35,24,35,"#3a2a20")});
 // trees
 trees.forEach(t=>{ctx.fillStyle="#3d6d35";ctx.beginPath();ctx.arc(t.x-view.x,t.y-view.y,t.s,0,Math.PI*2);ctx.fill();ctx.fillStyle="#6f4b2b";ctx.fillRect(t.x-view.x-4,t.y-view.y+8,8,20)});
 rocks.forEach(r=>rect(r.x-5,r.y-4,10,8,"#77766c"));
 // NPCs
 npcs.forEach(n=>{ctx.font="20px serif";ctx.textAlign="center";ctx.fillText(n.icon,n.x-view.x,n.y-view.y);ctx.font="10px Arial";ctx.fillStyle="#fff";ctx.fillText(n.name,n.x-view.x,n.y-view.y-22)});
 // enemies
 enemies.forEach(e=>{if(!e.alive)return;let c={slime:"#61c96b",goblin:"#9b6b46",wolf:"#8a8f99",mushroom:"#d46b58",bat:"#6d5c9b"}[e.type];ctx.fillStyle=c;ctx.beginPath();ctx.arc(e.x-view.x,e.y-view.y,17,0,Math.PI*2);ctx.fill();ctx.fillStyle="#222";ctx.fillRect(e.x-view.x-10,e.y-view.y-24,20,3);ctx.fillStyle="#e24c4c";ctx.fillRect(e.x-view.x-10,e.y-view.y-24,20*(e.hp/e.max),3)});
 // player pixel-ish
 ctx.save();ctx.translate(player.x-view.x,player.y-view.y);if(player.dir<0)ctx.scale(-1,1);
 ctx.fillStyle="#3b2b55";ctx.fillRect(-13,-5,26,23);ctx.fillStyle="#d8a77d";ctx.fillRect(-10,-22,20,18);ctx.fillStyle="#5d3b25";ctx.fillRect(-13,-25,26,7);ctx.fillStyle="#d8c36a";ctx.fillRect(10,-1,18,4);
 if(player.attack>0){ctx.strokeStyle="#f7e18a";ctx.lineWidth=5;ctx.beginPath();ctx.arc(5,0,42,-.9,.7);ctx.stroke()}ctx.restore();
 // day/night overlay
 const cycle=(Date.now()/1000)%120; const darkness=Math.max(0,(Math.sin(cycle/120*Math.PI*2)+.2)*.25);
 ctx.fillStyle=`rgba(20,30,70,${darkness})`;ctx.fillRect(0,0,canvas.width,canvas.height);
 updateHUD();
}
function updateHUD(){
 document.getElementById("hpFill").style.width=(player.hp/player.maxHp*100)+"%";
 document.getElementById("xpFill").style.width=(player.xp/100*100)+"%";
 document.getElementById("level").textContent=player.level;document.getElementById("gold").textContent=player.gold;
 document.getElementById("zone").textContent=player.x<850?"WHISPERING WOODS":player.x>1550?"ELDORIA OUTSKIRTS":"ELDORIA VILLAGE";
}
function loop(){update();draw();requestAnimationFrame(loop)} loop();

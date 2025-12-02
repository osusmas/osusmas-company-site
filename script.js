// Dynamic cover 51 with extension fallback
(function pickCover(){
  const el = document.getElementById('openGallery');
  const tries = ["images/51.jpg","images/51.JPG","images/51.jpeg","images/51.JPEG","images/51.png","images/51.webp"];
  (async function run(i=0){
    if(i>=tries.length){ return; }
    const t = tries[i];
    const img = new Image();
    img.onload = ()=> { if(!el.src || el.src.endsWith('/51.jpg')) el.src = t; };
    img.onerror = ()=> run(i+1);
    img.src = t;
  })();
})();

// Build gallery list from image names (1..200 + a few specials), test existence first
const base = "images/";
const numbers = Array.from({length: 200}, (_,i)=> (i+1).toString());
const specials = ["5 (2)"];
const exts = ["jpg","JPG","jpeg","JPEG","png","webp"];

function testImage(src){return new Promise(res=>{const i=new Image();i.onload=()=>res(src);i.onerror=()=>res(null);i.src=src;});}

const candidates = ["51", ...numbers.filter(n=> n!=='51'), ...specials];

async function buildGallery(){
  const found = [];
  for(const name of candidates){
    let chosen = null;
    for(const ext of exts){
      const ok = await testImage(`${base}${name}.${ext}`);
      if(ok){ chosen = ok; break; }
    }
    if(chosen) found.push(chosen);
  }
  return found;
}

// Lightbox logic
let gallery = [];
let idx = 0;
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');

function openAt(i){ idx = i; lbImg.src = gallery[idx]; lb.style.display='block'; }
function closeLb(){ lb.style.display='none'; }
function next(){ idx=(idx+1)%gallery.length; lbImg.src = gallery[idx]; }
function prev(){ idx=(idx-1+gallery.length)%gallery.length; lbImg.src = gallery[idx]; }

(async function init(){
  gallery = await buildGallery();
  document.getElementById('openGallery').addEventListener('click', ()=> openAt(0));
  document.querySelector('#lightbox .close').addEventListener('click', closeLb);
  document.querySelector('#lightbox .next').addEventListener('click', next);
  document.querySelector('#lightbox .prev').addEventListener('click', prev);
  window.addEventListener('keydown', (e)=>{
    if(lb.style.display==='block'){
      if(e.key==='Escape') closeLb();
      if(e.key==='ArrowRight') next();
      if(e.key==='ArrowLeft')  prev();
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();

// script.js — คอนฟิกง่าย ๆ: แก้ comicsData ให้ตรงกับโฟลเดอร์รูปของคุณ
const comicsData = [
  // ตัวอย่าง: slug เป็นชื่อโฟลเดอร์ใน /comics/{slug}/
  { id: 'my-manga', title: 'ตัวอย่าง: My Manga', pages: 12, chapters: [{name: 'ตอน 1', start:1, pages:12}] },
  { id: 'sample-comic', title: 'Sample Comic', pages: 8, chapters: [{name:'ตอนเดียว', start:1, pages:8}] }
];

const comicListEl = document.getElementById('comicList');
const chapterSelect = document.getElementById('chapterSelect');
const metaText = document.getElementById('metaText');
const comicImage = document.getElementById('comicImage');
const loadingEl = document.getElementById('loading');
const pageInfo = document.getElementById('pageInfo');

let current = { comic: null, chapter: null, page: 1 };

// สร้างรายการการ์ตูนใน sidebar
function renderComicList(){
  comicListEl.innerHTML = '';
  comicsData.forEach(c=>{
    const li = document.createElement('li');
    li.textContent = c.title;
    li.dataset.id = c.id;
    li.addEventListener('click', ()=> selectComic(c.id));
    comicListEl.appendChild(li);
  });
}
renderComicList();

function findComicById(id){ return comicsData.find(c=>c.id===id); }

function selectComic(id){
  const c = findComicById(id);
  if(!c) return;
  current.comic = c;
  current.chapter = c.chapters?.[0] ?? null;
  current.page = current.chapter?.start ?? 1;
  // update UI
  Array.from(comicListEl.children).forEach(li => li.classList.toggle('active', li.dataset.id === id));
  populateChapters();
  updateMeta();
  loadPage();
}

function populateChapters(){
  chapterSelect.innerHTML = '';
  (current.comic.chapters || [{name:'Default',start:1,pages: current.comic.pages}]).forEach((ch, idx)=>{
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = ch.name + (ch.pages ? ` (${ch.pages} หน้า)` : '');
    chapterSelect.appendChild(opt);
  });
  chapterSelect.onchange = () => {
    const ch = current.comic.chapters[chapterSelect.value];
    current.chapter = ch;
    current.page = ch.start;
    loadPage();
  };
}

// สร้าง path รูป — ถ้ารูปของคุณมีนามสกุลอื่น ให้แก้ที่นี่
function imagePath(comicId, page){
  return `comics/${comicId}/${page}.jpg`;
}

function setLoading(state){
  loadingEl.hidden = !state;
}

function updateMeta(){
  if(!current.comic){ metaText.textContent = 'เลือกการ์ตูนด้านซ้ายเพื่อเริ่มอ่าน'; return; }
  const total = current.chapter?.pages ?? current.comic.pages;
  metaText.textContent = `${current.comic.title} — ${current.chapter?.name ?? 'ตอน'} | หน้า ${current.page} / ${total}`;
  pageInfo.textContent = `${current.page} / ${total}`;
}

// โหลดหน้าและจัดการ lazy / error
function loadPage(){
  if(!current.comic) return;
  const p = current.page;
  const total = current.chapter?.pages ?? current.comic.pages;
  updateMeta();
  setLoading(true);
  const src = imagePath(current.comic.id, p);
  const img = new Image();
  img.src = src;
  img.onload = ()=> {
    comicImage.src = src;
    comicImage.alt = `${current.comic.title} — หน้า ${p}`;
    setLoading(false);
    // prefetch next
    if(p < total){
      const pre = new Image(); pre.src = imagePath(current.comic.id, p+1);
    }
  };
  img.onerror = ()=> {
    setLoading(false);
    comicImage.src = '';
    comicImage.alt = 'ไม่พบภาพ: ' + src;
    metaText.textContent = `ไม่พบภาพหน้า ${p} — ตรวจสอบโครงสร้างไฟล์หรือแก้ comicsData`;
  };
}

function goToPage(n){
  const total = current.chapter?.pages ?? current.comic.pages;
  if(!current.comic) return;
  if(n < 1) n = 1;
  if(n > total) n = total;
  current.page = n;
  loadPage();
}

function changePage(delta){ goToPage(current.page + delta); }

// ปุ่ม UI
document.getElementById('prevBtn').addEventListener('click', ()=> changePage(-1));
document.getElementById('nextBtn').addEventListener('click', ()=> changePage(1));
document.getElementById('prevPageBtn').addEventListener('click', ()=> changePage(-1));
document.getElementById('nextPageBtn').addEventListener('click', ()=> changePage(1));
document.getElementById('firstBtn').addEventListener('click', ()=> goToPage(1));
document.getElementById('lastBtn').addEventListener('click', ()=> {
  const total = current.chapter?.pages ?? current.comic.pages;
  goToPage(total);
});
document.getElementById('fitBtn').addEventListener('click', ()=> {
  comicImage.style.maxWidth = comicImage.style.maxWidth ? '' : '100%';
});
document.getElementById('fullBtn').addEventListener('click', ()=> {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
  else document.exitFullscreen();
});

// keyboard support
window.addEventListener('keydown',(e)=>{
  if(e.key === 'ArrowLeft') changePage(-1);
  if(e.key === 'ArrowRight') changePage(1);
  if(e.key === 'Home') goToPage(1);
  if(e.key === 'End') {
    const total = current.chapter?.pages ?? current.comic.pages;
    goToPage(total);
  }
});

// touch swipe (simple)
let touchStartX = 0;
const imgWrap = document.getElementById('imgWrap');
imgWrap.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
});
imgWrap.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if(Math.abs(dx) > 40){
    if(dx < 0) changePage(1); else changePage(-1);
  }
});

// initial select first comic if any
if(comicsData.length) selectComic(comicsData[0].id);

<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>อ่านการ์ตูน — ToonHeem</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="topbar">
    <a class="brand" href="index.html">MyComicReader</a>
    <nav>
      <a href="about.html">เกี่ยวกับ</a>
    </nav>
  </header>

  <main class="container">
    <aside class="sidebar" id="sidebar">
      <h2>รายการการ์ตูน</h2>
      <ul id="comicList" class="comic-list"></ul>
    </aside>

    <section class="viewer">
      <div class="controls top-controls">
        <select id="chapterSelect"></select>
        <div class="meta" id="metaText">เลือกการ์ตูนด้านซ้ายเพื่อเริ่มอ่าน</div>
      </div>

      <div id="imgWrap" class="img-wrap">
        <button id="prevBtn" class="nav-btn prev" aria-label="ก่อนหน้า">‹</button>
        <div class="img-container" id="imgContainer">
          <img id="comicImage" src="" alt="หน้า" draggable="false" />
          <div id="loading" class="loading" hidden>กำลังโหลด...</div>
        </div>
        <button id="nextBtn" class="nav-btn next" aria-label="ถัดไป">›</button>
      </div>

      <div class="controls bottom-controls">
        <button id="fitBtn" class="small">Fit</button>
        <button id="fullBtn" class="small">เต็มจอ</button>
        <div class="pager">
          <button id="firstBtn" class="small">⏮</button>
          <button id="prevPageBtn" class="small">◀</button>
          <span id="pageInfo">— / —</span>
          <button id="nextPageBtn" class="small">▶</button>
          <button id="lastBtn" class="small">⏭</button>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <small>MyComicReader — อ่านการ์ตูนแบบง่าย | เก็บรูปไว้ที่ /comics/</small>
  </footer>

  <script src="script.js"></script>
</body>
</html>

let coverImg, pageImg, gameImg, radarImg, colorImg, seaImg, bgImg, w2Img; 
let page = 0; 
let totalPages = 3; 
let flipAnim = 1; 
let flashAlpha = 0; 
let particles = []; 

// 選單項目：精確導向每一頁
let menuItems = ["封面導覽", "W1 水中", "W2 水草", "W3 彩色", "W4 雷達", "W5 急急棒", "W6 結語"];
let menuY = [];

function preload() {
  coverImg = loadImage('book.jpg');
  pageImg = loadImage('book2.jpg');
  bgImg = loadImage('背景.jpg'); 
  w2Img = loadImage('w2.png'); 
  seaImg = loadImage('水草.png');
  colorImg = loadImage('彩色.png');
  radarImg = loadImage('雷達.png');
  gameImg = loadImage('急急棒.gif'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  updateMenuPositions();

  for (let i = 0; i < 50; i++) {
    particles.push({x: random(width), y: random(height), size: random(2, 4), speed: random(0.2, 0.4)});
  }
}

function updateMenuPositions() {
  menuY = [];
  // 調整起始高度，讓內容往上提
  let startY = height/2 - 130; 
  for(let i=0; i<menuItems.length; i++) {
    menuY.push(startY + i * 42);
  }
}

function draw() {
  push();
  imageMode(CORNER);
  image(bgImg, 0, 0, width, height);
  pop();
  
  drawParticles();
  drawSidebar(); // 繪製深灰色選單

  flipAnim = lerp(flipAnim, 1, 0.15);

  push();
  translate(width / 2, height / 2);
  let s = map(flipAnim, 0, 1, 0.9, 1);
  scale(s);

  if (page === 0) drawCoverPage();
  else drawInnerContent(page);
  pop();

  drawUI();

  if (flashAlpha > 0) {
    fill(255, 255, 255, flashAlpha);
    noStroke();
    rect(0, 0, width, height);
    flashAlpha -= 15;
  }
}

function drawSidebar() {
  push();
  // --- 修改重點：深灰色底色 (40, 40, 40) ---
  fill(40, 40, 40, 220); 
  noStroke();
  rect(15, height/2 - 190, 160, 360, 12);
  
  // 目錄索引標題 - 稍微拉高
  fill(255);
  textSize(17);
  textStyle(BOLD);
  textAlign(LEFT);
  text("目錄索引", 35, height/2 - 165);
  
  // 裝飾線
  stroke(100);
  strokeWeight(1);
  line(35, height/2 - 150, 145, height/2 - 150);
  
  noStroke();
  textSize(14);
  textStyle(NORMAL);
  for(let i=0; i<menuItems.length; i++) {
    let isActive = false;
    if (i === 0 && page === 0) isActive = true;
    else if (i === 1 && page === 1) isActive = true; 
    else if (i === 2 && page === 1) isActive = true; 
    else if (i === 3 && page === 2) isActive = true; 
    else if (i === 4 && page === 2) isActive = true; 
    else if (i === 5 && page === 3) isActive = true; 
    else if (i === 6 && page === 3) isActive = true; 
    
    // 滑鼠 Hover 效果偵測
    let isHover = (mouseX > 15 && mouseX < 175 && mouseY > menuY[i]-15 && mouseY < menuY[i]+15);
    
    if (isActive) {
      fill(255, 200, 0); // 活動中顯示金色
    } else if (isHover) {
      fill(180, 220, 255); // 滑鼠懸停顯示淺藍
      cursor(HAND);
    } else {
      fill(210); // 平時顯示淺灰
    }
    
    text(menuItems[i], 45, menuY[i]);
    
    // 若為選中狀態，前方加個小圓點
    if (isActive) {
      ellipse(35, menuY[i], 5, 5);
    }
  }
  pop();
}

function drawParticles() {
  fill(255, 120);
  noStroke();
  for (let p of particles) {
    ellipse(p.x, p.y, p.size);
    p.y -= p.speed; 
    if (p.y < 0) p.y = height;
  }
}

function drawCoverPage() {
  let h = height * 0.8;
  let w = h * (coverImg.width / coverImg.height);
  push();
  scale(flipAnim, 1);
  image(coverImg, 0, 0, w, h);
  fill(255, 230); 
  ellipse(20, 0, w * 0.8, 120); 
  fill(50);
  textSize(width * 0.025); 
  text("大一下作品集", 20, 0);
  drawTinyPageNum(0, h, "cover");
  pop();
}

function drawInnerContent(index) {
  let h = height * 0.9;
  let w = h * (pageImg.width / pageImg.height);
  push();
  scale(flipAnim, 1);
  image(pageImg, 0, 0, w, h);
  fill(0, 30);
  rect(-2, -h/2, 4, h); 
  
  let leftX = -w * 0.25;
  let rightX = w * 0.25;

  if (index === 1) {
    drawWork(leftX, h, w, "水中音樂會", w2Img, "https://22kzcc.github.io/-W2/", true);
    drawWork(rightX, h, w, "水草網頁", seaImg, "https://22kzcc.github.io/sea/", false);
  } else if (index === 2) {
    drawWork(leftX, h, w, "玩耍彩色", colorImg, "https://22kzcc.github.io/041403/", false);
    drawWork(rightX, h, w, "雷達找遊戲", radarImg, "https://22kzcc.github.io/040730118/", false);
  } else if (index === 3) {
    drawWork(leftX, h, w, "電流急急棒", gameImg, "https://22kzcc.github.io/4147301180407/", false);
    
    // P.6 結語
    push();
    translate(rightX, 0);
    fill(60);
    textSize(20);
    text("感謝觀賞", 0, -40);
    if (dist(mouseX, mouseY, width/2 + rightX, height/2) < 60) fill(100, 200, 255);
    else fill(80, 160, 220);
    rectMode(CENTER);
    rect(0, 40, 100, 40, 10);
    fill(255);
    textSize(14);
    text("回封面", 0, 40);
    pop();
  }
  
  drawTinyPageNum(leftX, h, index * 2 - 1);
  drawTinyPageNum(rightX, h, index * 2);
  pop();
}

function drawWork(px, h, w, title, img, url, isSmall) {
  noStroke();
  fill(60);
  textSize(width * 0.015);
  textStyle(BOLD);
  text(title, px, -h * 0.22);
  
  if (img) {
    let sizeFactor = isSmall ? 0.28 : 0.38;
    let maxW = w * sizeFactor; 
    let maxH = h * (sizeFactor + 0.05); 
    let scaleRatio = min(maxW / img.width, maxH / img.height);
    let imgW = img.width * scaleRatio;
    let imgH = img.height * scaleRatio;
    image(img, px, -20, imgW, imgH);
    fill(0, 102, 204);
    textStyle(NORMAL);
    textSize(14);
    text("GO PLAY ➔", px, imgH/2 + 20);
  }
}

function drawTinyPageNum(px, h, num) {
  fill(80);
  textSize(20); 
  let label = (num === "cover") ? "Cover" : "P. " + num;
  text(label, px, h/2 - 60); 
}

function drawUI() {
  cursor(ARROW); 
  fill(100);
  textSize(12);
  if (page > 0) text("PREV", 40, height - 40);
  if (page < totalPages) text("NEXT", width - 40, height - 40);
}

function mousePressed() {
  // 選單跳轉
  for(let i=0; i<menuItems.length; i++) {
    if (mouseX > 15 && mouseX < 175 && mouseY > menuY[i]-15 && mouseY < menuY[i]+15) {
      if (i === 0) page = 0;
      else if (i === 1 || i === 2) page = 1;
      else if (i === 3 || i === 4) page = 2;
      else if (i === 5 || i === 6) page = 3;
      flipAnim = 0;
      flashAlpha = 150;
      return; 
    }
  }

  if (page >= 1) {
    let h = height * 0.9;
    let w = h * (pageImg.width / pageImg.height);
    let leftX = width/2 - w*0.25;
    let rightX = width/2 + w*0.25;

    if (page === 1) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/-W2/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/sea/");
    }
    if (page === 2) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/041403/");
       if (dist(mouseX, mouseY, rightX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/040730118/");
    }
    if (page === 3) { 
       if (dist(mouseX, mouseY, leftX, height/2 + 80) < 100) window.open("https://22kzcc.github.io/4147301180407/");
       if (mouseX > rightX - 50 && mouseX < rightX + 50 && mouseY > height/2 + 20 && mouseY < height/2 + 60) {
         page = 0;
         flipAnim = 0;
         flashAlpha = 200;
         return;
       }
    }
  }

  let oldPage = page;
  if (mouseX > width * 0.6 && page < totalPages) page++;
  else if (mouseX < width * 0.4 && page > 0) page--;
  if (oldPage !== page) { flipAnim = 0; flashAlpha = 150; }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateMenuPositions();
}
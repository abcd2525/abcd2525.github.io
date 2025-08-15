// 日時表示
function updateDateTime() {
  const now = new Date();
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const w = days[now.getDay()];
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById("datetime").textContent = `${y}年${m}月${d}日(${w}) ${h}:${min}:${s}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// おみくじ機能
const omikujiList = ['Webアプリケーション開発2', 'デジタルツールの使い方', '心理学', '経済入門', 'データサイエンス概論', 'Pythonプログラミング'];
const colors = ['1セクション', '2セクション', '3セクション', '4セクション', '5セクション', '6セクション'];
let animationInterval;

function drawOmikuji() {
  const resultWrapper = document.getElementById('result-wrapper');
  const resultDisplay = document.getElementById('omikuji-result');
  const colorDisplay = document.getElementById('lucky-color');
  const initialMessage = document.getElementById('initial-message');
  const omikujiBtn = document.getElementById('omikuji-button');

  initialMessage.style.display = 'none';
  resultWrapper.style.display = 'flex';
  omikujiBtn.classList.add('drawing');

  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    resultDisplay.textContent = omikujiList[Math.floor(Math.random() * omikujiList.length)];
    colorDisplay.textContent = colors[Math.floor(Math.random() * colors.length)];
  }, 100);

  setTimeout(() => {
    clearInterval(animationInterval);
    const final = omikujiList[Math.floor(Math.random() * omikujiList.length)];
    const luckyColor = colors[Math.floor(Math.random() * colors.length)];
    resultDisplay.textContent = final;
    colorDisplay.textContent = luckyColor;
    omikujiBtn.classList.remove('drawing');
  }, 3000);
}

// カウントダウン表示
function updateCountdown() {
  const now = new Date();
  const report = new Date(2025, 7, 20);
  const exam = new Date(2025, 7, 26);
  const vacation = new Date(2025, 8, 6);
  const q3 = new Date(2025, 9, 6);

  const countdown = {
    'レポート締切': getCountdownText(now, report),
    '単位認定試験': getCountdownText(now, exam),
    '夏休み': getCountdownText(now, vacation),
    '3Q授業開始': getCountdownText(now, q3)
  };

  const countdownHtml = Object.entries(countdown).map(([label, text]) => `${label}まで: <span class="${text.includes('超過') ? 'overdue' : ''}">${text}</span>`).join(' / ');
  document.getElementById('countdowns').innerHTML = countdownHtml;
}

function getCountdownText(from, to) {
  const diff = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}日超過`;
  return `${diff}日`;
}

updateCountdown();

//気象庁から天気予報を取得
async function fetchWeather() {
  const url = 'https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json';
  const headlineUrl = 'https://www.jma.go.jp/bosai/forecast/data/overview_forecast/130000.json';
  try {
    const res = await fetch(url);
    const data = await res.json();
    const today = data[0].timeSeries[0].areas.find(a => a.area.name.includes("東京"));
    const weatherText = today.weathers[0].replace(/　/g, ' ');
    const headlineRes = await fetch(headlineUrl);
    const headlineData = await headlineRes.json();
    let headlineText = headlineData.text.replace(/\s+/g, "");
    if (headlineText.includes("【")) headlineText = headlineText.split('【')[0];
    if (headlineText.length > 200) headlineText = headlineText.slice(0, 180) + "…";
    document.getElementById('weather').textContent = weatherText;
    document.getElementById('headline').textContent = headlineText;
  } catch (e) {
    document.getElementById('weather').textContent = '気象庁からのデータ取得に失敗しました。インターネット接続を確認してください。';
  }
}
fetchWeather();
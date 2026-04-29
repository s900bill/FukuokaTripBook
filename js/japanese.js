/**
 * japanese.js – Japanese phrases tab logic with TTS
 */

const japanesePhrases = {
  greeting: [
    {
      text: "こんにちは",
      romaji: "Konnichiwa",
      cn: "你好",
      note: "白天見面時使用",
    },
    { text: "ありがとう", romaji: "Arigato", cn: "謝謝", note: "一般感謝" },
    {
      text: "すみません",
      romaji: "Sumimasen",
      cn: "不好意思/對不起",
      note: "搭話或道歉用",
    },
    { text: "はい", romaji: "Hai", cn: "是/好的", note: "" },
    { text: "いいえ", romaji: "Iie", cn: "不/不是", note: "" },
    {
      text: "台湾から来ました",
      romaji: "Taiwan kara kimashita",
      cn: "我是台灣人 / 我從台灣來的",
      note: "常被當成當地人或被問從哪裡來時可用",
    },
  ],
  shopping: [
    {
      text: "いくらですか？",
      romaji: "Ikura desu ka?",
      cn: "請問多少錢？",
      note: "",
    },
    {
      text: "これが欲しいです",
      romaji: "Kore ga hoshii desu",
      cn: "我想要這個",
      note: "",
    },
    {
      text: "このクーポンを使いたいです",
      romaji: "Kono kuupon o tsukaitai desu",
      cn: "我要用這個優惠券",
      note: "結帳時出示手機畫面",
    },
    {
      text: "お会計をお願いします",
      romaji: "Okaikei o onegaishimasu",
      cn: "不好意思，我要結帳",
      note: "拿著商品到櫃檯時",
    },
    {
      text: "免税できますか？",
      romaji: "Menzei dekimasu ka?",
      cn: "可以退稅嗎？",
      note: "",
    },
    {
      text: "クレジットカードは使えますか？",
      romaji: "Kurejitto kaado wa tsukaemasu ka?",
      cn: "可以用信用卡嗎？",
      note: "",
    },
    {
      text: "袋を一つください",
      romaji: "Fukuro o hitotsu kudasai",
      cn: "請給我一個袋子",
      note: "",
    },
    {
      text: "袋はいりません",
      romaji: "Fukuro wa irimasen",
      cn: "不需要袋子",
      note: "",
    },
  ],
  dining: [
    {
      text: "メニューをください",
      romaji: "Menyuu o kudasai",
      cn: "請給我菜單",
      note: "",
    },
    {
      text: "これをお願いします",
      romaji: "Kore o onegaishimasu",
      cn: "我要點這個",
      note: "",
    },
    {
      text: "お水をください",
      romaji: "Omizu o kudasai",
      cn: "請給我水",
      note: "",
    },
    {
      text: "ぬるま湯をください",
      romaji: "Nurumayu o kudasai",
      cn: "請給我溫水",
      note: "長輩吃藥或習慣喝溫水時可用",
    },
    {
      text: "牛肉が入っていますか？",
      romaji: "Gyuuniku ga haitte imasu ka?",
      cn: "裡面有牛肉嗎？",
      note: "有飲食禁忌時詢問",
    },
    {
      text: "味を薄くしてもらえますか？",
      romaji: "Aji o usuku shite moraemasu ka?",
      cn: "可以做淡一點嗎？不要太鹹",
      note: "長輩飲食清淡時",
    },
    {
      text: "お会計をお願いします",
      romaji: "Okaikei o onegaishimasu",
      cn: "麻煩結帳",
      note: "",
    },
    { text: "美味しいです", romaji: "Oishii desu", cn: "很好吃", note: "" },
  ],
  convenience_store: [
    {
      text: "温めてください",
      romaji: "Atatamete kudasai",
      cn: "請幫我加熱(微波)",
      note: "買便當時店員通常會問，直接說這句即可",
    },
    {
      text: "お箸をください",
      romaji: "Ohashi o kudasai",
      cn: "請給我筷子",
      note: "",
    },
    {
      text: "スプーンをください",
      romaji: "Supuun o kudasai",
      cn: "請給我湯匙",
      note: "買布丁或優格時",
    },
    {
      text: "フォークをください",
      romaji: "Fooku o kudasai",
      cn: "請給我叉子",
      note: "買義大利麵時",
    },
    {
      text: "大丈夫です",
      romaji: "Daijoubu desu",
      cn: "不用了 / 沒關係",
      note: "通用拒絕句 (當店員問要不要集點/要不要收據時)",
    },
  ],
  transport: [
    {
      text: "駅はどこですか？",
      romaji: "Eki wa doko desu ka?",
      cn: "請問車站在哪裡？",
      note: "",
    },
    {
      text: "トイレはどこですか？",
      romaji: "Toire wa doko desu ka?",
      cn: "請問廁所在哪裡？",
      note: "",
    },
    {
      text: "ここに行きたいです",
      romaji: "Koko ni ikitai desu",
      cn: "我想去這裡",
      note: "直接指著手機地圖或行程表問人",
    },
    {
      text: "タクシーを呼んでください",
      romaji: "Takushii o yonde kudasai",
      cn: "請幫我叫計程車",
      note: "飯店或餐廳櫃檯可用",
    },
    {
      text: "この電車は博多に行きますか？",
      romaji: "Kono densha wa Hakata ni ikimasu ka?",
      cn: "這班車去博多嗎？",
      note: "",
    },
    { text: "降ります", romaji: "Orimasu", cn: "我要下車", note: "" },
  ],
  hotel: [
    {
      text: "チェックインをお願いします",
      romaji: "Chekkuin o onegaishimasu",
      cn: "我要辦理入住",
      note: "",
    },
    {
      text: "チェックアウトをお願いします",
      romaji: "Chekkuauto o onegaishimasu",
      cn: "我要辦理退房",
      note: "",
    },
    {
      text: "荷物を預かってもらえますか？",
      romaji: "Nimotsu o azukatte moraemasu ka?",
      cn: "可以寄放行李嗎？",
      note: "",
    },
    {
      text: "Wi-Fiのパスワードは何ですか？",
      romaji: "Wi-Fi no pasuwaado wa nan desu ka?",
      cn: "Wi-Fi密碼是多少？",
      note: "",
    },
  ],
  emergency: [
    {
      text: "助けてください",
      romaji: "Tasukete kudasai",
      cn: "請救救我/幫幫我",
      note: "",
    },
    {
      text: "道に迷いました。助けてもらえますか？",
      romaji: "Michi ni mayoimashita. Tasukete moraemasu ka?",
      cn: "我迷路了，可以幫我嗎？",
      note: "",
    },
    {
      text: "警察を呼んでください",
      romaji: "Keisatsu o yonde kudasai",
      cn: "請叫警察",
      note: "",
    },
    {
      text: "救急車を呼んでください",
      romaji: "Kyuukyuusha o yonde kudasai",
      cn: "請叫救護車",
      note: "",
    },
    {
      text: "病院はどこですか？",
      romaji: "Byouin wa doko desu ka?",
      cn: "請問醫院在哪裡？",
      note: "",
    },
    {
      text: "パスポートをなくしました",
      romaji: "Pasupooto o nakushimashita",
      cn: "我弄丟了護照",
      note: "",
    },
  ],
};

const japaneseCategories = [
  { key: "greeting", label: "打招呼" },
  { key: "shopping", label: "購物" },
  { key: "dining", label: "餐飲" },
  { key: "convenience_store", label: "便利商店" },
  { key: "transport", label: "交通" },
  { key: "hotel", label: "住宿" },
  { key: "emergency", label: "緊急", isAlert: true },
];

function renderJapanese(category) {
  const list = document.getElementById("japanese-list");
  const catContainer = document.getElementById("japanese-categories");
  if (!list || !catContainer) return;

  if (catContainer.innerHTML.trim() === "") {
    catContainer.innerHTML = japaneseCategories
      .map((cat) => {
        const style = cat.isAlert ? "color: #dc2626;" : "";
        return `
        <button class="badge" data-key="${cat.key}" onclick="renderJapanese('${cat.key}')"
          style="padding: 8px 16px; font-size: 1em; background: #e2e8f0; border: none; cursor: pointer; flex-shrink: 0; ${style}">
          ${cat.label}
        </button>
      `;
      })
      .join("");
  }

  catContainer.querySelectorAll("button").forEach((btn) => {
    const key = btn.getAttribute("data-key");
    const isAlert =
      japaneseCategories.find((c) => c.key === key)?.isAlert || false;
    if (key === category) {
      btn.style.background = "var(--primary)";
      btn.style.color = "white";
    } else {
      btn.style.background = "#e2e8f0";
      btn.style.color = isAlert ? "#dc2626" : "var(--text-light)";
    }
  });

  const items = japanesePhrases[category] || [];
  list.innerHTML = items
    .map(
      (item) => `
    <div class="card" onclick="speak('${item.text}')" style="cursor:pointer; transition:transform 0.1s">
      <div style="display:flex; justify-content:space-between; align-items:flex-start">
        <div>
          <div style="font-size:1.2em; font-weight:bold; color:var(--text); margin-bottom:4px">${item.text}</div>
          <div style="font-size:0.9em; color:var(--primary); margin-bottom:4px">${item.romaji}</div>
          <div style="font-size:1em; color:var(--text-light)">${item.cn}</div>
        </div>
        <div style="font-size:1.5em">🔊</div>
      </div>
      ${item.note ? `<div style="margin-top:8px; font-size:0.8em; color:var(--text-light); border-top:1px solid #eee; padding-top:4px">${item.note}</div>` : ""}
    </div>
  `,
    )
    .join("");
}

function speak(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  } else {
    alert("您的瀏覽器不支援語音播放");
  }
}

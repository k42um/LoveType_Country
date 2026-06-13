// ===========================================================================
// 恋愛16タイプ診断 ─ データ定義
// ---------------------------------------------------------------------------
// 4つの軸で性格を測定し、16カ国のいずれかに分類する。
//   expr : 愛情表現  P=情熱 / G=穏やか
//   role : 関係の築き方 L=リード / S=寄り添い
//   view : 恋愛観    D=夢見るロマンチスト / R=現実主義
//   dist : 距離感    F=自由 / T=安定(密着)
// タイプコードは expr+role+view+dist の4文字 (例: "PLDF")。
//
// 質問は全30問を用意し、アクセスごとに各軸からランダムで5問ずつ(計20問)を
// 出題する。採点は「実際に出題された問題」だけを対象に行う。
// ===========================================================================

export type Axis = "expr" | "role" | "view" | "dist";

export interface Question {
  id: number;
  text: string;
  axis: Axis;
  /** +1: 「そう思う」が第1極(P/L/D/F)寄り / -1: 第2極(C/S/R/T)寄り */
  direction: 1 | -1;
}

export interface Choice {
  label: string;
  value: number; // 2, 1, 0, -1, -2
  emoji: string;
}

export const CHOICES: Choice[] = [
  { label: "とてもそう思う", value: 2, emoji: "💖" },
  { label: "少しそう思う", value: 1, emoji: "🙂" },
  { label: "どちらでもない", value: 0, emoji: "😐" },
  { label: "あまり思わない", value: -1, emoji: "🤔" },
  { label: "全く思わない", value: -2, emoji: "🙅" },
];

export const QUESTIONS: Question[] = [
  // --- 愛情表現 (expr) ---
  { id: 1, text: "好きな人には、自分から気持ちをストレートに伝えたい", axis: "expr", direction: 1 },
  { id: 2, text: "恋人にはこまめに連絡をとり、愛情を言葉で表現したい", axis: "expr", direction: 1 },
  { id: 3, text: "うれしい・好きという感情は、つい顔や態度に出てしまう", axis: "expr", direction: 1 },
  { id: 4, text: "気持ちは言葉より、落ち着いた態度でじんわり示すほうだ", axis: "expr", direction: -1 },
  { id: 5, text: "恋の始まりは、一目惚れや勢いで動くことが多い", axis: "expr", direction: 1 },

  // --- 関係の築き方 (role) ---
  { id: 6, text: "デートの計画は、自分が主導して決めたい", axis: "role", direction: 1 },
  { id: 7, text: "ふたりの関係では、自分が引っ張っていく側だと思う", axis: "role", direction: 1 },
  { id: 8, text: "相手に合わせるより、自分の希望をはっきり言うほうだ", axis: "role", direction: 1 },
  { id: 9, text: "相手の気持ちを優先して、そっと支えるほうが心地よい", axis: "role", direction: -1 },
  { id: 10, text: "大事なことは、相手に決めてもらうほうが安心する", axis: "role", direction: -1 },

  // --- 恋愛観 (view) ---
  { id: 11, text: "運命の相手はきっとどこかにいると信じている", axis: "view", direction: 1 },
  { id: 12, text: "映画やドラマのようなロマンチックな展開に憧れる", axis: "view", direction: 1 },
  { id: 13, text: "記念日やサプライズは、ふたりにとって大切な儀式だ", axis: "view", direction: 1 },
  { id: 14, text: "恋愛は雰囲気より、生活の安定や相性を冷静に見てしまう", axis: "view", direction: -1 },
  { id: 15, text: "「好き」という気持ちだけで関係は続かないと思う", axis: "view", direction: -1 },

  // --- 距離感 (dist) ---
  { id: 16, text: "恋人がいても、ひとりの時間や趣味は大切にしたい", axis: "dist", direction: 1 },
  { id: 17, text: "束縛されたり、行動を細かく聞かれるのは苦手だ", axis: "dist", direction: 1 },
  { id: 18, text: "いろんな人と出会って、恋そのものを楽しみたい", axis: "dist", direction: 1 },
  { id: 19, text: "できるだけ早く、ひとりの人と落ち着いた関係を築きたい", axis: "dist", direction: -1 },
  { id: 20, text: "連絡が取れないと不安で、いつも一緒にいたいと思う", axis: "dist", direction: -1 },

  // --- 予備プール (ここからランダム選抜) ---
  // 愛情表現 (expr)
  { id: 21, text: "好きな人の前でも、感情を表に出さず冷静でいられるほうだ", axis: "expr", direction: -1 },
  { id: 22, text: "気持ちは、ここぞという時に静かに伝えれば十分だと思う", axis: "expr", direction: -1 },
  { id: 23, text: "ハグやスキンシップで、愛情をたっぷり伝えたい", axis: "expr", direction: 1 },

  // 関係の築き方 (role)
  { id: 24, text: "行き先や予定は、自分から提案して決めることが多い", axis: "role", direction: 1 },
  { id: 25, text: "相手のペースに合わせて、ゆっくり進めるほうが好きだ", axis: "role", direction: -1 },
  { id: 26, text: "言いにくいことでも、自分からはっきり切り出せる", axis: "role", direction: 1 },

  // 恋愛観 (view)
  { id: 27, text: "ありきたりな日常より、特別でドラマチックな瞬間を増やしたい", axis: "view", direction: 1 },
  { id: 28, text: "結婚や同棲は、勢いより将来性や条件を見極めてから決めたい", axis: "view", direction: -1 },

  // 距離感 (dist)
  { id: 29, text: "友人や自分の予定を、恋人より優先したい時もある", axis: "dist", direction: 1 },
  { id: 30, text: "毎日でも会いたいし、できるだけ長く一緒に過ごしたい", axis: "dist", direction: -1 },
];

/** 1軸あたり出題する問題数 (4軸 × 5問 = 20問) */
export const PICK_PER_AXIS = 5;

export interface LoveType {
  code: string; // 例 "PLDF"
  country: string; // 日本語名
  englishName: string;
  flag: string; // 国旗絵文字
  title: string; // 二つ名
  tagline: string; // 1行キャッチ
  catchCopy: string; // シェア用の決め台詞
  summary: string; // 特徴の説明
  traits: string[]; // 性格チップ
  strengths: string[];
  weaknesses: string[];
  loveStyle: string;
  goodMatch: string[]; // 相性◎ (codeの配列)
  badMatch: string[]; // 相性△ (codeの配列)
  rarity: number; // 出現率(%) ※フレーバー
  gradient: { from: string; to: string };
}

// 軸ラベル(結果表示用)
export const AXIS_LABELS: Record<
  Axis,
  { name: string; pos: string; neg: string }
> = {
  expr: { name: "愛情表現", pos: "情熱的", neg: "穏やか" },
  role: { name: "関係の築き方", pos: "リード", neg: "寄り添い" },
  view: { name: "恋愛観", pos: "ロマンチスト", neg: "リアリスト" },
  dist: { name: "距離感", pos: "自由", neg: "安定" },
};

export const TYPES: Record<string, LoveType> = {
  PLDF: {
    code: "PLDF",
    country: "スペイン",
    englishName: "Spain",
    flag: "🇪🇸",
    title: "情熱の太陽",
    tagline: "好きになったら一直線。恋を生きる炎のタイプ",
    catchCopy: "恋に落ちたら、全力でアモーレ！",
    summary:
      "感情をまっすぐ表現し、好きな人を惜しみなく口説く情熱家。退屈が一番の敵で、サプライズや非日常で恋を燃え上がらせます。束縛は嫌いだけど、愛は誰よりも熱い。一緒にいると毎日がお祭りのような人。",
    traits: ["情熱的", "行動派", "ロマンチック", "自由人", "盛り上げ上手"],
    strengths: ["気持ちをまっすぐ伝えられる", "一緒にいて飽きさせない", "恋に全力でロマンチック"],
    weaknesses: ["熱しやすく冷めやすい", "嫉妬や感情の波が激しい", "束縛されると一気に冷める"],
    loveStyle: "情熱100%・直球勝負。ドラマチックな恋を求める。",
    goodMatch: ["GSDF", "PSDT"],
    badMatch: ["GLRT"],
    rarity: 7.2,
    gradient: { from: "#c60b1e", to: "#ffc400" },
  },
  PLDT: {
    code: "PLDT",
    country: "イタリア",
    englishName: "Italy",
    flag: "🇮🇹",
    title: "愛を歌う詩人",
    tagline: "甘い言葉と一途な愛。ロマンスの主役タイプ",
    catchCopy: "愛してる、を100回でも言える。",
    summary:
      "息をするように愛をささやくロマンチスト。情熱的にリードしながらも、根は家族思いで一途。記念日やデートを大切にし、相手を世界の中心のように扱います。愛され上手で、恋を芸術にする人。",
    traits: ["情熱的", "甘え上手", "一途", "家族思い", "ムードメーカー"],
    strengths: ["愛情表現がとびきり豊か", "ロマンチックな演出が得意", "一度愛したら深く尽くす"],
    weaknesses: ["感情的になりやすい", "嫉妬深い一面がある", "ドラマを求めすぎることも"],
    loveStyle: "情熱とロマンスで、深く長く愛し抜く。",
    goodMatch: ["GSDT", "PSDF"],
    badMatch: ["GLRF"],
    rarity: 6.5,
    gradient: { from: "#008c45", to: "#cd212a" },
  },
  PLRF: {
    code: "PLRF",
    country: "ブラジル",
    englishName: "Brazil",
    flag: "🇧🇷",
    title: "陽気なカーニバル",
    tagline: "ノリと勢いで距離を縮める、太陽みたいな存在",
    catchCopy: "とりあえず、踊って笑って恋しよう！",
    summary:
      "明るくフレンドリーで、誰とでもすぐ打ち解ける社交派。恋も「楽しいかどうか」が一番大事で、堅苦しい関係は苦手。現実的に物事を見つつ、ノリよく相手を引っ張っていきます。一緒にいると元気になれる人。",
    traits: ["陽気", "社交的", "フットワーク軽い", "現実派", "自由"],
    strengths: ["場を明るくする天才", "フットワークが軽い", "嫌なことを引きずらない"],
    weaknesses: ["飽きっぽく移り気", "重い空気が苦手で逃げがち", "本音を見せにくい"],
    loveStyle: "楽しさ最優先。ノリと笑いで恋を加速。",
    goodMatch: ["GSRF", "PSRF"],
    badMatch: ["GSDT"],
    rarity: 6.0,
    gradient: { from: "#009c3b", to: "#ffdf00" },
  },
  PLRT: {
    code: "PLRT",
    country: "アメリカ",
    englishName: "USA",
    flag: "🇺🇸",
    title: "自信家のヒーロー",
    tagline: "欲しい愛は自分で掴む。頼れるリーダータイプ",
    catchCopy: "好きなら、ちゃんと付き合おう。",
    summary:
      "自分の気持ちに正直で、欲しいものはストレートに取りにいく行動派。恋でもリーダーシップを発揮し、現実的に関係を前へ進めます。安定志向で、付き合うなら本気。頼りがいのある恋人になる人。",
    traits: ["自信家", "リーダー", "ストレート", "現実派", "面倒見がいい"],
    strengths: ["決断力と行動力がある", "関係をきちんと前に進める", "頼りがいがあって守ってくれる"],
    weaknesses: ["自分中心になりがち", "プライドが高い", "押しが強すぎることも"],
    loveStyle: "本気の関係を、自分主導でしっかり築く。",
    goodMatch: ["GSRT", "PSRT"],
    badMatch: ["GSDF"],
    rarity: 6.8,
    gradient: { from: "#3c3b6e", to: "#b22234" },
  },
  PSDF: {
    code: "PSDF",
    country: "ギリシャ",
    englishName: "Greece",
    flag: "🇬🇷",
    title: "神話のロマンチスト",
    tagline: "夢とロマンに包まれた、心優しい恋する人",
    catchCopy: "恋って、世界で一番きれいな物語。",
    summary:
      "ロマンチックで感受性が豊か、相手にそっと寄り添う癒し系。運命や巡り合わせを信じ、恋を美しい物語として味わいます。自由を愛しつつも情はとても深い。一緒にいると心がほどける人。",
    traits: ["ロマンチック", "癒し系", "感受性豊か", "穏やかな情熱", "自由"],
    strengths: ["相手を優しく包み込む", "感性が豊かで一緒にいて和む", "愛情深く尽くせる"],
    weaknesses: ["理想が高くなりがち", "傷つきやすく繊細", "現実から目をそらしがち"],
    loveStyle: "ロマンと優しさで、心の物語を紡ぐ。",
    goodMatch: ["GLDT", "PLDT"],
    badMatch: ["GLRT"],
    rarity: 5.4,
    gradient: { from: "#0d5eaf", to: "#4f9cf0" },
  },
  PSDT: {
    code: "PSDT",
    country: "韓国",
    englishName: "Korea",
    flag: "🇰🇷",
    title: "一途なドラマチスト",
    tagline: "ドラマみたいな深い愛。尽くす情熱家タイプ",
    catchCopy: "あなただけを、まっすぐ見てる。",
    summary:
      "愛情表現が豊かで、相手に深く尽くす一途タイプ。ロマンチックで密な関係を求め、毎日のやりとりや記念日を大切にします。情熱的だけど押しつけず、相手に寄り添う優しさも。愛されている実感をくれる人。",
    traits: ["一途", "情熱的", "尽くし型", "ロマンチック", "密着派"],
    strengths: ["愛情表現がまっすぐで深い", "相手をとことん大切にする", "記念日や思い出を大切に育てる"],
    weaknesses: ["重いと思われがち", "不安になると連絡が増える", "尽くしすぎて疲れることも"],
    loveStyle: "一途に、深く、毎日を一緒に積み重ねる。",
    goodMatch: ["PLDF", "GLDT"],
    badMatch: ["GLRF"],
    rarity: 5.8,
    gradient: { from: "#cd2e3a", to: "#0047a0" },
  },
  PSRF: {
    code: "PSRF",
    country: "メキシコ",
    englishName: "Mexico",
    flag: "🇲🇽",
    title: "太陽のムードメーカー",
    tagline: "明るく面倒見がよくて、みんなに愛される存在",
    catchCopy: "笑ってる時間が、一番の愛情表現。",
    summary:
      "あたたかくて面倒見がよく、人の輪の中心になる人気者。情熱的だけど相手をしっかり立てるサポート上手。現実的で、自由な空気を大切にします。一緒にいるとよく笑える、太陽のような恋人。",
    traits: ["あたたかい", "面倒見がいい", "陽気", "現実派", "自由"],
    strengths: ["相手を立てるのが上手", "明るくポジティブ", "人付き合いがうまい"],
    weaknesses: ["八方美人に見られがち", "自分を後回しにしがち", "ノリで流されることも"],
    loveStyle: "あたたかさと笑いで、心地よい関係をつくる。",
    goodMatch: ["GLRF", "PLRF"],
    badMatch: ["GSDT"],
    rarity: 5.1,
    gradient: { from: "#006847", to: "#ce1126" },
  },
  PSRT: {
    code: "PSRT",
    country: "インド",
    englishName: "India",
    flag: "🇮🇳",
    title: "情熱の献身家",
    tagline: "情に厚く家族思い。愛を一生ものにするタイプ",
    catchCopy: "愛は、人生をかけて育てるもの。",
    summary:
      "情に厚く、愛する人と深く長い関係を築こうとする献身家。情熱的でありながら相手を支え、現実をしっかり見据えて生活を一緒に作っていきます。家族や絆を何より大切にする、芯のあたたかい人。",
    traits: ["献身的", "情に厚い", "家族思い", "現実派", "安定志向"],
    strengths: ["愛を長く育てられる", "困った時に頼れる", "誠実で一途"],
    weaknesses: ["世話を焼きすぎる", "重く感じられることも", "古風な価値観が出やすい"],
    loveStyle: "献身と誠実さで、一生ものの愛を育てる。",
    goodMatch: ["PLRT", "GLRT"],
    badMatch: ["GLDF"],
    rarity: 4.7,
    gradient: { from: "#ff9933", to: "#138808" },
  },
  GLDF: {
    code: "GLDF",
    country: "アイルランド",
    englishName: "Ireland",
    flag: "🇮🇪",
    title: "夢見る吟遊詩人",
    tagline: "物語を紡ぐ、ミステリアスで自由な魅力",
    catchCopy: "恋は、ふたりだけの詩(うた)。",
    summary:
      "穏やかな佇まいの奥に、豊かな空想とロマンを秘めたタイプ。さりげなく場をリードし、独特の世界観で相手を惹きつけます。自由を愛し、束縛を嫌う一方、心を許した相手には深い愛情を。神秘的で飽きさせない人。",
    traits: ["ミステリアス", "空想家", "マイペース", "自由", "知的"],
    strengths: ["独自の世界観が魅力的", "聞き上手で落ち着く", "発想が豊かで楽しい"],
    weaknesses: ["本心が読みにくい", "気分屋なところがある", "距離を取りたがる"],
    loveStyle: "穏やかにリードしつつ、自由な物語を描く。",
    goodMatch: ["PSDT", "GSDF"],
    badMatch: ["PSRT"],
    rarity: 4.3,
    gradient: { from: "#169b62", to: "#ff883e" },
  },
  GLDT: {
    code: "GLDT",
    country: "イギリス",
    englishName: "UK",
    flag: "🇬🇧",
    title: "紳士なロマンチスト",
    tagline: "落ち着きと品格。さりげなく愛を貫くタイプ",
    catchCopy: "言葉少なに、でも一生そばに。",
    summary:
      "穏やかで品があり、控えめながら芯のあるロマンチスト。派手さはないけれど、さりげない気遣いと一途さで相手を大切にします。伝統や約束を重んじ、落ち着いた長い関係を望む人。安心して寄りかかれる存在。",
    traits: ["落ち着き", "紳士的", "一途", "誠実", "ロマンチック"],
    strengths: ["上品で気遣いができる", "約束を守り誠実", "落ち着いた安心感がある"],
    weaknesses: ["感情を表に出すのが苦手", "頑固な一面がある", "奥手で進展が遅い"],
    loveStyle: "控えめな気品で、長く誠実に愛を貫く。",
    goodMatch: ["PSDF", "PSDT"],
    badMatch: ["PLRF"],
    rarity: 5.9,
    gradient: { from: "#012169", to: "#c8102e" },
  },
  GLRF: {
    code: "GLRF",
    country: "オランダ",
    englishName: "Netherlands",
    flag: "🇳🇱",
    title: "自由な合理主義者",
    tagline: "正直でフラット。対等な関係を好むタイプ",
    catchCopy: "好きも嫌いも、ちゃんと話そう。",
    summary:
      "オープンで正直、何でも率直に話し合える合理派。恋愛でも対等でフラットな関係を好み、ムダな駆け引きはしません。自由を尊重し、互いの個を大切にします。さっぱりしていて一緒にいて気楽な人。",
    traits: ["率直", "合理的", "オープン", "自由", "フラット"],
    strengths: ["何でも話し合える", "干渉せず尊重できる", "サバサバして付き合いやすい"],
    weaknesses: ["ロマンに欠けると思われがち", "ドライに見える", "気持ちの機微に鈍いことも"],
    loveStyle: "率直な対話で、対等で自由な関係を築く。",
    goodMatch: ["PSRF", "GSRF"],
    badMatch: ["PLDT"],
    rarity: 5.5,
    gradient: { from: "#f36c21", to: "#21468b" },
  },
  GLRT: {
    code: "GLRT",
    country: "ドイツ",
    englishName: "Germany",
    flag: "🇩🇪",
    title: "誠実な戦略家",
    tagline: "計画的で堅実。約束を守り抜く信頼のタイプ",
    catchCopy: "言ったことは、必ず守る。",
    summary:
      "論理的で計画的、決めたことをきちんとやり遂げる堅実派。恋愛でも将来を見据えて関係を組み立て、約束を守り抜きます。感情表現は控えめでも、行動で愛を示すタイプ。誰よりも信頼できるパートナー。",
    traits: ["論理的", "計画的", "堅実", "誠実", "安定志向"],
    strengths: ["何より信頼できる", "将来をしっかり考える", "ブレない安定感"],
    weaknesses: ["融通が利かない", "ロマンや遊び心に欠ける", "感情表現が硬い"],
    loveStyle: "計画と誠実さで、揺るがない関係を築く。",
    goodMatch: ["PSRT", "GSRT"],
    badMatch: ["PLDF"],
    rarity: 6.1,
    gradient: { from: "#2b2b2b", to: "#dd0000" },
  },
  GSDF: {
    code: "GSDF",
    country: "フィンランド",
    englishName: "Finland",
    flag: "🇫🇮",
    title: "静かな夢想家",
    tagline: "そばにいるだけで安らぐ、控えめで純粋な人",
    catchCopy: "言葉はなくても、心は通じてる。",
    summary:
      "物静かで内省的、相手にそっと寄り添う癒し系の夢想家。多くを語らずとも、静かな時間や空気感を大切にします。自由とひとりの時間を愛しつつ、心を開いた相手には純粋な愛情を注ぐ人。一緒にいて落ち着く存在。",
    traits: ["物静か", "内省的", "ピュア", "マイペース", "自由"],
    strengths: ["穏やかで安心できる", "聞き上手で誠実", "ひとりの時間も尊重できる"],
    weaknesses: ["自分から動くのが苦手", "感情を伝えるのが下手", "心を開くのに時間がかかる"],
    loveStyle: "静かな空気感で、そっと心を寄せ合う。",
    goodMatch: ["PLDF", "GLDF"],
    badMatch: ["PLRT"],
    rarity: 4.0,
    gradient: { from: "#3b7dd8", to: "#002f6c" },
  },
  GSDT: {
    code: "GSDT",
    country: "日本",
    englishName: "Japan",
    flag: "🇯🇵",
    title: "一途な奥ゆかしさ",
    tagline: "察する優しさと、まっすぐ一途な愛のタイプ",
    catchCopy: "多くは語らず、ずっとそばに。",
    summary:
      "控えめで奥ゆかしく、相手を思いやる気持ちが人一倍強いタイプ。派手な表現は苦手でも、細やかな気遣いと一途さで深く愛します。安定した関係を望み、相手の幸せを自分のことのように喜ぶ人。日本人にもっとも多い癒し型。",
    traits: ["奥ゆかしい", "思いやり", "一途", "気配り上手", "安定志向"],
    strengths: ["細やかな気遣いができる", "一途で誠実", "相手を最優先に思いやる"],
    weaknesses: ["気持ちを溜め込みがち", "自己主張が苦手", "尽くしすぎて我慢してしまう"],
    loveStyle: "察する優しさで、静かに深く愛し続ける。",
    goodMatch: ["PLDT", "GLDT"],
    badMatch: ["PLRF"],
    rarity: 8.4,
    gradient: { from: "#bc002d", to: "#ff5a6e" },
  },
  GSRF: {
    code: "GSRF",
    country: "スウェーデン",
    englishName: "Sweden",
    flag: "🇸🇪",
    title: "自立したパートナー",
    tagline: "ほどよい距離感。互いを尊重し合えるタイプ",
    catchCopy: "依存しないから、長く続く。",
    summary:
      "自立していて、互いの自由と個を尊重する大人なタイプ。べたべたしすぎず、現実的にちょうどいい距離感を保ちます。穏やかで聞き上手、相手を縛らないからこそ信頼が育つ人。心地よい関係を作るのが得意。",
    traits: ["自立", "クール", "現実派", "穏やか", "自由"],
    strengths: ["ほどよい距離感が心地よい", "相手の自由を尊重する", "感情に振り回されない"],
    weaknesses: ["クールで素っ気なく見える", "甘えるのが苦手", "情熱不足と思われがち"],
    loveStyle: "自立と尊重で、対等に心地よく寄り添う。",
    goodMatch: ["PLRF", "GLRF"],
    badMatch: ["PSDT"],
    rarity: 5.2,
    gradient: { from: "#006aa7", to: "#fecc00" },
  },
  GSRT: {
    code: "GSRT",
    country: "カナダ",
    englishName: "Canada",
    flag: "🇨🇦",
    title: "優しい安定感",
    tagline: "穏やかで思いやり深い、安心のパートナー",
    catchCopy: "そっと支える、それが私の愛し方。",
    summary:
      "穏やかで思いやりがあり、相手を包み込むように支えるタイプ。現実的で堅実、衝突を避けて穏やかな関係を築きます。誰に対しても優しく、安定した愛情で安心感を与える人。一緒にいると心からくつろげる存在。",
    traits: ["穏やか", "思いやり", "堅実", "協調的", "安定志向"],
    strengths: ["包み込む優しさがある", "穏やかで衝突しない", "安定した安心感をくれる"],
    weaknesses: ["自己主張が弱い", "刺激や変化に乏しい", "我慢を抱え込みがち"],
    loveStyle: "穏やかな思いやりで、安心できる愛を育てる。",
    goodMatch: ["PLRT", "GLRT"],
    badMatch: ["PLDF"],
    rarity: 5.0,
    gradient: { from: "#d52b1e", to: "#ff7a6b" },
  },
};

// =====================  スコアリング  =====================

export type Answers = Record<number, number>; // questionId -> value

/** Fisher-Yates シャッフル(非破壊) */
function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * アクセスごとの出題セットを生成する。
 * 各軸からランダムに PICK_PER_AXIS 問ずつ選び(採点の偏りを防ぐ)、
 * さらに全体の出題順をシャッフルして返す。
 */
export function buildQuiz(): Question[] {
  const axes: Axis[] = ["expr", "role", "view", "dist"];
  const picked: Question[] = [];
  for (const axis of axes) {
    const pool = QUESTIONS.filter((q) => q.axis === axis);
    picked.push(...shuffle(pool).slice(0, PICK_PER_AXIS));
  }
  return shuffle(picked);
}

/** 出題された問題と回答からタイプコードを算出する */
export function calcType(answers: Answers, questions: Question[]): string {
  const score: Record<Axis, number> = { expr: 0, role: 0, view: 0, dist: 0 };
  for (const q of questions) {
    const v = answers[q.id] ?? 0;
    score[q.axis] += v * q.direction;
  }
  const code =
    (score.expr >= 0 ? "P" : "G") +
    (score.role >= 0 ? "L" : "S") +
    (score.view >= 0 ? "D" : "R") +
    (score.dist >= 0 ? "F" : "T");
  return code;
}

/** 各軸のスコアを0〜100%の「強さ」に変換(結果のメーター表示用) */
export function axisPercents(
  answers: Answers,
  questions: Question[],
): Record<Axis, number> {
  const raw: Record<Axis, number> = { expr: 0, role: 0, view: 0, dist: 0 };
  const max: Record<Axis, number> = { expr: 0, role: 0, view: 0, dist: 0 };
  for (const q of questions) {
    raw[q.axis] += (answers[q.id] ?? 0) * q.direction;
    max[q.axis] += 2;
  }
  const out = {} as Record<Axis, number>;
  (Object.keys(raw) as Axis[]).forEach((a) => {
    // -max..max を 0..100 に変換 (50が中立)。出題が無い軸は中立扱い。
    out[a] = max[a] === 0 ? 50 : Math.round(((raw[a] / max[a]) * 0.5 + 0.5) * 100);
  });
  return out;
}

export function getType(code: string): LoveType {
  return TYPES[code] ?? TYPES.GSDT;
}

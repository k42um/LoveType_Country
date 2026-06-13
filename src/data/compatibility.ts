// ===========================================================================
// 相性診断ロジック
// 自分のタイプ(code)とお相手のタイプ(code)から、相性スコアと講評を算出する。
// スコアは対称(A×B == B×A)になるよう設計。
// ===========================================================================

import { TYPES } from "./diagnosis";

export type Gender = "male" | "female" | "other";

export const GENDERS: { id: Gender; label: string; icon: string }[] = [
  { id: "female", label: "女性", icon: "♀" },
  { id: "male", label: "男性", icon: "♂" },
  { id: "other", label: "その他", icon: "⚧" },
];

export function partnerNoun(g: Gender): string {
  return g === "male" ? "彼" : g === "female" ? "彼女" : "お相手";
}

export interface Destination {
  name: string;
  flag: string;
  emoji: string;
  blurb: string;
  ll: [number, number]; // [緯度, 経度] フライトマップ用
}

// 二人で旅立つ「新しい目的地」候補(中立的なロマンス地)
export const DESTINATIONS: Destination[] = [
  { name: "パリ", flag: "🇫🇷", emoji: "🗼", blurb: "愛の都で過ごす、特別な夜を。", ll: [48, 2] },
  { name: "モルディブ", flag: "🇲🇻", emoji: "🏝️", blurb: "水上コテージで二人きりの楽園時間。", ll: [3, 73] },
  { name: "サントリーニ", flag: "🇬🇷", emoji: "🌅", blurb: "白い街と青い海、世界一の夕日を二人で。", ll: [36, 25] },
  { name: "ハワイ", flag: "🇺🇸", emoji: "🌺", blurb: "常夏のビーチでのんびりリフレッシュ。", ll: [21, -157] },
  { name: "スイスアルプス", flag: "🇨🇭", emoji: "🏔️", blurb: "雄大な山々に抱かれる静寂のリトリート。", ll: [46, 8] },
  { name: "バリ島", flag: "🇮🇩", emoji: "🌴", blurb: "リゾートヴィラで癒しのバカンスを。", ll: [-8, 115] },
  { name: "京都", flag: "🇯🇵", emoji: "⛩️", blurb: "四季と静けさに包まれる、和の旅。", ll: [35, 135] },
  { name: "ニューヨーク", flag: "🇺🇸", emoji: "🗽", blurb: "眠らない街で、刺激的なデートを。", ll: [40, -74] },
];

function hash(s: string): number {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

/** 二人の組合せから決まる(順不同で同じ)目的地 */
export function pickDestination(a: string, b: string): Destination {
  const key = [a, b].sort().join("-");
  return DESTINATIONS[hash(key) % DESTINATIONS.length];
}

export interface Tier {
  label: string;
  emoji: string;
  color: string;
  head: string;
}

function tierOf(score: number): Tier {
  if (score >= 88)
    return { label: "運命級", emoji: "💞", color: "#ff3d77", head: "運命としか言えない、奇跡の相性！" };
  if (score >= 75)
    return { label: "ベストカップル", emoji: "💖", color: "#ff6fae", head: "とても相性が良い、お似合いの二人！" };
  if (score >= 62)
    return { label: "Good", emoji: "💗", color: "#c084fc", head: "いい関係を築ける、good な相性。" };
  if (score >= 50)
    return { label: "伸びしろ", emoji: "💛", color: "#fbbf24", head: "歩み寄り次第で伸びる、伸びしろカップル。" };
  return { label: "試練", emoji: "⚡", color: "#94a3b8", head: "違いは多めの、ちょっぴり試練の恋。" };
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export interface CompatResult {
  score: number;
  tier: Tier;
  goodPoints: string[];
  watchOuts: string[];
  advice: string;
  destination: Destination;
}

/** 相性を算出する */
export function computeCompat(a: string, b: string): CompatResult {
  let score = 50;

  // expr(0) 情熱P/穏やかG, role(1) リードL/寄り添いS,
  // view(2) 夢見D/現実R, dist(3) 自由F/安定T
  score += a[1] !== b[1] ? 16 : -4; // 役割は補完(逆)が吉
  score += a[3] === b[3] ? 16 : -8; // 距離感は一致が吉
  score += a[0] === b[0] ? 8 : 4; // 愛情表現
  score += a[2] === b[2] ? 7 : 6; // 恋愛観

  const ta = TYPES[a];
  const tb = TYPES[b];
  if (ta.goodMatch.includes(b) || tb.goodMatch.includes(a)) score += 12;
  if (ta.badMatch.includes(b) || tb.badMatch.includes(a)) score -= 16;

  score = clamp(Math.round(score), 38, 99);

  const goodPoints: string[] = [];
  const watchOuts: string[] = [];

  // 愛情表現
  if (a[0] === b[0]) {
    goodPoints.push(
      a[0] === "P"
        ? "ともに情熱的で、愛情表現がにぎやか。気持ちがすれ違いにくい。"
        : "ともに穏やかで、静かな安心感に包まれた関係になれる。",
    );
  } else {
    goodPoints.push(
      "情熱的な側と穏やかな側。テンポは違っても、互いの足りないところを補い合える。",
    );
  }

  // 役割
  if (a[1] !== b[1]) {
    goodPoints.push(
      "「リード」と「寄り添い」のバランスが絶妙。自然に役割分担できる名コンビ。",
    );
  } else if (a[1] === "L") {
    watchOuts.push(
      "二人ともリードしたいタイプ。主導権でぶつからないよう、譲り合いを意識して。",
    );
  } else {
    watchOuts.push(
      "ともに尽くす優しい二人。たまにどちらかが決め役になると、関係が前に進みやすい。",
    );
  }

  // 恋愛観
  if (a[2] === b[2]) {
    goodPoints.push(
      a[2] === "D"
        ? "ロマンチスト同士、記念日やサプライズで思い出をどんどん増やせる。"
        : "現実的な価値観が一致。将来設計や生活リズムが合いやすい。",
    );
  } else {
    watchOuts.push(
      "夢を追う側と現実を見る側。価値観の温度差を話し合えれば、地に足のついた関係に。",
    );
  }

  // 距離感
  if (a[3] === b[3]) {
    goodPoints.push(
      a[3] === "F"
        ? "ほどよい距離感を好む者同士。束縛せず、心地よい関係を保てる。"
        : "いつも一緒にいたい二人。安心感のある、密であたたかい関係を築ける。",
    );
  } else {
    watchOuts.push(
      "距離感の理想が違うタイプ。会う頻度や連絡のペースは、早めにすり合わせて。",
    );
  }

  const tier = tierOf(score);
  const advice =
    score >= 75
      ? "このまま素直に気持ちを伝え合えば、関係はどんどん深まります。"
      : score >= 62
        ? "小さな「ありがとう」を口にする習慣が、二人の絆をぐっと強くします。"
        : score >= 50
          ? "違いは魅力。相手のペースを否定せず、面白がる余裕を持って。"
          : "違いが多いぶん、学べることも多い相手。丁寧な対話が何よりの近道です。";

  return {
    score,
    tier,
    goodPoints,
    watchOuts,
    advice,
    destination: pickDestination(a, b),
  };
}

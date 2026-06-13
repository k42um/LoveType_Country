import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TYPES, getType } from "../data/diagnosis";
import {
  GENDERS,
  computeCompat,
  partnerNoun,
  type Gender,
} from "../data/compatibility";
import { buildShareUrl, copyToClipboard } from "../lib/share";

// =====================  相性診断の入力画面  =====================

export function CompatSetup({
  selfCode,
  onSubmit,
  onBack,
}: {
  selfCode: string;
  onSubmit: (partnerCode: string, gender: Gender) => void;
  onBack: () => void;
}) {
  const me = getType(selfCode);
  const [partner, setPartner] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const ready = partner && gender;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-1 flex-col"
    >
      <button
        onClick={onBack}
        className="mb-3 self-start rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10"
      >
        ← 自分の結果に戻る
      </button>

      <h1 className="text-2xl font-black">💞 相性診断</h1>
      <p className="mt-1 text-sm text-white/70">
        あなたは <span className="font-bold text-white">{me.flag} {me.country}</span> タイプ。
        気になるお相手の<strong className="text-white">国と性別</strong>を選んでください。
      </p>

      {/* お相手の性別 */}
      <h2 className="mt-7 mb-2 text-sm font-bold text-white/80">お相手の性別</h2>
      <div className="grid grid-cols-3 gap-3">
        {GENDERS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGender(g.id)}
            className={`rounded-2xl border py-3 text-sm font-bold backdrop-blur transition-colors ${
              gender === g.id
                ? "border-pink-400 bg-pink-500/20"
                : "border-white/15 bg-white/5 hover:bg-white/10"
            }`}
          >
            <span className="mr-1 text-base">{g.icon}</span>
            {g.label}
          </button>
        ))}
      </div>

      {/* お相手の国 */}
      <h2 className="mt-6 mb-2 text-sm font-bold text-white/80">お相手の国(タイプ)</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
        {Object.values(TYPES).map((t) => (
          <button
            key={t.code}
            onClick={() => setPartner(t.code)}
            className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left backdrop-blur transition-colors ${
              partner === t.code
                ? "border-pink-400 bg-pink-500/20"
                : "border-white/15 bg-white/5 hover:bg-white/10"
            }`}
          >
            <span className="text-2xl">{t.flag}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{t.country}</span>
              <span className="block truncate text-[11px] text-white/55">{t.title}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="sticky bottom-3 mt-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!ready}
          onClick={() => ready && onSubmit(partner!, gender!)}
          className={`w-full rounded-2xl py-4 text-lg font-bold shadow-lg transition-opacity ${
            ready
              ? "bg-gradient-to-r from-pink-500 to-violet-500"
              : "cursor-not-allowed bg-white/10 text-white/40"
          }`}
        >
          {ready ? "相性をフライトで確かめる ✈️" : "国と性別を選んでね"}
        </motion.button>
      </div>
    </motion.section>
  );
}

// =====================  相性診断の結果画面  =====================

export function CompatResult({
  selfCode,
  partnerCode,
  gender,
  onAgain,
  onBack,
}: {
  selfCode: string;
  partnerCode: string;
  gender: Gender;
  onAgain: () => void;
  onBack: () => void;
}) {
  const me = getType(selfCode);
  const partner = getType(partnerCode);
  const r = computeCompat(selfCode, partnerCode);
  const noun = partnerNoun(gender);

  const url = buildShareUrl(selfCode);
  const text = `私(${me.flag}${me.country})と${noun}(${partner.flag}${partner.country})の恋愛相性は ${r.score}%！${r.tier.emoji}\n「${r.tier.label}」\n\nあなたも気になる人との相性を診断 #世界恋愛診断`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n${url}`)}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const c = await copyToClipboard(`${text}\n${url}`);
    if (c) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col"
    >
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] shadow-2xl backdrop-blur">
        {/* ヘッダー: 二人 */}
        <div
          className="px-6 py-7 text-center"
          style={{ background: `linear-gradient(135deg, ${r.tier.color}, #7c5cff)` }}
        >
          <div className="flex items-center justify-center gap-4 text-white">
            <Person flag={me.flag} label="あなた" sub={me.country} />
            <span className="text-3xl">💘</span>
            <Person flag={partner.flag} label={noun} sub={partner.country} />
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* スコアリング */}
          <div className="flex flex-col items-center">
            <ScoreRing score={r.score} color={r.tier.color} />
            <span
              className="mt-3 rounded-full px-4 py-1 text-sm font-black text-white"
              style={{ background: r.tier.color }}
            >
              {r.tier.emoji} 相性 {r.tier.label}
            </span>
            <p className="mt-3 text-center text-lg font-bold">{r.tier.head}</p>
          </div>

          {/* 二人で行くなら */}
          <div className="rounded-2xl bg-white/5 px-4 py-4 text-center">
            <p className="text-xs font-bold text-white/60">✈️ 二人で行くなら</p>
            <p className="mt-1 text-xl font-black">
              {r.destination.flag} {r.destination.name} {r.destination.emoji}
            </p>
            <p className="mt-1 text-sm text-white/75">{r.destination.blurb}</p>
          </div>

          {/* 良いところ */}
          <div className="rounded-2xl bg-white/5 p-4">
            <h3 className="mb-2 text-sm font-bold text-emerald-300">💞 二人の良いところ</h3>
            <ul className="space-y-2 text-sm text-white/85">
              {r.goodPoints.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-300/70">＋</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 注意点 */}
          {r.watchOuts.length > 0 && (
            <div className="rounded-2xl bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-amber-300">⚡ ちょっと注意</h3>
              <ul className="space-y-2 text-sm text-white/85">
                {r.watchOuts.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-amber-300/70">！</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* アドバイス */}
          <div className="rounded-2xl bg-gradient-to-r from-pink-500/15 to-violet-500/15 px-4 py-3">
            <h3 className="mb-1 text-xs font-bold text-white/60">💌 長続きのヒント</h3>
            <p className="text-sm font-medium text-white/90">{r.advice}</p>
          </div>
        </div>
      </div>

      {/* シェア */}
      <p className="mt-7 mb-3 text-center text-sm font-bold text-white/80">
        この相性をシェアしよう 📣
      </p>
      <div className="grid grid-cols-3 gap-3">
        <a
          href={twUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-2xl bg-black py-3 text-xs font-bold text-white hover:opacity-90"
        >
          <span className="text-lg">𝕏</span>
          ポスト
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-2xl bg-[#06C755] py-3 text-xs font-bold text-white hover:opacity-90"
        >
          <span className="text-lg">💬</span>
          LINE
        </a>
        <button
          onClick={handleCopy}
          className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/20"
        >
          <span className="text-lg">{copied ? "✅" : "🔗"}</span>
          {copied ? "コピー済" : "リンク"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={onAgain}
          className="rounded-2xl border border-white/20 bg-white/5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/10"
        >
          別の相手で試す
        </button>
        <button
          onClick={onBack}
          className="rounded-2xl border border-white/20 bg-white/5 py-3 text-sm font-semibold backdrop-blur hover:bg-white/10"
        >
          自分の結果に戻る
        </button>
      </div>
      <p className="mt-6 text-center text-xs text-white/30">世界恋愛診断</p>
    </motion.section>
  );
}

function Person({ flag, label, sub }: { flag: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl drop-shadow">{flag}</span>
      <span className="mt-1 text-sm font-bold">{label}</span>
      <span className="text-xs text-white/75">{sub}</span>
    </div>
  );
}

/** 円形のスコアゲージ(カウントアップ付き) */
function ScoreRing({ score, color }: { score: number; color: string }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const [shown, setShown] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const startTs = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const p = Math.min((now - startTs) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(eased * score));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [score]);

  return (
    <div className="relative h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - score / 100) }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black">{shown}</span>
        <span className="-mt-1 text-xs text-white/60">% 相性</span>
      </div>
    </div>
  );
}

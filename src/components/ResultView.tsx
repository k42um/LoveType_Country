import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AXIS_LABELS,
  getType,
  type Axis,
  type LoveType,
} from "../data/diagnosis";
import { COUNTRY_INFO } from "../data/countryInfo";
import {
  buildShareUrl,
  copyToClipboard,
  lineShareUrl,
  nativeShare,
  twitterShareUrl,
} from "../lib/share";

interface Props {
  code: string; // ユーザー自身のタイプ
  percents: Record<Axis, number> | null;
  onRestart: () => void;
  onPeek?: (code: string) => void; // 互換性のため受け取るが内部peekを使用
}

export default function ResultView({ code, percents, onRestart }: Props) {
  // 相性国を覗いている時は peek にコードが入る (null=自分の結果)
  const [peek, setPeek] = useState<string | null>(null);
  const isOwn = peek === null;
  const display = getType(peek ?? code);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col"
    >
      {!isOwn && (
        <button
          onClick={() => setPeek(null)}
          className="mb-3 self-start rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10"
        >
          ← 自分の結果に戻る
        </button>
      )}

      <Card t={display} isOwn={isOwn} percents={isOwn ? percents : null} />

      <MatchSection t={display} onPeek={setPeek} />

      {isOwn && <ShareSection t={display} />}

      <button
        onClick={onRestart}
        className="mt-6 w-full rounded-2xl border border-white/20 bg-white/5 py-3.5 text-sm font-semibold backdrop-blur hover:bg-white/10"
      >
        もう一度診断する
      </button>
      <p className="mt-6 text-center text-xs text-white/30">世界恋愛診断</p>
    </motion.section>
  );
}

function Card({
  t,
  isOwn,
  percents,
}: {
  t: LoveType;
  isOwn: boolean;
  percents: Record<Axis, number> | null;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] shadow-2xl backdrop-blur">
      {/* ヘッダー */}
      <div
        className="relative px-6 pb-6 pt-8 text-center"
        style={{
          background: `linear-gradient(135deg, ${t.gradient.from}, ${t.gradient.to})`,
        }}
      >
        <span className="absolute right-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs font-medium">
          出現率 {t.rarity}%
        </span>
        <p className="text-sm font-medium text-white/85">
          {isOwn ? "あなたの恋愛タイプは…" : "相性をチェック中"}
        </p>
        <motion.div
          initial={{ scale: 0.3, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 11 }}
          className="my-2 text-7xl drop-shadow-lg"
        >
          {t.flag}
        </motion.div>
        <h1 className="text-3xl font-black text-white drop-shadow">
          {t.country}
        </h1>
        <p className="mt-1 text-base font-bold text-white/90">「{t.title}」</p>
        <p className="mt-1 text-xs text-white/70">{t.englishName} ─ {t.code}</p>
      </div>

      {/* 本文 */}
      <div className="space-y-6 p-6">
        <p className="rounded-2xl bg-white/5 px-4 py-3 text-center text-base font-bold leading-relaxed text-pink-200">
          “{t.catchCopy}”
        </p>

        <p className="text-sm leading-relaxed text-white/80">{t.summary}</p>

        <div className="flex flex-wrap gap-2">
          {t.traits.map((tr) => (
            <span
              key={tr}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/85"
            >
              #{tr}
            </span>
          ))}
        </div>

        {percents && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white/90">恋愛パラメータ</h3>
            {(Object.keys(AXIS_LABELS) as Axis[]).map((a) => (
              <Meter key={a} axis={a} value={percents[a]} />
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <ListBox title="長所" icon="✨" items={t.strengths} accent="text-emerald-300" />
          <ListBox title="短所" icon="🌀" items={t.weaknesses} accent="text-rose-300" />
        </div>

        <div className="rounded-2xl bg-white/5 px-4 py-3">
          <h3 className="mb-1 text-xs font-bold text-white/60">恋愛スタイル</h3>
          <p className="text-sm font-medium text-white/90">{t.loveStyle}</p>
        </div>

        <CountryFacts t={t} />
      </div>
    </div>
  );
}

function CountryFacts({ t }: { t: LoveType }) {
  const [open, setOpen] = useState(false);
  const info = COUNTRY_INFO[t.code];
  if (!info) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm font-bold backdrop-blur transition-colors hover:bg-white/10"
      >
        <span>🌍 {t.country}という国をもっと知る</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-white/60">
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4 rounded-2xl bg-black/20 p-4">
              {/* 基本情報 */}
              <div className="grid grid-cols-2 gap-3">
                <FactChip icon="🏛️" label="首都" value={info.capital} />
                <FactChip icon="🗣️" label="言語" value={info.language} />
              </div>

              {/* 愛してる */}
              <div
                className="rounded-2xl px-4 py-3 text-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${t.gradient.from}, ${t.gradient.to})`,
                }}
              >
                <p className="text-xs font-medium text-white/85">
                  {info.language.split("・")[0]}で「愛してる」
                </p>
                <p className="mt-1 text-2xl font-black drop-shadow">
                  {info.loveWord.text}
                </p>
                <p className="text-sm text-white/85">{info.loveWord.reading}</p>
              </div>

              <FactRow icon="💕" title="恋愛・デート文化" body={info.dateCulture} />
              <FactRow icon="📍" title="ロマンチックな名所" body={info.spot} />
              <FactRow icon="💡" title="豆知識" body={info.trivia} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FactChip({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <p className="text-[10px] font-bold text-white/50">
        {icon} {label}
      </p>
      <p className="text-sm font-semibold text-white/90">{value}</p>
    </div>
  );
}

function FactRow({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-bold text-white/60">
        {icon} {title}
      </h4>
      <p className="text-sm leading-relaxed text-white/85">{body}</p>
    </div>
  );
}

function Meter({ axis, value }: { axis: Axis; value: number }) {
  const lbl = AXIS_LABELS[axis];
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/60">
        <span>{lbl.neg}</span>
        <span className="font-bold text-white/80">{lbl.name}</span>
        <span>{lbl.pos}</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-400"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ListBox({
  title,
  icon,
  items,
  accent,
}: {
  title: string;
  icon: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <h3 className={`mb-2 text-sm font-bold ${accent}`}>
        {icon} {title}
      </h3>
      <ul className="space-y-1.5 text-sm text-white/80">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="text-white/40">・</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MatchSection({
  t,
  onPeek,
}: {
  t: LoveType;
  onPeek: (code: string) => void;
}) {
  return (
    <div className="mt-6 space-y-4">
      <MatchRow
        label="相性のいい国"
        emoji="💞"
        codes={t.goodMatch}
        onPeek={onPeek}
        good
      />
      <MatchRow
        label="ちょっと注意な国"
        emoji="⚡"
        codes={t.badMatch}
        onPeek={onPeek}
        good={false}
      />
    </div>
  );
}

function MatchRow({
  label,
  emoji,
  codes,
  onPeek,
  good,
}: {
  label: string;
  emoji: string;
  codes: string[];
  onPeek: (code: string) => void;
  good: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-white/80">
        {emoji} {label}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {codes.map((c) => {
          const m = getType(c);
          return (
            <button
              key={c}
              onClick={() => onPeek(c)}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left backdrop-blur transition-colors ${
                good
                  ? "border-pink-400/40 bg-pink-500/10 hover:bg-pink-500/20"
                  : "border-white/15 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="text-3xl">{m.flag}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">
                  {m.country}
                </span>
                <span className="block truncate text-xs text-white/60">
                  {m.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShareSection({ t }: { t: LoveType }) {
  const [copied, setCopied] = useState(false);
  const url = buildShareUrl(t.code);

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleNative = async () => {
    const shared = await nativeShare(t, url);
    if (!shared) handleCopy();
  };

  return (
    <div className="mt-8">
      <p className="mb-3 text-center text-sm font-bold text-white/80">
        結果をシェアしよう 📣
      </p>
      <div className="grid grid-cols-3 gap-3">
        <a
          href={twitterShareUrl(t, url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-2xl bg-black py-3 text-xs font-bold text-white hover:opacity-90"
        >
          <span className="text-lg">𝕏</span>
          ポスト
        </a>
        <a
          href={lineShareUrl(t, url)}
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
      <button
        onClick={handleNative}
        className="mt-3 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 py-3.5 text-sm font-bold shadow-lg"
      >
        友だちに結果を送る
      </button>
    </div>
  );
}

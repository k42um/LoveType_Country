import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getType } from "../data/diagnosis";

type Phase = "analyze" | "takeoff" | "cruise" | "arrive";

const PHASE_TEXT: Record<Phase, { title: string; sub: string }> = {
  analyze: { title: "恋愛タイプを解析中…", sub: "あなたの恋の傾向を分析しています" },
  takeoff: { title: "搭乗完了！ まもなく離陸します", sub: "シートベルトをお締めください ✈️" },
  cruise: { title: "目的地へフライト中…", sub: "雲の上を気持ちよく巡航しています" },
  arrive: { title: "まもなく到着します", sub: "あなたの恋の目的地が見えてきました" },
};

// フェーズの進行スケジュール(ミリ秒)
const SCHEDULE: { phase: Phase; at: number }[] = [
  { phase: "analyze", at: 0 },
  { phase: "takeoff", at: 1300 },
  { phase: "cruise", at: 2300 },
  { phase: "arrive", at: 4200 },
];
const TOTAL = 5400;

const ROUTE_PROGRESS: Record<Phase, number> = {
  analyze: 4,
  takeoff: 22,
  cruise: 68,
  arrive: 100,
};

interface Props {
  code: string;
  onComplete: () => void;
}

export default function FlightTransition({ code, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("analyze");
  const dest = getType(code);

  useEffect(() => {
    const timers = SCHEDULE.map(({ phase, at }) =>
      window.setTimeout(() => setPhase(phase), at),
    );
    const done = window.setTimeout(onComplete, TOTAL);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete]);

  const arrived = phase === "arrive";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center"
    >
      {/* 飛行機の窓 */}
      <div className="relative" style={{ width: 248, height: 320 }}>
        {/* 窓枠 */}
        <div className="absolute inset-0 rounded-[120px] bg-gradient-to-b from-slate-100 to-slate-400 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]" />
        {/* ガラス内側 */}
        <div className="absolute inset-[14px] overflow-hidden rounded-[106px] shadow-[inset_0_0_28px_rgba(0,0,0,0.55)]">
          {/* 空(到着時に目的地カラーへ変化) */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: arrived
                ? `linear-gradient(180deg, ${dest.gradient.from}, ${dest.gradient.to})`
                : "linear-gradient(180deg, #1b2a6b 0%, #4055b8 45%, #ff9bb6 100%)",
            }}
            transition={{ duration: 1.1 }}
          />

          {/* 星 */}
          {!arrived &&
            STARS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute h-0.5 w-0.5 rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2 + s.d, repeat: Infinity, delay: s.d }}
              />
            ))}

          {/* 流れる雲 */}
          {CLOUDS.map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white blur-md"
              style={{
                width: c.w,
                height: c.w * 0.5,
                top: `${c.y}%`,
                opacity: c.o,
              }}
              initial={{ x: 280 }}
              animate={{ x: -160 }}
              transition={{
                duration: phase === "cruise" ? c.s : c.s * 1.8,
                repeat: Infinity,
                ease: "linear",
                delay: c.delay,
              }}
            />
          ))}

          {/* 主翼 */}
          <div
            className="absolute -right-6 bottom-2 h-24 w-44 bg-gradient-to-tl from-slate-500 to-slate-300"
            style={{ clipPath: "polygon(100% 60%, 0% 100%, 12% 78%, 100% 38%)" }}
          >
            <span className="animate-blink absolute left-1 top-7 block h-2 w-2 rounded-full bg-red-500" />
          </div>

          {/* 目的地の国旗(到着時に出現) */}
          <AnimatePresence>
            {arrived && (
              <motion.div
                initial={{ scale: 0, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 12 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <span className="text-7xl drop-shadow-lg">{dest.flag}</span>
                <span className="mt-1 rounded-full bg-black/30 px-3 py-1 text-sm font-bold text-white backdrop-blur">
                  まもなく到着
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ガラスの反射 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/25" />
        </div>
      </div>

      {/* フライトルート */}
      <div className="mt-9 flex w-full max-w-xs items-center gap-2">
        <span className="text-lg">🛫</span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-400"
            animate={{ width: `${ROUTE_PROGRESS[phase]}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute top-1/2 text-sm"
            animate={{ left: `calc(${ROUTE_PROGRESS[phase]}% - 8px)` }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ translateY: "-50%" }}
          >
            ✈️
          </motion.span>
        </div>
        <span className="text-lg">{arrived ? dest.flag : "🛬"}</span>
      </div>

      {/* テキスト */}
      <div className="mt-8 h-20 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xl font-bold text-white">{PHASE_TEXT[phase].title}</p>
            <p className="mt-1 text-sm text-white/60">{PHASE_TEXT[phase].sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={onComplete}
        className="mt-4 rounded-full px-4 py-1.5 text-xs text-white/45 hover:bg-white/10 hover:text-white/70"
      >
        スキップ →
      </button>
    </motion.section>
  );
}

const CLOUDS = [
  { w: 90, y: 18, o: 0.85, s: 3.2, delay: 0 },
  { w: 130, y: 38, o: 0.7, s: 4.0, delay: 0.6 },
  { w: 70, y: 55, o: 0.9, s: 2.6, delay: 1.2 },
  { w: 110, y: 70, o: 0.6, s: 3.6, delay: 0.3 },
  { w: 60, y: 30, o: 0.75, s: 2.9, delay: 1.6 },
];

const STARS = [
  { x: 20, y: 12, d: 0.4 },
  { x: 70, y: 8, d: 1.1 },
  { x: 45, y: 22, d: 0.7 },
  { x: 82, y: 25, d: 1.6 },
  { x: 30, y: 35, d: 0.2 },
  { x: 60, y: 16, d: 1.3 },
];

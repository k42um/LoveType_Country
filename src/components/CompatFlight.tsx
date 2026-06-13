import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { getType } from "../data/diagnosis";
import { pickDestination } from "../data/compatibility";

// ===========================================================================
// 相性診断の待機演出: 世界地図の上を、二人の国から飛行機が弧を描いて
// 飛び交い、新しい目的地で合流する。
// ===========================================================================

type Phase = "calc" | "takeoff" | "enroute" | "arrive";

const PHASE_TEXT: Record<Phase, { title: string; sub: string }> = {
  calc: { title: "二人のフライトプランを計算中…", sub: "世界地図に航路を描いています" },
  takeoff: { title: "それぞれの国から、離陸！", sub: "ふたつの想いが空へ飛び立ちます ✈️" },
  enroute: { title: "新しい目的地で待ち合わせ…", sub: "二人の航路が近づいていきます" },
  arrive: { title: "二人、同じ場所に到着！", sub: "相性の結果が見えてきました" },
};

const SCHEDULE: { phase: Phase; at: number }[] = [
  { phase: "calc", at: 0 },
  { phase: "takeoff", at: 1200 },
  { phase: "enroute", at: 2200 },
  { phase: "arrive", at: 4400 },
];
const TOTAL = 5600;
const FLY_DELAY = 1.2; // 離陸タイミング(秒)
const FLY_DUR = 3.0; // 飛行時間(秒)

// 緯度経度 → equirectangular 投影 (viewBox 360x180)
const project = (lat: number, lon: number) => ({ x: lon + 180, y: 90 - lat });

// 各タイプ(国)のおおよその緯度経度
const COUNTRY_LL: Record<string, [number, number]> = {
  PLDF: [40, -4], PLDT: [42, 12], PLRF: [-10, -52], PLRT: [39, -98],
  PSDF: [39, 22], PSDT: [37, 127], PSRF: [23, -102], PSRT: [22, 78],
  GLDF: [53, -8], GLDT: [54, -2], GLRF: [52, 5], GLRT: [51, 10],
  GSDF: [64, 26], GSDT: [36, 138], GSRF: [62, 15], GSRT: [56, -106],
};

interface Pt {
  x: number;
  y: number;
}
interface Arc {
  o: Pt;
  d: Pt;
  c: Pt;
}

function makeArc(o: Pt, d: Pt): Arc {
  const dist = Math.hypot(d.x - o.x, d.y - o.y);
  const lift = Math.min(60, Math.max(14, dist * 0.4));
  return { o, d, c: { x: (o.x + d.x) / 2, y: (o.y + d.y) / 2 - lift } };
}
const qx = (a: Arc, t: number) =>
  (1 - t) ** 2 * a.o.x + 2 * (1 - t) * t * a.c.x + t ** 2 * a.d.x;
const qy = (a: Arc, t: number) =>
  (1 - t) ** 2 * a.o.y + 2 * (1 - t) * t * a.c.y + t ** 2 * a.d.y;
const qAng = (a: Arc, t: number) => {
  const dxdt = 2 * (1 - t) * (a.c.x - a.o.x) + 2 * t * (a.d.x - a.c.x);
  const dydt = 2 * (1 - t) * (a.c.y - a.o.y) + 2 * t * (a.d.y - a.c.y);
  return (Math.atan2(dydt, dxdt) * 180) / Math.PI;
};
const arcPath = (a: Arc) => `M${a.o.x} ${a.o.y} Q${a.c.x} ${a.c.y} ${a.d.x} ${a.d.y}`;

interface Props {
  selfCode: string;
  partnerCode: string;
  onComplete: () => void;
}

export default function CompatFlight({ selfCode, partnerCode, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("calc");
  const me = getType(selfCode);
  const partner = getType(partnerCode);
  const dest = pickDestination(selfCode, partnerCode);
  const arrived = phase === "arrive";

  const meP = project(...COUNTRY_LL[selfCode]);
  const paP = project(...COUNTRY_LL[partnerCode]);
  const dP = project(...dest.ll);
  const arcMe = makeArc(meP, dP);
  const arcPa = makeArc(paP, dP);

  // 飛行の進行度(0→1)
  const progress = useMotionValue(0);
  const meX = useTransform(progress, (t) => qx(arcMe, t));
  const meY = useTransform(progress, (t) => qy(arcMe, t));
  const meR = useTransform(progress, (t) => qAng(arcMe, t));
  const paX = useTransform(progress, (t) => qx(arcPa, t));
  const paY = useTransform(progress, (t) => qy(arcPa, t));
  const paR = useTransform(progress, (t) => qAng(arcPa, t));

  useEffect(() => {
    const controls = animate(progress, 1, {
      delay: FLY_DELAY,
      duration: FLY_DUR,
      ease: "easeInOut",
    });
    const timers = SCHEDULE.map(({ phase, at }) =>
      window.setTimeout(() => setPhase(phase), at),
    );
    const done = window.setTimeout(onComplete, TOTAL);
    return () => {
      controls.stop();
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onComplete, progress]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center"
    >
      {/* フライトマップ */}
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <svg viewBox="0 0 360 180" className="block w-full bg-[#0a1230]">
          <defs>
            <pattern id="dots" width="3.4" height="3.4" patternUnits="userSpaceOnUse">
              <circle cx="0.8" cy="0.8" r="0.7" fill="#5b8bff" fillOpacity="0.45" />
            </pattern>
            <radialGradient id="vign" cx="50%" cy="45%" r="75%">
              <stop offset="60%" stopColor="#0a1230" stopOpacity="0" />
              <stop offset="100%" stopColor="#060a1f" stopOpacity="0.9" />
            </radialGradient>
            <linearGradient id="meGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff6fae" stopOpacity="0" />
              <stop offset="100%" stopColor="#ff6fae" />
            </linearGradient>
            <linearGradient id="paGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8b7bff" stopOpacity="0" />
              <stop offset="100%" stopColor="#8b7bff" />
            </linearGradient>
            <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
            <clipPath id="land">
              {CONTINENTS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </clipPath>
          </defs>

          {/* 海 */}
          <rect width="360" height="180" fill="#0a1230" />

          {/* 緯度経度グリッド */}
          <g stroke="#2a3a6e" strokeWidth="0.3" opacity="0.6">
            {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="180" />
            ))}
            {[30, 60, 90, 120, 150].map((y) => (
              <line key={y} x1="0" y1={y} x2="360" y2={y} />
            ))}
          </g>
          <line x1="0" y1="90" x2="360" y2="90" stroke="#3a4f8e" strokeWidth="0.4" />

          {/* 大陸(ドット) */}
          <g clipPath="url(#land)">
            <rect width="360" height="180" fill="#16204a" />
            <rect width="360" height="180" fill="url(#dots)" />
          </g>

          {/* 計画航路(うっすら点線) */}
          <path d={arcPath(arcMe)} fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.6" strokeDasharray="2 2" />
          <path d={arcPath(arcPa)} fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.6" strokeDasharray="2 2" />

          {/* 飛行トレイル(進行に合わせて描画) */}
          <motion.path
            d={arcPath(arcMe)}
            fill="none"
            stroke="url(#meGrad)"
            strokeWidth="1.3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: FLY_DELAY, duration: FLY_DUR, ease: "easeInOut" }}
          />
          <motion.path
            d={arcPath(arcPa)}
            fill="none"
            stroke="url(#paGrad)"
            strokeWidth="1.3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: FLY_DELAY, duration: FLY_DUR, ease: "easeInOut" }}
          />

          {/* ビネット */}
          <rect width="360" height="180" fill="url(#vign)" />

          {/* 出発地ピン */}
          <Pin x={meP.x} y={meP.y} flag={me.flag} color="#ff6fae" />
          <Pin x={paP.x} y={paP.y} flag={partner.flag} color="#8b7bff" />

          {/* 目的地ピン */}
          <DestPin x={dP.x} y={dP.y} dest={dest} arrived={arrived} />

          {/* 到着時のハート */}
          <AnimatePresence>
            {arrived &&
              HEARTS.map((h, i) => (
                <motion.text
                  key={i}
                  x={dP.x + h.x}
                  y={dP.y}
                  fontSize="7"
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], y: dP.y - 18 }}
                  transition={{ duration: 1.6, delay: h.d, repeat: Infinity }}
                >
                  💗
                </motion.text>
              ))}
          </AnimatePresence>

          {/* 飛行機(弧の上を移動・進行方向に機首を向ける) */}
          <motion.g style={{ x: meX, y: meY, rotate: meR }}>
            <Plane color="#ff6fae" />
          </motion.g>
          <motion.g style={{ x: paX, y: paY, rotate: paR }}>
            <Plane color="#8b7bff" />
          </motion.g>
        </svg>
      </div>

      {/* テキスト */}
      <div className="mt-7 h-20 text-center">
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
        className="mt-3 rounded-full px-4 py-1.5 text-xs text-white/45 hover:bg-white/10 hover:text-white/70"
      >
        スキップ →
      </button>
    </motion.section>
  );
}

function Plane({ color }: { color: string }) {
  // 原点中心・+x方向(東)を向いた紙飛行機型
  return (
    <g filter="url(#soft)">
      <circle r="3.4" fill={color} fillOpacity="0.25" />
      <path d="M4.5 0 L-3.5 -2.6 L-1.2 0 L-3.5 2.6 Z" fill="#ffffff" />
    </g>
  );
}

function Pin({ x, y, flag, color }: { x: number; y: number; flag: string; color: string }) {
  return (
    <g>
      <motion.circle
        cx={x}
        cy={y}
        r="2"
        fill={color}
        animate={{ r: [2, 4.5, 2], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx={x} cy={y} r="1.6" fill={color} />
      <text x={x} y={y - 4} fontSize="7" textAnchor="middle">
        {flag}
      </text>
    </g>
  );
}

function DestPin({
  x,
  y,
  dest,
  arrived,
}: {
  x: number;
  y: number;
  dest: { flag: string; emoji: string; name: string };
  arrived: boolean;
}) {
  return (
    <g>
      <motion.circle
        cx={x}
        cy={y}
        r="3"
        fill="#ffd166"
        animate={{ r: [3, 6, 3], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <circle cx={x} cy={y} r="2" fill="#ffd166" />
      <AnimatePresence mode="wait">
        {arrived ? (
          <motion.text
            key="dest"
            x={x}
            y={y - 4.5}
            fontSize="8"
            textAnchor="middle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {dest.emoji}
          </motion.text>
        ) : (
          <motion.text
            key="q"
            x={x}
            y={y - 4}
            fontSize="6"
            textAnchor="middle"
            fill="#ffd166"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ?
          </motion.text>
        )}
      </AnimatePresence>
      {arrived && (
        <motion.text
          x={x}
          y={y + 8}
          fontSize="5"
          fontWeight="bold"
          textAnchor="middle"
          fill="#fff"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {dest.flag} {dest.name}
        </motion.text>
      )}
    </g>
  );
}

const HEARTS = [
  { x: -6, d: 0 },
  { x: 0, d: 0.3 },
  { x: 6, d: 0.6 },
];

// 大陸のおおよそのシルエット(equirectangular 360x180・装飾用)
const CONTINENTS = [
  // 北アメリカ
  "M40 30 C24 32 18 44 28 50 C22 58 34 62 40 56 C44 70 58 70 60 58 C72 72 86 64 80 52 C98 56 110 48 104 36 C112 30 108 22 96 22 C78 18 56 20 48 28 C45 26 43 27 40 30 Z",
  // グリーンランド
  "M138 12 C131 14 133 26 142 26 C151 26 156 16 149 12 C146 9 141 10 138 12 Z",
  // 南アメリカ
  "M108 92 C100 96 104 108 110 112 C108 126 118 146 126 140 C135 130 132 114 130 104 C137 96 130 84 118 88 C113 86 110 88 108 92 Z",
  // ヨーロッパ
  "M176 34 C170 36 173 44 180 44 C177 50 187 53 191 47 C200 51 207 44 201 38 C205 32 197 28 188 30 C183 28 179 31 176 34 Z",
  // アフリカ
  "M182 60 C176 66 182 74 181 82 C184 98 198 116 207 106 C216 96 212 82 216 74 C223 64 214 54 202 58 C194 54 186 56 182 60 Z",
  // アジア
  "M203 32 C212 26 236 24 256 30 C282 24 314 30 330 42 C340 40 342 52 330 56 C316 54 302 60 290 56 C280 66 258 62 252 52 C240 60 224 54 218 46 C210 50 196 42 203 32 Z",
  // インド半島
  "M250 56 C246 60 250 70 255 72 C260 68 260 60 257 56 C255 54 252 54 250 56 Z",
  // オーストラリア
  "M296 116 C288 120 293 132 303 133 C314 134 324 126 320 117 C315 108 303 110 296 116 Z",
];

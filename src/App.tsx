import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./components/Background";
import {
  AXIS_LABELS,
  CHOICES,
  axisPercents,
  buildQuiz,
  calcType,
  type Answers,
  type Axis,
  type Question,
} from "./data/diagnosis";
import { readTypeFromUrl } from "./lib/share";
import ResultView from "./components/ResultView";

type Screen = "landing" | "quiz" | "result";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [resultCode, setResultCode] = useState<string | null>(null);
  // 出題セット。アクセスごとにランダム(30問→各軸5問ずつ20問・順序もシャッフル)。
  // 「もう一度診断する」で再抽選するため state で保持する。
  const [quiz, setQuiz] = useState<Question[]>(() => buildQuiz());

  // 共有リンク (?type=XXXX) で開いた場合は結果から表示
  useEffect(() => {
    const shared = readTypeFromUrl();
    if (shared) {
      setResultCode(shared);
      setScreen("result");
    }
  }, []);

  const start = () => {
    setQuiz(buildQuiz()); // 開始のたびに出題を再抽選・再シャッフル
    setAnswers({});
    setStep(0);
    setScreen("quiz");
  };

  const answer = (value: number) => {
    const q = quiz[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step + 1 < quiz.length) {
      setStep(step + 1);
    } else {
      const code = calcType(next, quiz);
      setResultCode(code);
      // 結果はクリーンなURLに反映（共有しやすく）
      window.history.replaceState(null, "", `?type=${code}`);
      setScreen("result");
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else setScreen("landing");
  };

  const restart = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setAnswers({});
    setStep(0);
    setResultCode(null);
    setScreen("landing");
  };

  const hasOwnAnswers = Object.keys(answers).length === quiz.length;
  const percents = useMemo(
    () => (hasOwnAnswers ? axisPercents(answers, quiz) : null),
    [answers, hasOwnAnswers, quiz],
  );

  return (
    <>
      <Background />
      <main className="relative mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-8 text-white">
        <AnimatePresence mode="wait">
          {screen === "landing" && (
            <Landing key="landing" onStart={start} />
          )}
          {screen === "quiz" && (
            <Quiz
              key="quiz"
              question={quiz[step]}
              step={step}
              total={quiz.length}
              currentValue={answers[quiz[step].id]}
              onAnswer={answer}
              onBack={back}
            />
          )}
          {screen === "result" && resultCode && (
            <ResultView
              key="result"
              code={resultCode}
              percents={percents}
              onRestart={restart}
              onPeek={setResultCode}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

// ===========================  ランディング  ===========================

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="mb-6 text-7xl drop-shadow-[0_8px_24px_rgba(255,95,143,0.5)]"
      >
        💘
      </motion.div>
      <p className="mb-3 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-medium tracking-wide backdrop-blur">
        20の質問でわかる ─ 全16カ国
      </p>
      <h1 className="bg-gradient-to-r from-pink-300 via-rose-200 to-violet-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl">
        あなたの恋は
        <br />
        「どの国」タイプ？
      </h1>
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
        恋愛のクセを4つの軸で分析して、世界16カ国のいずれかに診断。
        長所も短所も、相性のいい国・悪い国まで丸わかり。
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="mt-9 w-full max-w-xs rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-4 text-lg font-bold shadow-[0_10px_30px_-8px_rgba(236,72,153,0.7)]"
      >
        診断をはじめる →
      </motion.button>
      <p className="mt-4 text-xs text-white/40">所要時間 約2分・登録不要・無料</p>

      <div className="mt-12 flex flex-wrap justify-center gap-2 text-2xl opacity-80">
        {["🇪🇸", "🇮🇹", "🇯🇵", "🇰🇷", "🇺🇸", "🇫🇷", "🇧🇷", "🇩🇪", "🇮🇳", "🇬🇧"].map(
          (f, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              {f}
            </motion.span>
          ),
        )}
      </div>
    </motion.section>
  );
}

// ===========================  質問  ===========================

function Quiz({
  question: q,
  step,
  total,
  currentValue,
  onAnswer,
  onBack,
}: {
  question: Question;
  step: number;
  total: number;
  currentValue: number | undefined;
  onAnswer: (v: number) => void;
  onBack: () => void;
}) {
  const progress = ((step + 1) / total) * 100;
  const axisLabel = AXIS_LABELS[q.axis as Axis].name;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 flex-col"
    >
      {/* 進捗 */}
      <div className="mb-2 flex items-center justify-between text-xs text-white/60">
        <button onClick={onBack} className="rounded-lg px-2 py-1 hover:bg-white/10">
          ← 戻る
        </button>
        <span>
          {step + 1} / {total}
        </span>
      </div>
      <div className="mb-10 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-violet-400"
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col justify-center">
            <span className="mb-4 self-start rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              {axisLabel}
            </span>
            <h2 className="text-2xl font-bold leading-relaxed sm:text-3xl">
              {q.text}
            </h2>
          </div>

          <div className="mt-8 flex flex-col gap-3 pb-2">
            {CHOICES.map((c) => {
              const selected = currentValue === c.value;
              return (
                <motion.button
                  key={c.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAnswer(c.value)}
                  className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left text-base font-medium backdrop-blur transition-colors ${
                    selected
                      ? "border-pink-400 bg-pink-500/20"
                      : "border-white/15 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span>{c.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

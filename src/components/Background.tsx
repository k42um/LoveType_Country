interface Props {
  from?: string;
  to?: string;
}

/** 画面全体の背景。ふわっと動く2つの光彩でリッチな雰囲気を出す */
export default function Background({ from = "#ff5f8f", to = "#7c5cff" }: Props) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0c0a1d]">
      <div
        className="animate-drift absolute -top-1/4 -left-1/4 h-[80vh] w-[80vh] rounded-full opacity-40 blur-[120px]"
        style={{ background: from }}
      />
      <div
        className="animate-drift absolute -bottom-1/4 -right-1/4 h-[80vh] w-[80vh] rounded-full opacity-40 blur-[120px]"
        style={{ background: to, animationDelay: "-7s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0a1d_85%)]" />
    </div>
  );
}

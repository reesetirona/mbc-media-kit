export default function Header() {
  return (
    <header className="bg-white px-12 border-b border-silver flex items-center justify-between h-16 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 bg-navy rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm font-syne">M</span>
        </div>
        <div>
          <div className="font-syne text-[15px] font-bold text-navy tracking-wide">
            MBC Media Group
          </div>
          <div className="font-mono text-[9px] text-muted tracking-widest uppercase">
            Media Kit Generator
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-600 font-mono text-[10px] px-3 py-1 rounded-full tracking-wider">
        ● AI-Powered
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <header className="bg-white px-12 border-b border-silver flex items-center justify-between h-16 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3.5">
        <img src="/mbc-logo.png" alt="MBC Media Group" className="h-9 w-auto" />
      </div>
      <div className="bg-blue-50 border border-blue-200 text-blue-600 font-mono text-[10px] px-3 py-1 rounded-full tracking-wider">
        ● AI-Powered
      </div>
    </header>
  );
}

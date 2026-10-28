export default function Logo({ textClass = "text-lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-sm bg-forest flex items-center justify-center shrink-0">
        <span className="text-white text-sm font-serif">D</span>
      </div>
      <span className={`font-serif ${textClass}`}>Docket</span>
    </div>
  );
}

export default function StatusBadge({ status }: { status: string }) {
  const isDraft = status === "DRAFT";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border ${
        isDraft
          ? "text-amber-400 border-amber-400/30 bg-amber-400/5"
          : "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isDraft ? "bg-amber-400" : "bg-emerald-400"
        }`}
      />
      {isDraft ? "Draft" : "Published"}
    </span>
  );
}

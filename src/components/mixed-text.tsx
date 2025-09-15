export function MixedText({ value, className = "" }: { value: string | number | null | undefined; className?: string }) {
  const safeValue = String(value ?? "");
  const parts = safeValue.split(/(\d+)/);

  return (
    <span className={className}>
      {parts.map((part, idx) =>
        /^\d+$/.test(part) ? (
          <span key={idx} className="font-numeric">
            {part}
          </span>
        ) : (
          <span key={idx} className="font-sans">
            {part}
          </span>
        )
      )}
    </span>
  );
}

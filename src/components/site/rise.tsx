/**
 * Splits a line of text into masked words that settle down into place on first load.
 * Pure CSS (`.settle-word` in globals.css), so it renders on the server and never flashes.
 */
export function SettleWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="settle-mask">
            <span className="settle-word" style={{ "--i": i, "--d": `${delay}s` } as React.CSSProperties}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

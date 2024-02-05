export default function Spinner({ fixed = true }: { fixed?: boolean }) {
  const inner = (
    <div className={"flex items-center justify-center"}>
      <div
        className={
          "h-12 w-12 animate-spin rounded-full border-b-2 border-white"
        }
      />
    </div>
  );

  if (!fixed) {
    return inner;
  }

  return (
    <div
      className={
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-secondary/30 p-6"
      }
    >
      {inner}
    </div>
  );
}

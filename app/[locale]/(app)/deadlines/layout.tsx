import type { ReactNode } from "react";

export default function DeadlinesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full mt-15 overflow-y-auto min-h-full">{children}</div>
  );
}

import type { ReactNode } from "react";

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return <div className="w-full overflow-y-auto min-h-full">{children}</div>;
}

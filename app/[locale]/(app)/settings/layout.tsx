import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full mt-15 overflow-y-auto min-h-full">{children}</div>
  );
}

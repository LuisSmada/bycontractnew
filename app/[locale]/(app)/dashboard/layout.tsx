import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full mt-15 overflow-y-auto  min-h-full ">{children}</div>
  );
}

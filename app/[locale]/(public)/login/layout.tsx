import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div className="bg-gray-50">{children}</div>;
}

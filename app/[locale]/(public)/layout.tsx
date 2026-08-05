import type { ReactNode } from "react";

interface IPublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: IPublicLayoutProps) {
  return <>{children}</>;
}

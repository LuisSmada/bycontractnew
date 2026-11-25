import { type ReactNode } from "react";
import { AppLayoutContent } from "./AppLayoutContent";

export default function Layout({ children }: { children: ReactNode }) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
}

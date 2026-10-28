import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { PublicLayoutContent } from "./PublicLayoutContent";

interface IPublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: IPublicLayoutProps) {
  return <PublicLayoutContent>{children}</PublicLayoutContent>;
}

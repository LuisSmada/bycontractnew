import { ReactNode } from "react";
import StoreProvider from "../StoreProvider";

interface ILocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children }: ILocaleLayoutProps) {
  return <StoreProvider>{children}</StoreProvider>;
}

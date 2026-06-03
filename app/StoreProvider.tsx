"use client"

import { makeStore, TAppStore } from "@/src/store/store"
import {  useState, type ReactNode } from "react"
import { Provider } from "react-redux";

interface IStoreProviderProps {
    children: ReactNode
}

export default function StoreProvider({ children}: IStoreProviderProps) {
    const [store] = useState<TAppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ContractsTableTabs = () => {
  return (
    <Tabs defaultValue="account" className="w-100">
      <TabsList
        className={
          "bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 border border-slate-200/40 self-start"
        }
      >
        <TabsTrigger
          value="account"
          className={
            "relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          }
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className={
            "relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          }
        >
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
};

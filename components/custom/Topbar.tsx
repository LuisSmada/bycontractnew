"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { Avatar, AvatarBadge, AvatarFallback } from "../ui/avatar";
import { useAppSelector } from "@/src/store/reduxHooks";
import { currentUserSelector } from "@/src/store/selectors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDown,
  Search,
  Bell,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "../ui/button";

export const Topbar = () => {
  const router = useRouter();
  const currentUser = useAppSelector(currentUserSelector);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const avatarInitials = useMemo(() => {
    const firstName = currentUser["firstName"];
    const lastName = currentUser["lastName"];
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  }, [currentUser]);

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-[#0a0e1a] border-b border-slate-900 flex items-center justify-between px-6 z-40 shadow-md">
      <Image src={"/svg/BYC_white.svg"} alt="BYC Logo" width={53} height={53} />

      <motion.div
        initial={{ width: 400 }}
        animate={{
          width: isSearchFocused ? 480 : 400,
          borderColor: isSearchFocused ? "#6366f1" : "#1e293b",
          backgroundColor: isSearchFocused
            ? "#0f172a"
            : "rgba(15, 23, 42, 0.6)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex items-center gap-3 border rounded-xl px-4 py-1.5 transition-shadow shadow-sm"
        style={{
          boxShadow: isSearchFocused
            ? "0 0 0 2px rgba(49, 46, 129, 0.5)"
            : "none",
        }}
      >
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          id="global-search-input"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Rechercher ou lancer un prompt d'analyse..."
          className="w-full text-xs bg-transparent outline-none text-slate-300 placeholder-slate-500"
        />
        <span className="text-[10px] text-slate-500 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded-md font-mono">
          ⌘K
        </span>
      </motion.div>

      <div className="flex space-x-5 justify-between items-center">
        <Button
          onClick={() => {}}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all-custom relative cursor-pointer"
          title="Journaux système d'audit"
        >
          <Bell className="w-5 h-5 text-white" />
          <span
            id="notif-badge"
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-[#0a0e1a] rounded-full"
          ></span>
        </Button>

        <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-3 pl-1 group cursor-pointer">
              <Avatar>
                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                <AvatarFallback>{avatarInitials}</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-ui-brand transition-colors leading-none">
                  {currentUser.firstName} {currentUser.lastName}{" "}
                </p>
                <span className="text-[10px] text-slate-500 mt-1">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="text-slate-200 w-3" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={
              "mt-2 dropdown-menu w-45 text-ui-text shadow-xl border border-slate-100 p-1.5 rounded-xl"
            }
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/fr/profile")}
                className={
                  "text-xs gap-3 font-semibold text-slate-700 px-3 py-2 hover:bg-slate-50 Rounded-lg  cursor-pointer"
                }
              >
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/fr/billing")}
                className={
                  "text-xs gap-3 font-semibold text-slate-700 px-3 py-2 hover:bg-slate-50 Rounded-lg  cursor-pointer"
                }
              >
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/fr/settings")}
                className={
                  "text-xs gap-3 font-semibold text-slate-700 px-3 py-2 hover:bg-slate-50 Rounded-lg  cursor-pointer"
                }
              >
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className={"mx-2 my-1.5"} />
              <DropdownMenuItem
                variant="destructive"
                className={
                  "text-xs gap-3 font-semibold text-slate-700 px-3 py-2 hover:bg-slate-50 Rounded-lg  cursor-pointer"
                }
              >
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

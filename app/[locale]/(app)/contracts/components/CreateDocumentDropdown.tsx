"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  ChevronUp,
  ChevronDown,
  FileText,
  LayoutTemplate,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreateDocumentDropdown = () => {
  const router = useRouter();
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  return (
    <DropdownMenu onOpenChange={(open) => setIsDropdownOpened(open)}>
      {/* style button */}
      {/* shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 */}
      <DropdownMenuTrigger className="bg-ui-brand hover:bg-ui-brandHover text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all-custom flex items-center gap-2 cursor-pointer">
        <Plus className="w-4 h-4 text-white" />
        Nouveau
        {isDropdownOpened ? (
          <ChevronUp className="w-3 h-3 ml-1 text-white" />
        ) : (
          <ChevronDown className="w-3 h-3 ml-1 text-white" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "w-56 rounded-xl mt-2 shadow-xl border border-slate-100 p-1.5 z-50"
        }
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            CREATION
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push("/fr/contracts/new")}
            className={
              "text-xs font-semibold text-slate-700 flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
            }
          >
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
              <FileText className="w-4 h-4" />
            </div>
            Document vierge
          </DropdownMenuItem>
          <DropdownMenuItem
            className={
              "text-xs font-semibold text-slate-700 flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
            }
          >
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            À partir d un modèle
          </DropdownMenuItem>
          <DropdownMenuSeparator className={"my-1.5 mx-2"} />
          <DropdownMenuItem
            onClick={() => router.push("/fr/contracts/upload")}
            className={
              "text-xs font-semibold text-slate-700 flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left cursor-pointer"
            }
          >
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
              <Upload className="w-4 h-4" />
            </div>
            Importer un fichier (PDF/Word)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

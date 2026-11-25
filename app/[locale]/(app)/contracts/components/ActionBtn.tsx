import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ActionBtn = ({
  icon: Icon,
  title,
  onClick,
  isNeutral = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => (
  <Tooltip>
    <TooltipTrigger
      onClick={onClick}
      className={`p-1.5 hover:bg-white rounded-md transition-all cursor-pointer ${isNeutral ? "text-slate-600" : "text-indigo-600"}`}
    >
      <Icon className="w-4 h-4" />
    </TooltipTrigger>
    <TooltipContent
      side="top"
      className="bg-slate-900 text-white text-xs px-2.5 py-1.5"
    >
      {title}
    </TooltipContent>
  </Tooltip>
);

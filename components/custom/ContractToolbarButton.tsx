import React, { ReactNode } from "react";
import { Button } from "../ui/button";

interface IContractToolbarButton {
  children: ReactNode;
  onClick: VoidFunction;
  isActive: boolean;
  disabled?: boolean;
}

export const ContractToolbarButton = ({
  children,
  isActive,
  onClick,
  disabled,
}: IContractToolbarButton) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={` p-1.5 rounded font-bold transition-colors bg-transparent cursor-pointer ${isActive ? "bg-slate-200 text-slate-900 hover:bg-slate-200" : "hover:bg-slate-100 text-slate-400 hover:text-slate-800"}`}
    >
      {children}
    </Button>
  );
};

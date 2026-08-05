import Image from "next/image";
import React from "react";

export const ComingSoon = () => {
  return (
    <div className="w-full flex flex-1 items-center justify-center flex-col gap-5">
      <Image
        src={"/svg/underconstruction.svg"}
        alt="avaialble soon image"
        width={300}
        height={200}
      />
      <div className="font-bold text-3xl text-ui-text">
        This page will be available soon !
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FC, ReactNode } from "react";

interface IPublicLayoutContent {
  children: ReactNode;
}

export const PublicLayoutContent: FC<IPublicLayoutContent> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center pt-24 bg-gray-50">
        <div className="mb-12">
          <Image
            src={"/svg/BYCONTRACT.svg"}
            alt="BYCONTRACT Logo"
            className="w-40"
            width={160}
            height={160}
            loading={"eager"}
          />
        </div>
        <div className="w-full flex justify-center mt-8">
          <Image
            src={"/images/homemeeting.png"}
            alt="Home Meeting"
            className="w-full max-w-125 h-auto object-contain"
            width={571}
            height={429}
          />
        </div>
      </div>

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:max-w-md xl:max-w-lg shrink-0 h-full shadow-[-4px_0_24px_rgba(0,0,0,0.05)] bg-white z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

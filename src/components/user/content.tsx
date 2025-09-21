"use client";
import cn from "classnames";
import Navbar from "./Navbar";

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex flex-col overflow-y-auto transition-all duration-300",
        {
          "w-full lg:w-[75%] xl:w-[77.5%] 2xl:w-[80%]": true,
        }
      )}
    >
      <Navbar />
      <main className="w-full px-4 2xs:px-6 lg:pl-0  gap-4 xl:pr-6 py-4">
        {children}
      </main>
    </div>
  );
};

export default Content;

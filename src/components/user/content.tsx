"use client";
import cn from "classnames";
import Navbar from "./Navbar";

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "flex flex-col overflow-y-auto transition-all duration-300 bg-white dark:bg-black",
        {
          "w-full lg:flex-1 lg:ml-2": true,
        }
      )}
    >
      <Navbar />
      <main className="w-full flex-1 px-3 2xs:px-5 lg:px-5 xl:px-7 py-5">
        {children}
      </main>
    </div>
  );
};

export default Content;

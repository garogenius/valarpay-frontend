"use client";

import Image from "next/image";
import images from "../../../public/images";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useNavigate from "@/hooks/useNavigate";
import Link from "next/link";
import { NavItems } from "@/constants/index";
import CustomButton from "../shared/Button";
import cn from "classnames";
import { SlClose, SlMenu, SlArrowDown } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";
import DownloadPopupModal from "../modals/DownloadPopupModal";

type NavbarProps = {
  bgColor?: string;      // e.g. "bg-red-500"
  bgColorDark?: string;  // e.g. "dark:bg-black"
  // ...other props
};

const Navbar = ({ bgColor, bgColorDark, ...props }: NavbarProps) => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    initial: {
      y: "-100%",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.1,
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: {
        duration: 0.01,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full">
        <div
          className={`flex justify-center 
    ${!bgColor && "bg-bg-400 md:bg-dark-primary"} 
    ${!bgColorDark && "dark:bg-dark-primary"} 
    text-text-200 py-3.5 w-full transition-all duration-300 ease-in-out ${scrolled ? "shadow-md" : ""}`}
          style={{
            backgroundColor: bgColor || undefined,
            ...(bgColorDark && { '--tw-bg-opacity': 1, backgroundColor: bgColorDark }),
          }}
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center w-[95%] lg:w-[90%]">
            <div className="flex items-center gap-6">
              <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
                <Image
                  onClick={() => navigate("/")}
                  src={images.logo}
                  alt="logo"
                  className="w-8 h-auto"
                />
                <span className="text-xl font-semibold text-primary">VALARPAY</span>
              </div>
              <div className="flex justify-center items-center text-base gap-9 lg:gap-6 ml-12 lg:ml-16 xl:ml-20">
                {NavItems.map((item) => (
                  <div key={item?.id} className="relative group">
                    {Array.isArray((item as any)?.children) && (item as any).children.length > 0 ? (
                      <>
                        <button
                          className={cn(
                            `no-underline font-medium hover:text-secondary py-1`,
                            {
                              "text-primary border-b-2 border-primary": isActive(
                                item.path
                              ),
                              "text-text-200 dark:text-text-400": !isActive(
                                item.path
                              ),
                            }
                          )}
                        >
                          {item?.title}
                        </button>
                        <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 mt-2 min-w-52 rounded-lg bg-bg-1100 dark:bg-tertiary text-text-200 dark:text-text-400 shadow-lg border border-border-200 p-2">
                          {(item as any).children.map((child: any) => (
                            <Link
                              href={child.path}
                              key={child.id}
                              className="block w-full text-left px-4 py-2 rounded-md hover:bg-bg-1500 dark:hover:bg-bg-1700 hover:text-secondary"
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item?.path}
                        className={cn(
                          `no-underline font-medium hover:text-secondary py-1`,
                          {
                            "text-primary border-b-2 border-primary": isActive(
                              item.path
                            ),
                            "text-text-200 dark:text-text-400": !isActive(
                              item.path
                            ),
                          }
                        )}
                      >
                        {item?.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 lg:gap-3.5">
              <CustomButton
                onClick={() => navigate("/login")}
                className="rounded-xl max-lg:px-6 bg-transparent border-none text-secondary"
              >
                Sign in
              </CustomButton>
              <CustomButton
                onClick={() => navigate("/account-type")}
                className="rounded-xl max-lg:px-6 bg-secondary text-white"
              >
                Sign up
              </CustomButton>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex text-white justify-between items-center w-[95%] lg:w-[90%]">
            <div className="flex items-center gap-4">
              <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
                <Image
                  onClick={() => navigate("/")}
                  src={images.logo}
                  alt="logo"
                  className="w-8 h-auto"
                />
                <span className="text-xl font-semibold text-primary">VALARPAY</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3.5">
              <CustomButton
                onClick={() => navigate("/login")}
                className="max-md:hidden rounded-3xl max-lg:px-6 bg-transparent border border-secondary text-secondary"
              >
                Sign in
              </CustomButton>
              <CustomButton
                onClick={() => navigate("/account-type")}
                className="max-md:hidden rounded-3xl max-lg:px-6 bg-secondary text-white"
              >
                Sign up
              </CustomButton>
              <div
                onClick={() => setOpen(true)}
                className="cursor-pointer p-3 rounded-full text-white dark:text-text-400 text-xl bg-secondary/90"
              >
                <SlMenu />
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {open && (
              <motion.div
                variants={menuVariants as any}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed md:hidden inset-0 bg-bg-700 dark:bg-dark-primary z-50 overflow-y-auto min-h-screen"
              >
                <div className="flex flex-col items-center w-full bg-inherit h-full">
                  <div className="flex items-center justify-between w-full pt-10 pb-10 px-6">
                    <p></p>
                    <SlClose
                      onClick={() => setOpen(false)}
                      className="text-4xl text-text-500 dark:text-[#999999] cursor-pointer"
                    />
                  </div>

                  <div className="w-full bg-transparent flex justify-center items-center flex-col">
                    {NavItems.map((item) => (
                      <div key={item?.id} className="w-full">
                        {Array.isArray((item as any)?.children) && (item as any).children.length > 0 ? (
                          <>
                            <button
                              aria-expanded={expandedId === (item as any).id}
                              aria-controls={`submenu-${(item as any).id}`}
                              onClick={() =>
                                setExpandedId((prev) =>
                                  prev === (item as any).id ? null : (item as any).id
                                )
                              }
                              className="w-full flex items-center justify-between px-6 py-4 text-base font-medium text-text-200 dark:text-text-400 border-b border-border-200"
                            >
                              <span>{item?.title}</span>
                              <SlArrowDown
                                className={cn(
                                  "transition-transform duration-200",
                                  { "rotate-180": expandedId === (item as any).id }
                                )}
                              />
                            </button>
                            <AnimatePresence>
                              {expandedId === (item as any).id && (
                                <motion.div
                                  id={`submenu-${(item as any).id}`}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col py-1">
                                    {(item as any).children.map((child: any) => (
                                      <Link
                                        href={child.path}
                                        key={child.id}
                                        className="w-full block text-left no-underline px-10 py-3 text-base text-text-200 dark:text-text-400 hover:text-secondary border-b last:border-b-0 border-border-200"
                                        onClick={() => setOpen(false)}
                                      >
                                        {child.title}
                                      </Link>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={item?.path}
                            className={cn(
                              `w-full block text-left no-underline px-6 py-4 text-base border-b border-border-200`,
                              {
                                "text-secondary dark:text-primary": isActive(item.path),
                                "text-text-200 dark:text-text-400": !isActive(item.path),
                              }
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {item?.title}
                          </Link>
                        )}
                      </div>
                    ))}

                    <CustomButton
                      onClick={() => {
                        navigate("/account-type");
                        setOpen(false);
                      }}
                      className="mt-6 mb-8 w-[90%] text-white rounded-xl max-lg:px-6 bg-secondary"
                    >
                      Sign up
                    </CustomButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav >
      <DownloadPopupModal
        isOpen={openDownload}
        onClose={() => setOpenDownload(false)}
      />
    </>
  );
};

export default Navbar;

"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarData } from "../../../constants/index";
import images from "../../../../public/images";
import useUserLayoutStore from "@/store/userLayout.store";
import useNavigate from "@/hooks/useNavigate";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import ErrorToast from "@/components/toast/ErrorToast";

const MainSidebar = () => {
  const { user } = useUserStore();
  const isBvnVerified =
    user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified;
  const isPinCreated = user?.isWalletPinSet;

  const isVerified = isBvnVerified && isPinCreated;

  const navigate = useNavigate();
  const pathname = usePathname();

  const { toggleMenu } = useUserLayoutStore();

  const flatItems = SidebarData.flatMap((section) => section.data);
  const bestMatch = flatItems.reduce<any>((best, item) => {
    if (!item?.path) return best;
    const matches = pathname === item.path || pathname.startsWith(`${item.path}/`);
    if (!matches) return best;
    if (!best) return item;
    return item.path.length > best.path.length ? item : best;
  }, null);

  return (
    <div className={`w-full h-full overflow-auto relative no-scrollbar bg-white dark:bg-[#0A0A0A]`}>
      <div className="w-full flex justify-center items-center py-6 border-b border-gray-200 dark:border-gray-800">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => {
            navigate("/", "push");
          }}
        >
          <Image
            alt="Valarpay logo"
            src={images.logo}
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            VALARPAY
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full pb-40 xs:pb-20 pt-4">
        {SidebarData.map((section, index) => (
          <div
            key={`section-${index}`}
            className="flex flex-col px-3 gap-1 mb-6"
          >
            {section.data.map((item) => {
              const isActive = bestMatch?.path === item.path;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    // #region agent log (debug-mode)
                    fetch('http://127.0.0.1:7242/ingest/0bb6d863-f504-4af9-b459-c020a129ba1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H1',location:'src/components/user/sidebar/MainSidebar.tsx:onClick',message:'Sidebar item clicked',data:{id:item.id,title:item.title,path:item.path,pathname},timestamp:Date.now()})}).catch(()=>{});
                    // #endregion
                    toggleMenu();
                    if (
                      [
                        "/user/savings",
                        "/user/invest",
                        "/user/withdraw",
                      ].includes(item.path)
                    ) {
                      // #region agent log (debug-mode)
                      fetch('http://127.0.0.1:7242/ingest/0bb6d863-f504-4af9-b459-c020a129ba1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H1',location:'src/components/user/sidebar/MainSidebar.tsx:blocked',message:'Navigation blocked by Coming Soon list',data:{path:item.path,title:item.title},timestamp:Date.now()})}).catch(()=>{});
                      // #endregion
                      ErrorToast({
                        title: "This feature is not available yet",
                        descriptions: ["Coming Soon"],
                      });
                    } else if (item.id === 1) {
                      // #region agent log (debug-mode)
                      fetch('http://127.0.0.1:7242/ingest/0bb6d863-f504-4af9-b459-c020a129ba1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'src/components/user/sidebar/MainSidebar.tsx:navigate-home',message:'Navigating (id===1)',data:{path:item.path},timestamp:Date.now()})}).catch(()=>{});
                      // #endregion
                      navigate(item.path);
                    } else if (isVerified) {
                      // #region agent log (debug-mode)
                      fetch('http://127.0.0.1:7242/ingest/0bb6d863-f504-4af9-b459-c020a129ba1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'src/components/user/sidebar/MainSidebar.tsx:navigate-verified',message:'Navigating (verified user)',data:{path:item.path},timestamp:Date.now()})}).catch(()=>{});
                      // #endregion
                      navigate(item.path);
                    } else if (item.path === "/logout") {
                      // #region agent log (debug-mode)
                      fetch('http://127.0.0.1:7242/ingest/0bb6d863-f504-4af9-b459-c020a129ba1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'src/components/user/sidebar/MainSidebar.tsx:navigate-logout',message:'Navigating (logout)',data:{path:item.path},timestamp:Date.now()})}).catch(()=>{});
                      // #endregion
                      navigate(item.path);
                    } else {
                      // #region agent log (debug-mode)
                      fetch('http://127.0.0.1:7242/ingest/0bb6d863-f504-4af9-b459-c020a129ba1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'src/components/user/sidebar/MainSidebar.tsx:navigate-default',message:'Navigating (default)',data:{path:item.path},timestamp:Date.now()})}).catch(()=>{});
                      // #endregion
                      navigate(item.path);
                    }
                  }}
                  className={`${(item as any)?.mobileHidden ? "hidden md:flex" : ""} ${
                    isActive
                      ? "bg-[#f76301] text-white font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1C1C1E] font-medium"
                  } rounded-lg cursor-pointer flex items-center gap-3 py-3 px-4 transition-all`}
                >
                  <item.icon className="text-xl" />
                  <p className="text-sm">{item.title}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainSidebar;

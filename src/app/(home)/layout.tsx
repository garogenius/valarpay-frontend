import AppCta from "@/components/home/AppCta";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen h-full bg-bg-600 dark:bg-black">
      <Navbar />
      <div className="flex flex-1">{children}</div>
      <div className="flex flex-col lg:gap-12 xl:gap-16 bg-bg-600 bg-[#F2F2F2] dark:bg-tertiary">
        <AppCta />
        <Footer />
      </div>
    </div>
  );
}

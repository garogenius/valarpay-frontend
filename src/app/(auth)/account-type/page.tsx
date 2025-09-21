import AccountTypeDescription from "@/components/auth/accountType/AccountTypeDescription";
import AccountTypeSelector from "@/components/auth/accountType/AccountTypeSelector";
import Link from "next/link";
import Image from "next/image";
import images from "../../../../public/images";
import React from "react";

const AccountTypePage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2">
        <AccountTypeDescription />
      </div>
      {/* Right (fills screen on mobile) */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-center items-center min-h-screen lg:min-h-0 bg-bg-700 dark:bg-dark-primary">
        {/* Mobile-only branding (logo + app name) */}
        <Link
          href="/"
          className="lg:hidden absolute top-4 left-4 z-10 flex items-center gap-2"
        >
          <Image src={images.logo} alt="ValarPay logo" className="w-8 h-auto" />
          <span className="text-white font-semibold text-lg tracking-wide">VALARPAY</span>
        </Link>
        <div className="w-full max-w-xl px-4 sm:px-8 py-8">
          <div className="text-white flex flex-col self-start justify-start items-start gap-2 md:gap-4 mb-6">
            <h1 className="text-xl lg:text-3xl font-bold">
              Choose Account type
            </h1>
            <p className="text-base xs:text-lg font-light">
              Are you creating a business or <br /> personal account?
            </p>
          </div>
          <div className="space-y-10">
            <AccountTypeSelector />
            <p className="mt-6 text-base sm:text-lg text-white text-center">
              Already have an account?{" "}
              <Link className="text-primary" href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypePage;

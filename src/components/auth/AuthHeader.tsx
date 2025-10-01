"use client";

import Image from "next/image";
import Link from "next/link";
import images from "../../../public/images";

type AuthHeaderProps = {
  showCta?: boolean;
};

const AuthHeader = ({ showCta = true }: AuthHeaderProps) => {
  return (
    <>
      {/* Top-left branding */}
      <Link href="/" className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <Image src={images.logo} alt="ValarPay logo" className="w-8 h-auto" />
        <span className="text-white font-semibold text-lg tracking-wide">VALARPAY</span>
      </Link>

      {/* Top-right call to action */}
      {showCta && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3 text-sm">
          <span className="hidden sm:inline text-text-200">Don't have an account?</span>
          <Link
            href="/account-type"
            className="text-primary bg-primary/10 hover:bg-primary/20 transition-colors px-3 py-1.5 rounded-md"
          >
            Get started
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthHeader;

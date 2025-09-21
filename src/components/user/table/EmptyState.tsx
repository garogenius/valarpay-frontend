import Image from "next/image";
import Link from "next/link";

const EmptyState = ({
  image,
  title,
  path,
  placeholder,
  showButton = true,
}: {
  image: string;
  title: string;
  path: string;
  placeholder: string;
  showButton?: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 xs:gap-6 py-20">
      <div className="flex flex-col justify-center items-center gap-2.5 xs:gap-4">
        <Image
          alt="empty-state"
          src={image}
          className="w-24 2xs:w-28 sm:w-32 lg:w-36"
        />
        <p className="text-text-200 dark:text-text-400 text-base 2xs:text-lg font-bold text-center">
          {title}
        </p>
      </div>
      {showButton && (
        <Link
          href={path}
          className="mb-4 w-fit py-1.5 2xs:py-2 px-6 2xs:px-8 2xl:px-10 bg-transparent rounded-xl text-text-200 dark:text-text-400 font-medium border-2 border-border-200 dark:border-border-100 text-sm 2xs:text-base"
        >
          {placeholder}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

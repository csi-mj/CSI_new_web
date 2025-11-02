import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export const BentoGrid = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid w-screen max-w-7xl grid-cols-1 gap-4 md:auto-rows-[21rem] md:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  imageSrc, // Changed from icon to imageSrc
  href
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  imageSrc?: string; 
  href?: string;
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        'group/bento shadow-input row-span-1 flex cursor-pointer flex-col justify-between space-y-4 rounded-xl border border-white/[0.2] bg-black p-4 transition duration-200',
        className
      )}
      onClick={() => {
        if (href) {
          router.push(href);
          console.log('Clicked');
        }
      }}
    >
      {imageSrc ? (
        <div className="relative mb-4 h-48 w-full hover:cursor-pointer">
          {' '}
          {/* Define size container */}
          <Image
            src={imageSrc}
            alt="Image"
            layout="fill" // Ensures the image fills the container
            // objectFit="cover" // Ensures the image covers the container
            className={`rounded-lg object-cover
                `} // Optional styling
          />
        </div>
      ) : (
        header
      )}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="my-2 font-sans font-bold text-neutral-100 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-neutral-200 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  href?: string;
  showText?: boolean;
  imageClassName?: string;
  textClassName?: string;
};

export function BrandMark({ className, href = "/", showText = true, imageClassName, textClassName }: BrandMarkProps) {
  const content = (
    <>
      <span className="inline-flex size-10 items-center justify-center overflow-hidden ">
        <Image src="/logo.png" alt="JemberKost" width={40} height={40} priority className={cn("h-full w-full object-contain", imageClassName)} />
      </span>
      {showText ? (
        <span className={cn("text-lg font-semibold tracking-tight text-foreground", textClassName)}>
          Jember<span className="text-primary">Kost</span>
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("inline-flex shrink-0 items-center gap-2", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("inline-flex shrink-0 items-center gap-2", className)}>{content}</div>;
}

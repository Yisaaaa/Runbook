import clsx from "clsx";
import { Circle, GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function NavBar({ classname }: { classname?: string }) {
  return (
    <header
      className={clsx(
        classname,
        "py-4 border-b border-b-muted flex items-center justify-between"
      )}
    >
      <div className="max-w-5xl flex justify-between mx-auto w-full">
        <Link href={"/"} className="flex gap-4 items-center">
          <GalleryVerticalEnd className="w-5 h-5" />
          <span className="text-2xl font-semibold">Runbook</span>
        </Link>

        <div className="flex items-center">
          <Circle fill="#fff" className="w-8 h-8" />
        </div>
      </div>
    </header>
  );
}

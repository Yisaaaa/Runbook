import { Button } from "@/components/ui/button";
import { poppins } from "../fonts";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen md:py-6 md:px-12 p-4 flex flex-col w-full">
      {/* Navbar */}
      <header>
        <div className="mx-auto flex justify-between items-center">
          <p
            className={`${poppins.className} antialiased text-3xl font-semibold`}
          >
            Runbook
          </p>
          <div className="flex justify-between gap-4">
            <Button className="font-medium" variant="ghost">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="secondary" className="flex gap-2 items-center">
              <Link href="/dashboard">Get started</Link>
              <ArrowRight className="w-2 h-2" strokeWidth={3} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto flex flex-col items-center grow text-foreground pt-40">
        <div className="w-xl mx-auto justify-center text-center">
          <p
            className={`${poppins.className} antialiased text-7xl mb-7 font-medium`}
          >
            Documentation you can run
          </p>
          <p className="font-medium text-lg mb-10">
            Write Markdown. Run Code. Learn faster.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="font-medium">
            {/* Should be updated to correct route for creating runbook */}
            <Link href="/dashboard">Create Runbook</Link>
          </Button>
          <Button variant="ghost">
            <p>Learn more</p>
            <ArrowRight className="w-2 h-2" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
}

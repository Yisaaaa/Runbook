import Button from "./ui/Button";
import { merryweather, playfair_display } from "./fonts";

export default function Home() {
  return (
    <div className="min-h-screen flex bg-background">
      <main className="min-h-screen flex flex-col w-full">
        {/* Navbar */}
        <div className=" border-b border-b-primary py-5">
          <div className="max-w-6xl px-4 mx-auto flex justify-between items-center">
            <p
              className={`${playfair_display.className} antialiased text-3xl font-semibold`}
            >
              Runbook
            </p>
            <div className="flex justify-between gap-4">
              <Button className="font-medium" variant="secondary">
                Sign In
              </Button>
              <Button>Get started</Button>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="w-full flex grow text-primary pt-40">
          <div className="w-xl mx-auto justify-center text-center">
            <p
              className={`${merryweather.className} antialiased text-6xl font-medium`}
            >
              Documentation you can run.
            </p>
            <p className="mt-6 font-medium text-lg">
              Stop pasting commands. Write markdown. Click Run.
            </p>

            <div></div>
            <Button className="mt-8">Start writing</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

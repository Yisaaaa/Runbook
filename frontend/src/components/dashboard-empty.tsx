import { ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "./ui/button";

export default function DashboardEmpty() {
  return (
    <div className="flex flex-col items-center gap-5 mt-18">
      <BookOpenText className="w-20 h-20" strokeWidth={1.1} />
      <p className="font-medium text-lg">No runbooks yet</p>
      <p className="max-w-1/2 text-center text-muted-foreground text-sm">
        Runbooks are interactive documents where you can write markdown and
        execute code. Create your first runbook!
      </p>
      <Button variant="ghost" className="text-foreground">
        <span>Learn More</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

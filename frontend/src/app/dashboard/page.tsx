import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus, Search } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl mb-2">My runbooks</h1>
          <p className="text-muted-foreground">
            Manage and execute your runbooks
          </p>
        </div>

        <Button variant={"secondary"} className="flex gap-4">
          <Plus />
          <span>New Runbook</span>
        </Button>
      </div>

      <InputGroup className="py-6 mb-8">
        <InputGroupInput placeholder="Search runbooks..." />
        <InputGroupAddon>
          <Search className="w-4 h-4" />
        </InputGroupAddon>
      </InputGroup>

      <div>{}</div>
    </div>
  );
}

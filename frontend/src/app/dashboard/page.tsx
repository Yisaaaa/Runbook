"use client";

import DashboardEmpty from "@/components/dashboard-empty";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import RunbookCard from "@/components/runbook-card";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRunbook } from "@/queries/runbook";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { data, isLoading, error } = useRunbook();
  const [runbooks, setRunbooks] = useState<any[]>([]);

  if (error) {
    toast.error("Failed to fetch runbooks");
  }

  useEffect(() => {
    const runbooks = [];
    for (let i = 0; i <= 5; i++) {
      runbooks.push({
        title: "Installing Django",
        updatedAt: "2025-12-15T11:35:40.529Z",
        owner: "bobmarley",
      });
    }
    setRunbooks(runbooks);
  }, []);

  const cards: any = [];

  runbooks.forEach((runbook) => {
    cards.push(<RunbookCard {...runbook} />);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl mb-2">My runbooks</h1>
          <p className="text-muted-foreground">
            Manage and execute your runbooks
          </p>
        </div>

        <Button variant={"secondary"} className="flex gap-2">
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

      <div>
        {isLoading ? <DashboardSkeleton count={4} /> : <DashboardEmpty />}
      </div>
    </div>
  );
}

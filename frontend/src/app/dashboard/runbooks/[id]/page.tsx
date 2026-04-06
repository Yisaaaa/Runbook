"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRunbookQueryById } from "@/queries/runbook";
import { useSessionStore } from "@/store/sessionStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchWrapper } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import RunbookMarkdown from "@/components/runbook-markdown";
import { useEffect } from "react";

export default function RunbookViewPage() {
  const params = useParams();
  const router = useRouter();
  const runbookId = Number(params.id);
  const userId = useAuthStore((state) => state.user!.id);
  const { data, isLoading, isError, error } = useRunbookQueryById(runbookId);
  const sessionStore = useSessionStore();

  if (isError && error instanceof Error) {
    console.log("error loading runbook: ", error);
    toast.error(error.message);
    router.replace("/dashboard/runbooks");
  }
  console.log(isLoading, data);
  if (!isLoading && !data) {
    console.log("Failed to load runbook: ", error);
    router.replace("/dashboard/runbooks");
  }

  useEffect(() => {
    if (runbookId !== sessionStore.runbookId) {
      sessionStore.clearSession();
    }
  }, [sessionStore.runbookId]);

  const connectSessionUi = () => {
    if (sessionStore.sessionId) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="focus-visible:ring-0">
              <div className="bg-green-500 w-2 h-2 rounded-full" />
              <span>Connected</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10}>
            <DropdownMenuItem variant="destructive">
              Disconnect session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (sessionStore.isConnecting) {
      return (
        <Button variant={"outline"} disabled={true} className="flex gap-2">
          <Loader2 className="animate-spin" />
          <span>Connecting...</span>
        </Button>
      );
    }

    return (
      <Button variant={"outline"} onClick={handleConnectSession}>
        Connect to session
      </Button>
    );
  };

  const handleConnectSession = async () => {
    sessionStore.setConnecting(true);
    try {
      const res = await fetchWrapper(`/sessions/connect/${runbookId}`, {
        method: "POST",
      });
      console.log("connection res: ", res);
      sessionStore.setSession(res.id, res.runbookId);
    } catch (error) {
      console.error("error connecting to session: ", error);
      toast.error("Failed to connect to session");
    } finally {
      sessionStore.setConnecting(false);
    }
  };

  const handleBackToDashboard = () => {
    router.replace("/dashboard/runbooks");
  };

  return (
    <div className="h-screen overflow-auto flex flex-col">
      <div className="mx-auto w-full max-w-5xl">
        {isLoading && (
          <div className="h-dvh flex flex-col gap-4 justify-center items-center">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="animate-pulse">Loading runbook... </p>
          </div>
        )}

        <div className="mb-8 flex flex-col sticky top-0 z-10 bg-background pt-3">
          <Button
            onClick={handleBackToDashboard}
            variant="link"
            className="flex text-muted-foreground items-center justify-start px-0! pb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to dashboard</span>
          </Button>
          <div className="flex justify-between items-center pb-4">
            <div>
              <p className="font-semibold text-xl mb-0.5">{data?.title}</p>
              <p className="font-medium text-sm text-muted-foreground">
                Created {data?.createdAt && formatDistanceToNow(data.createdAt)}{" "}
                ago
              </p>
            </div>
            <div>{connectSessionUi()}</div>
          </div>
          <Separator />
        </div>

        <RunbookMarkdown
          content={data?.content ?? ""}
          runbookId={runbookId}
          sessionId={sessionStore.sessionId}
        />
      </div>
    </div>
  );
}

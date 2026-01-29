"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import RunbookPreviewPage from "@/components/runbook-preview";
import { runbookCreateSchema, RunbookSnapshot } from "@/types/runbook";
import { useParams } from "next/navigation";
import { useRunbookQueryById } from "@/queries/runbook";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchWrapper } from "@/lib/api";

export default function RunbookPage() {
  const params = useParams();
  const router = useRouter();
  const runbookId = params.id && params.id !== "new" ? Number(params.id) : null;
  const { data, isLoading, isError, error } = useRunbookQueryById(runbookId);

  const [runbookSnapshot, setRunbookSnapshot] = useState<RunbookSnapshot>({
    title: "",
    runtime: "",
    content: "",
  });

  const [title, setTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(true);
  const [content, setContent] = useState("");
  const [runtime, setRuntime] = useState<string | undefined>(undefined);

  const toggleEditState = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      (e.currentTarget.id === "edit" && !isEditMode) ||
      (e.currentTarget.id === "preview" && isEditMode)
    ) {
      setIsEditMode(!isEditMode);
    }
  };

  const handleBackToDashboard = () => {
    if (
      title !== runbookSnapshot.title ||
      content !== runbookSnapshot.content ||
      runtime !== runbookSnapshot.runtime
    ) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!confirmLeave) {
        return;
      }
    }
    router.replace("/dashboard/runbooks");
  };

  const handleSaveRunbook = async () => {
    const runbook = {
      title,
      content,
      runtime,
    };

    const parsed = runbookCreateSchema.safeParse(runbook);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    try {
      const method = runbookId ? "PUT" : "POST";
      const url = runbookId ? `/runbooks/${runbookId}` : "/runbooks";

      await fetchWrapper(url, { method, body: JSON.stringify(parsed.data) });
      toast.success("Runbook saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save runbook");
    }
  };

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(error.message);
      router.push("/dashboard/runbooks");
    }
  }, [isError, error]);

  useEffect(() => {
    if (params.id && data) {
      setTitle(data.title);
      setContent(data.content);
      setRuntime(data.runtime);

      setRunbookSnapshot({
        title: data.title,
        content: data.content,
        runtime: data.runtime,
      });
    }
  }, [data, params.id]);

  return (
    <div className="max-w-5xl mx-auto mt-4 mb-10">
      <Button
        onClick={handleBackToDashboard}
        variant="link"
        className="flex text-muted-foreground mb-9 items-center justify-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to dashboard</span>
      </Button>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 md:text-base text-sm">
          <span className="shrink-0 font-medium">Runbooks /</span>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="md:text-base h-fit text-sm"
          />
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="outline"
            className="px-2"
            onClick={handleBackToDashboard}
          >
            Cancel Changes
          </Button>
          <Button
            variant="default"
            className="px-2"
            onClick={handleSaveRunbook}
          >
            Save Changes...
          </Button>
        </div>
      </div>

      <div className="border-2 border-muted rounded-md">
        <div className="flex justify-between border-b-2 border-b-muted bg-muted/30 p-2 relative">
          <div className="bg-muted flex rounded-md ">
            <button
              id="edit"
              className={clsx("px-4 py-1 rounded-sm text-sm", {
                "bg-secondary font-semibold": isEditMode,
                "bg-muted": !isEditMode,
              })}
              onClick={toggleEditState}
            >
              Edit
            </button>
            <button
              id="preview"
              className={clsx("px-4 py-1 rounded-sm text-sm", {
                "bg-secondary font-semibold": !isEditMode,
                "bg-muted": isEditMode,
              })}
              onClick={toggleEditState}
            >
              Preview
            </button>
          </div>

          <Select value={runtime} onValueChange={setRuntime}>
            <SelectTrigger className="w-38">
              <SelectValue placeholder="Select runtime" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectGroup>
                <SelectLabel>Runtimes</SelectLabel>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="nodejs">Node.js</SelectItem>
                <SelectItem value="golang">Go</SelectItem>
                <SelectItem value="bash">Bash (Ubuntu)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="">
          {isEditMode ? (
            <Editor
              height="calc(100dvh - 250px)"
              defaultLanguage="markdown"
              theme="vs-dark"
              value={content}
              onChange={(value) => setContent(value || "")}
              options={{
                fontSize: 17,
                minimap: { enabled: false },
              }}
            />
          ) : (
            <RunbookPreviewPage
              content={content}
              runtime={runtime}
              runbookId={runbookId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

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
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import RunbookPreviewPage from "@/components/runbook-preview";

export default function RunbookPage() {
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

  return (
    <div className="max-w-5xl mx-auto mt-4 mb-10">
      <Button variant="link" className="flex text-muted-foreground mb-9">
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
          <Button variant="outline" className="px-2">
            Cancel Changes
          </Button>
          <Button variant="default" className="px-2">
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
            <RunbookPreviewPage content={content} runtime={runtime} />
          )}
        </div>
      </div>
    </div>
  );
}

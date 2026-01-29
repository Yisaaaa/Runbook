import z from "zod";

enum RunbookPrivacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  SHARED = "SHARED",
}

export interface Runbook {
  id: number;
  title: string;
  runtime: string;
  content: string;
  privacy: RunbookPrivacy;
  createdAt: Date;
  userId: number;
  createdBy: string;
}

export interface RunbookSnapshot {
  title: string;
  runtime: string | undefined;
  content: string;
}

export interface RunnableBlock {
  code: string;
  index: number;
}

export const runbookCreateSchema = z.object({
  title: z.string().min(1, "Runbook title must not be empty"),
  runtime: z.string().optional(),
  content: z.string().optional(),
  privacy: z.enum(RunbookPrivacy).default(RunbookPrivacy.PRIVATE),
});

export type RunbookCreateSchemaType = z.infer<typeof runbookCreateSchema>;

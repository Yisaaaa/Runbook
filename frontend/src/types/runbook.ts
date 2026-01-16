export interface Runbook {
  id: number;
  title: string;
  runtime: string;
  content: string;
  privacy: string;
  createdAt: Date;
  userId: number;
  createdBy: string;
}

export interface RunbookSnapshot {
  title: string;
  runtime: string | undefined;
  content: string;
}

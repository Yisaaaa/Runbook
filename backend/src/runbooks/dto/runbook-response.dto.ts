export class RunbookResponseDto {
  id: number;
  title: string;
  runtime: string;
  content: string;
  privacy: string;
  createdAt: Date;
  userId: number;
  createdBy: string;
}

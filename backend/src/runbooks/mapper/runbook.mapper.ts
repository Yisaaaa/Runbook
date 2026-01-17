import { Runbook, User } from 'src/generated/prisma/client';
import { RunbookResponseDto } from '../dto/runbook-response.dto';

export type RunbookWithUser = Runbook & {
  user: Pick<User, 'username'>;
};

export function toRunbookResponseDto(
  runbook: RunbookWithUser,
): RunbookResponseDto {
  return {
    id: runbook.id,
    title: runbook.title,
    content: runbook.content,
    runtime: runbook.runtime,
    privacy: runbook.privacy,
    createdAt: runbook.createdAt,
    userId: runbook.userId,
    createdBy: runbook.user.username,
  };
}

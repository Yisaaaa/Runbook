export interface OutputChunk {
  type: "output";
  data: string;
}

export interface ExitChunk {
  type: "exit";
  exitCode: number;
}

export interface ErrorChunk {
  type: "error";
  exitCode: number;
  message: string;
}

export type InstructionFormat = string | null;

export interface DrinkInstructionSchema {
  id: string;
  drink_id: InstructionFormat;
  instructions: string | null;
  created_at: string;
}

export interface QuillViewerProps {
  initialContent: InstructionFormat;
}

export interface QuillEditorProps extends QuillViewerProps {
  onChangeHandler: (value: string) => void;
}

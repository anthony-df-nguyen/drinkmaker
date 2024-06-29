import React, { useState, useEffect } from "react";
import { InstructionFormat } from "../models";
import { modules, formats } from "./modules";
import { useQuill } from "react-quilljs";
import Button from "@/components/UI/Button";
import "quill/dist/quill.snow.css";

interface EditorProps {
  initialContent: InstructionFormat;
  onChangeHandler: (field: "instructions", value: string) => void;
  //onSubmit: (content: InstructionFormat) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onChangeHandler }) => {
  const { quill, quillRef } = useQuill({ modules, formats });
  const [content, setContent] = useState<InstructionFormat>(initialContent);
  const [length, setLength] = useState<number>(0);

  const limit = 10000;
  useEffect(() => {
    if (quill) {
      if (initialContent) {
        // Parse the initialContent HTML string and set it to the Quill editor
        quill.setContents(JSON.parse(initialContent));
        const initialLength = quill.getLength();
        setLength(initialLength);
      }
      quill.on("text-change", () => {
        const len = quill.getLength();
        if (len > limit) {
          quill.deleteText(limit, len);
        }
        setLength(len);
        const content = quill.getContents();
        const stringContent = JSON.stringify(content);
        onChangeHandler("instructions", stringContent);
      });
    }
  }, [quill, initialContent]);

  return (
    <div className="grid gap-2 ">
      <label
        htmlFor="recipe"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Instructions
      </label>
      {/* Editor */}

      <div className="border-gray-100 relative bg-white ">
        <div className="">
          <div ref={quillRef} className="bg-white" />
        </div>
      </div>
      <div className="inputLimit flex justify-end">
        <div>
          {length} / {limit}
        </div>
      </div>
    </div>
  );
};

export default Editor;

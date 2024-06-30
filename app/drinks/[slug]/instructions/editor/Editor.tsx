"use client";
import React, { useState, useEffect } from "react";
import { InstructionFormat } from "../models";
import { modules, formats } from "./modules";
import { useQuill } from "react-quilljs";
import classNames from "@/utils/classNames";
import "quill/dist/quill.snow.css";

interface EditorProps {
  initialContent: InstructionFormat;
  onChangeHandler: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  initialContent,
  onChangeHandler,
}) => {
  const { quill, quillRef } = useQuill({
    modules: modules,
    formats: formats,
  });

  const [length, setLength] = useState<number>(0);

  const limit = 5000;

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
        onChangeHandler(stringContent);
      });
    }
  }, [quill, onChangeHandler, initialContent]);

  return (
    <div id="myQuillEditor" className="relative">
      <div className="w-auto">
        <div ref={quillRef} />
      </div>
      <div className="flex justify-end">
        <div
          className={classNames(
            "inputLimit",
            length === limit ? "text-red-600" : "text-gray-500"
          )}
        >
          {length} / {limit}
        </div>
      </div>
    </div>
  );
};

export default Editor;

/**
 * React component for a view-only Quill editor.
 *
 * @component
 * @param {EditorProps} props - The props for the component.
 * @param {InstructionFormat} props.initialContent - The initial content of the editor.
 * @returns {JSX.Element} The rendered component.
 */

"use client";
import React, { useState, useEffect } from "react";
import { InstructionFormat } from "../models";
import { formats } from "./modules";
import { useQuill } from "react-quilljs";
import Card from "@/components/UI/Card";
import "quill/dist/quill.snow.css";

interface EditorProps {
  initialContent: InstructionFormat;
}

const ViewOnlyQuill: React.FC<EditorProps> = ({ initialContent }) => {
  const { quill, quillRef } = useQuill({
    modules: { toolbar: [] },
    formats: formats,
    readOnly: true,
  });


  useEffect(() => {
    if (quill) {
      const toolbar: any = quill.getModule("toolbar");
      toolbar.container.remove();
      const container = quill.container;
      container.classList.remove("ql-container");

      if (initialContent) {
        quill.setContents(JSON.parse(initialContent));
        container.classList.remove("hide-ql-container");
      } else {
        container.classList.add("hide-ql-container");
      }
    }
  }, [quill, initialContent]);

  return (
    <div className="bg-gray-50 dark:bg-black rounded-md p-2 sm:p-4">
      <div className="w-auto" id="viewOnlyQuill">
        {!initialContent && <div>No instructions written.</div>}
        <div ref={quillRef} />
      </div>
    </div>
  );
};

export default ViewOnlyQuill;

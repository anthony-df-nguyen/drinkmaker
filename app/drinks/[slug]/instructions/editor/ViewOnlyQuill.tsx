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
import classNames from "@/utils/classNames";
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
      }
    }
  }, [quill, initialContent]);

  return (
    <div id="myQuillEditor" className="relative">
      <div className="w-auto" id="viewOnlyQuill">
        <div ref={quillRef} />
      </div>
    </div>
  );
};

export default ViewOnlyQuill;

"use client";
import React, { useEffect } from "react";
import { QuillViewerProps } from "../models";
import { formats } from "./modules";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const ViewOnlyQuill: React.FC<QuillViewerProps> = ({ initialContent }) => {
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
    <div className="bg-surface-raised rounded-md p-2 sm:p-4">
      <div className="w-auto" id="viewOnlyQuill">
        {!initialContent && <div>No instructions written.</div>}
        <div ref={quillRef} />
      </div>
    </div>
  );
};

export default ViewOnlyQuill;

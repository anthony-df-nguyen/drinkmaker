"use client";
import React, { useState, useEffect, useRef } from "react";
import { InstructionFormat } from "../models";
import { modules, formats } from "./modules";
import { useQuill } from "react-quilljs";
import classNames from "@/utils/classNames";
import "quill/dist/quill.snow.css";

interface EditorProps {
  initialContent: InstructionFormat;
  onChangeHandler: (value: string) => void;
}

// Patch to add passive event listeners
const addPassiveEventListener = () => {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    const passiveOptions = options || {};
    if (typeof passiveOptions === "object" && passiveOptions !== null) {
      passiveOptions.passive = true;
    }
    originalAddEventListener.call(this, type, listener, passiveOptions);
  };
};

const Editor: React.FC<EditorProps> = ({ initialContent, onChangeHandler }) => {
  const { quill, quillRef } = useQuill({
    modules: modules,
    formats: formats,
  });

  const [length, setLength] = useState<number>(0);
  const hasMounted = useRef(false);
  const limit = 5000;

  useEffect(() => {
    addPassiveEventListener();
  }, []);

  useEffect(() => {
    if (quill) {
      if (!hasMounted.current && initialContent) {
        quill.setContents(JSON.parse(initialContent));
        const initialLength = quill.getLength();
        setLength(initialLength);
        hasMounted.current = true;
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

  useEffect(() => {
    if (quill && initialContent) {
      quill.setContents(JSON.parse(initialContent));
      const initialLength = quill.getLength();
      setLength(initialLength);
    }
  }, [quill, initialContent]);

  return (
    <div>
      <div id="editQuill" className="relative bg-white">
        <div className="w-auto">
          <div ref={quillRef} />
        </div>
      </div>
      <div className="flex justify-end mt-2">
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
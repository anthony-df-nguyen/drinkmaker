"use client";
import React, { useEffect, useState } from "react";
import { InstructionFormat } from "./models";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Card from "@/components/UI/Card";

interface ViewInstructionsProps {
  instructions: InstructionFormat;
}

const ViewInstructions: React.FC<ViewInstructionsProps> = ({
  instructions,
}) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (instructions) {
      try {
        const delta = JSON.parse(instructions);

        // Check if Delta is empty
        const isEmptyDelta = delta.ops.length === 0 || (delta.ops.length === 1 && delta.ops[0].insert === '\n');

        if (isEmptyDelta) {
          setHtmlContent(null);
        } else {
          const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
          const convertedHTML = converter.convert();
          setHtmlContent(convertedHTML);
        }
      } catch (error) {
        console.error("Failed to parse instructions:", error);
        setHtmlContent(null); // Reset htmlContent on error
      }
    }
  }, [instructions]);

  return (
    <>
      {htmlContent ? (
        <Card className="grid gap-4">
          <div className="text-xl font-medium mb-4">Instructions</div>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </Card>
      ) : (
        <Card className="grid gap-4">
          <div className="text-xl font-medium mb-4">Instructions</div>
          <div className="font-light">No instructions yet. Edit to add instructions.</div>
        </Card>
      )}
    </>
  );
};

export default ViewInstructions;
import React, { useEffect, useState } from "react";
import { InstructionFormat } from "./models";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

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
        const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
        const convertedHTML = converter.convert();
        setHtmlContent(convertedHTML);
      } catch (error) {
        console.error("Failed to parse instructions:", error);
        setHtmlContent(null); // Reset htmlContent on error
      }
    }
  }, [instructions]);

  return (
    <>
      {htmlContent && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-xl font-bold mb-4">Recipe</div>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
      {!htmlContent && <div>No instructions available</div>}
    </>
  );
};

export default ViewInstructions;
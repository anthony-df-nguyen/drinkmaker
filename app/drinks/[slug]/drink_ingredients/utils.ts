import { TagOption } from "@/components/MUIInputs/Tags";
export const getStepForUnit = (unit: string): number => {
  switch (unit) {
    case "oz":
    case "tsp":
    case "tbsp":
    case "cup":
    case "part":
      return 0.25;
    case "ml":
      return 1;
    case "dash":
    case "slice":
    case "wedge":
    case "piece":
    case "pinch":
    case "drop":
    case "splash":
      return 1;
    case "shot":
    case "glass":
      return 0.5;
    default:
      return 1;
  }
};

export const measuringUnits: TagOption[] = [
  { value: "oz", label: "oz" },
  { value: "ml", label: "ml" },
  { value: "dash", label: "dash" },
  { value: "tsp", label: "tsp" },
  { value: "tbsp", label: "tbsp" },
  { value: "cup", label: "cup" },
  { value: "part", label: "part" },
  { value: "slice", label: "slice" },
  { value: "wedge", label: "wedge" },
  { value: "piece", label: "piece" },
  { value: "pinch", label: "pinch" },
  { value: "drop", label: "drop" },
  { value: "splash", label: "splash" },
  { value: "shot", label: "shot" },
  { value: "glass", label: "glass" },
]

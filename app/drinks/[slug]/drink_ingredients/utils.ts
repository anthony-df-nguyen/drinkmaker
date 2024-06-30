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

import { ReactNode } from "react";
export default function Badge({ tone = "default", children }: { tone: "default" | "success" | "critical" | "warning"; children?: ReactNode }) {
  let bgColor = "bg-blue-50";
  let textColor = "text-blue-700";
  let ringColor = "ring-blue-700/10";

  switch (tone) {
    case "critical":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      ringColor = "ring-red-600/10";
      break;
    case "warning":
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-800";
      ringColor = "ring-yellow-600/20";
      break;
    case "success":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      ringColor = "ring-green-600/20";
      break;
  }

  return <span className={`inline-flex items-center rounded-md ${bgColor} px-2 py-1 text-xs font-medium ${textColor} ring-1 ring-inset ${ringColor}`}>{children}</span>;
}

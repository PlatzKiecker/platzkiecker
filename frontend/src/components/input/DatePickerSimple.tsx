import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function DatePickerSimple() {
  return (
    <div className="flex items-center gap-3">
      <ChevronLeftIcon className="h-4 w-4" />
      <p className="text-sm">today</p>
      <ChevronRightIcon className="h-4 w-4" />
    </div>
  );
}

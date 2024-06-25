import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function DatePickerSimple({ date, setDate }: { date: Date; setDate: (date: Date) => void }) {
  const handleNext = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    setDate(nextDate);
  };

  const handlePrev = () => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    setDate(prevDate);
  };

  return (
    <div className="flex items-center gap-3 text-gray-700 ">
      <ChevronLeftIcon onClick={handlePrev} className="h-7 w-7 cursor-pointer p-1.5 hover:text-black hover:bg-gray-200 rounded" />
      <p className="text-sm text-black">{getRelativeDate(date)}</p>
      <ChevronRightIcon onClick={handleNext} className="h-7 w-7 cursor-pointer p-1.5 hover:text-black hover:bg-gray-200 rounded" />
    </div>
  );
}

const getRelativeDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "yesterday";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "tmrw";
  } else {
    return date.toLocaleDateString("de-de", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
};
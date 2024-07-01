
import React from 'react';
interface ProgressBarProps {
  progress: number;
}
const ProgressTracker: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div>
      <h4 className="sr-only">Status</h4>
      <div className="mt-6" aria-hidden="true">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-6 grid grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
            <div className="text-indigo-600">Progress:</div>
            <div className="text-center text-indigo-6000">Step 1: Booking Information</div>
            <div className="text-center ">Step 2: Guest information</div>
            <div className="text-right">Step 3: Confirmation</div>
        </div>
      </div>
    </div>
  );
};
export default ProgressTracker;

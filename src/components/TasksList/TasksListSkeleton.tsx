import React from "react";

const ITEMS_TO_DISPLAY = 4;

const getSkeletonItemHeightClass = () => {
  const minHeight = 10;
  const maxHeight = 20;
  const stepSize = 4;

  return `h-${Math.max(
    stepSize * Math.floor((Math.random() * maxHeight) / stepSize),
    minHeight
  )}`;
};

const TasksListSkeleton = () => (
  <ul>
    {Array.from({ length: ITEMS_TO_DISPLAY }, (_, i) => (
      <li
        key={i}
        className={`mb-4 ${getSkeletonItemHeightClass()} animate-pulse rounded-lg bg-slate-800 py-2 px-4 shadow-md transition-colors`}
      />
    ))}
  </ul>
);

export default React.memo(TasksListSkeleton);

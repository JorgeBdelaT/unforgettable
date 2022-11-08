import React from "react";
import { CREATE_TASK_FORM_HEIGHT, HEADER_HEIGHT } from "../../constants";

const ITEMS_TO_DISPLAY = 4;

const getSkeletonItemHeightClass = () => {
  const minHeight = 12;
  const maxHeight = 24;
  const stepSize = 4;

  const height = Math.max(
    stepSize * Math.floor((Math.random() * maxHeight) / stepSize),
    minHeight
  );

  return `h-${height}`;
};

const TasksListSkeleton = () => (
  <ul
    className="overflow-y-auto px-8 pt-16"
    style={{
      height: `calc(100vh - ${HEADER_HEIGHT} - ${CREATE_TASK_FORM_HEIGHT})`,
    }}
  >
    {Array.from({ length: ITEMS_TO_DISPLAY }, (_, i) => (
      <li
        key={i}
        className={`mb-4 ${getSkeletonItemHeightClass()} animate-pulse rounded-lg bg-slate-800 py-2 px-4 shadow-md transition-colors`}
      />
    ))}
  </ul>
);

export default React.memo(TasksListSkeleton);

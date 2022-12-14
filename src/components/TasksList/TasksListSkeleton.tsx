import React, { useEffect, useState } from "react";
import { BOTTOM_FORM_HEIGHT, HEADER_HEIGHT } from "../../constants";

const ITEMS_TO_DISPLAY = 7;

const getSkeletonItemHeight = () => {
  const minHeight = 12;
  const maxHeight = 24;
  const stepSize = 2;

  const height = Math.max(
    stepSize * Math.floor((Math.random() * maxHeight) / stepSize),
    minHeight
  );

  return `${height * 0.25}rem`;
};

const TasksListSkeleton = () => {
  const [items, setItems] = useState<JSX.Element[]>();

  useEffect(() => {
    setItems(
      Array.from({ length: ITEMS_TO_DISPLAY }, (_, i) => (
        <li
          key={i}
          style={{ height: getSkeletonItemHeight() }}
          className={`mb-4 animate-pulse rounded-lg bg-slate-800 py-2 px-4 shadow-md transition-colors`}
        />
      ))
    );
  }, []);

  return (
    <ul
      className="overflow-y-auto px-4 pt-16"
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
      }}
    >
      {items}
    </ul>
  );
};

export default React.memo(TasksListSkeleton);

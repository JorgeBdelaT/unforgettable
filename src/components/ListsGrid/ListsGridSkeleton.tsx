import React, { useEffect, useState } from "react";
import { BOTTOM_FORM_HEIGHT, HEADER_HEIGHT } from "../../constants";

const ITEMS_TO_DISPLAY = 5;

const getSkeletonItemHeight = () => {
  const minHeight = 32;
  const maxHeight = 46;
  const stepSize = 4;

  const height = Math.max(
    stepSize * Math.floor((Math.random() * maxHeight) / stepSize),
    minHeight
  );

  return `${height * 0.25}rem`;
};

const ListsGridSkeleton = () => {
  const [items, setItems] = useState<JSX.Element[]>();

  useEffect(() => {
    setItems(
      Array.from({ length: ITEMS_TO_DISPLAY }, (_, i) => (
        <div
          key={i}
          style={{ height: getSkeletonItemHeight() }}
          className="relative flex animate-pulse cursor-pointer flex-col items-start gap-2 space-y-0 rounded-lg bg-slate-800 px-4 pt-3 pb-8 pr-7 shadow-md transition-colors hover:bg-opacity-90"
        />
      ))
    );
  }, []);

  return (
    <div
      style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
      }}
    >
      <div className="grid h-full grid-cols-2 items-start gap-3 overflow-y-auto px-3 pt-16 max-[360px]:grid-cols-1 lg:grid-cols-3">
        {items}
      </div>
    </div>
  );
};

export default React.memo(ListsGridSkeleton);

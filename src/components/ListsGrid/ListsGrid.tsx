import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import {
  HEADER_HEIGHT,
  BOTTOM_FORM_HEIGHT,
  LIST_GRID_ID,
} from "../../constants";
import { trpc } from "../../utils/trpc";
import ListsGridItem from "./ListsGridItem";
import ListsGridSkeleton from "./ListsGridSkeleton";

const ListsGrid = () => {
  const {
    data: lists,
    isLoading: listsLoading,
    isError: listsError,
  } = trpc.lists.getAll.useQuery();

  if (listsLoading) return <ListsGridSkeleton />;

  if (listsError)
    return (
      <div
        className="flex flex-col items-center justify-center gap-6 overflow-y-auto text-slate-500"
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
        }}
      >
        <ExclamationTriangleIcon className="h-24 w-24" />
        <p className="text-xl font-medium">Ups! Algo no anda bien.</p>
      </div>
    );

  return (
    <div
      style={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT} - ${BOTTOM_FORM_HEIGHT})`,
      }}
    >
      <div
        id={LIST_GRID_ID}
        className="grid h-full grid-cols-2 items-start gap-3 overflow-y-auto px-3 pt-16 pb-2 max-[360px]:grid-cols-1 lg:grid-cols-3"
      >
        {lists?.map((list) => (
          <ListsGridItem
            key={list.id}
            list={list}
            deleteEnabled={lists.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ListsGrid;

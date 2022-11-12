import React, { useState, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";
import { GET_ALL_LISTS_QUERY_KEY, LIST_GRID_ID } from "../../constants";
import BottomForm from "../BottomForm";
import { ListWithTasksAndUsersCount } from "../../stores/SelectedListStore";
import VisibilityConfigModal from "./VisibilityConfigModal";

const CreateList = () => {
  // TODO: use react hook form
  const [name, setName] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const queryClient = useQueryClient();

  const { mutate: createList, isLoading: createListLoading } =
    trpc.lists.create.useMutation({
      onMutate: async ({ name: cretedListName }) => {
        // scroll to bottom of the grid
        const listsGridElement = document.getElementById(LIST_GRID_ID);
        listsGridElement?.scrollTo({
          top: listsGridElement.getBoundingClientRect().height,
          behavior: "smooth",
        });

        setName("");

        await queryClient.cancelQueries(GET_ALL_LISTS_QUERY_KEY);
        const previousLists = queryClient.getQueryData(GET_ALL_LISTS_QUERY_KEY);

        queryClient.setQueryData(
          GET_ALL_LISTS_QUERY_KEY,
          (old: ListWithTasksAndUsersCount[] | undefined) => {
            const optimisticList: ListWithTasksAndUsersCount = {
              id: "new-list",
              name: cretedListName,
              createdAt: new Date(),
              updatedAt: new Date(),
              tasks: [],
              _count: {
                users: 1,
              },
            };

            if (!old) return [optimisticList];
            return [...old, optimisticList];
          }
        );

        return { previousLists };
      },
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo crear la lista :( ${err.message}`);

        queryClient.setQueryData(
          GET_ALL_LISTS_QUERY_KEY,
          context?.previousLists
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(GET_ALL_LISTS_QUERY_KEY);
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    openModal();
  };

  const handlePrivateListCreation = () => {
    createList({ name });
    closeModal();
  };

  const handleSharedListCreation = () => {
    // TODO: add users
    // createList({ name });
    closeModal();
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) =>
    setName(e.currentTarget.value);

  return (
    <>
      <VisibilityConfigModal
        handlePrivateListCreation={handlePrivateListCreation}
        handleSharedListCreation={handleSharedListCreation}
        closeModal={closeModal}
        listName={name}
        isOpen={isOpen}
      />

      <BottomForm
        buttonClassName="bg-emerald-400 hover:bg-emerald-500"
        inputName="name"
        loading={createListLoading}
        onInput={handleInput}
        onSubmit={handleSubmit}
        placeholder="Agrega una lista!"
        value={name}
      />
    </>
  );
};

export default React.memo(CreateList);

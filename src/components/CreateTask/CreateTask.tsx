import { Task } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, FormEvent } from "react";
import { trpc } from "../../utils/trpc";

const GET_ALL_FROM_TODAY_QUERY_KEY = [["tasks", "getAllFromToday"]];

const CreateTask = () => {
  // TODO: use react hook form
  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createTask, isLoading: createTaskLoading } =
    trpc.tasks.create.useMutation({
      onMutate: async ({ text }) => {
        await queryClient.cancelQueries(GET_ALL_FROM_TODAY_QUERY_KEY);

        const previousTasks = queryClient.getQueriesData([]);

        queryClient.setQueryData(
          GET_ALL_FROM_TODAY_QUERY_KEY,
          (old: Task[] | undefined) => {
            const optimisticTask: Task = {
              text,

              // TODO: fix this
              id: "new-task",
              priority: 99999999999999,
              deadline: null,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            console.log({ old });

            if (!old) return [optimisticTask];
            return [optimisticTask, ...old];
          }
        );

        return { previousTasks };
      },
      onError: (err, _, context) => {
        // TODO: do something better with the error
        window.alert(`No se pudo crear la tarea :( ${err.message}`);

        queryClient.setQueryData(
          GET_ALL_FROM_TODAY_QUERY_KEY,
          context?.previousTasks
        );
      },
      onSettled: (task) => {
        queryClient.invalidateQueries(GET_ALL_FROM_TODAY_QUERY_KEY);
        if (task) setText("");
      },
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createTask({ text });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        value={text}
        onInput={(e) => setText(e.currentTarget.value)}
        placeholder="Something to do today?"
        name="text"
        type="text"
      />
      <button disabled={createTaskLoading}>Add task</button>
    </form>
  );
};

export default CreateTask;

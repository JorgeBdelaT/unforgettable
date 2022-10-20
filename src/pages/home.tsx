import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Record } from "@prisma/client";

const queryKey = [["records", "getAll"]];

const Home: NextPage = () => {
  const [content, setContent] = useState("");
  const [deadlineStr, setDeadlineStr] = useState<string | undefined>(undefined);

  const queryClient = useQueryClient();

  const {
    data: records,
    isLoading: recordsLoading,
    isError: recordsError,
  } = trpc.records.getAll.useQuery();

  const {
    mutate: createRecord,
    isLoading: createRecordLoading,
    isError: createRecordError,
  } = trpc.records.create.useMutation({
    onMutate: async ({ content, deadline }) => {
      await queryClient.cancelQueries(queryKey);
      const previousRecords = queryClient.getQueriesData([]);

      queryClient.setQueryData(queryKey, (old: Record[] | undefined) => {
        const optimisticRecord: Record = {
          id: "new-record",
          content,
          completed: false,
          deadline,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (!old) return [optimisticRecord];
        return [...old, optimisticRecord];
      });

      return { previousRecords };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["records", "getAll"], context?.previousRecords);
    },
    onSettled: (record) => {
      queryClient.invalidateQueries(queryKey);
      if (record) {
        setContent("");
        setDeadlineStr(undefined);
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    createRecord({
      content,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
    });
  };

  const hasNoRecords = !records?.length && !recordsLoading;

  return (
    <>
      <Head>
        <title>Unforgettable</title>
        <meta name="description" content="An app to remember everything" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1>Records</h1>
        {recordsLoading && <p>Loading records...</p>}
        {hasNoRecords && <p>no records :/</p>}
        <ul>
          {records?.map(({ id, content }) => (
            <li key={id}>{content}</li>
          ))}
        </ul>

        <form onSubmit={handleSubmit}>
          <label htmlFor="content">
            <input
              required
              value={content}
              onInput={(e) => setContent(e.currentTarget.value)}
              placeholder="Something to remember?"
              name="content"
              type="text"
            />
          </label>

          <label>
            <input
              name="deadline"
              type="date"
              value={deadlineStr}
              onChange={(e) => setDeadlineStr(e.currentTarget.value)}
            />
          </label>
          <button>Add record</button>
        </form>
      </main>
    </>
  );
};

export default Home;

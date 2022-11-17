import { User } from "@prisma/client";
import useCreateListStore from "../../../stores/CreateListStore";
import { trpc } from "../../../utils/trpc";
import Autocomplete from "../../Autocomplete";

// TODO: refactor
const SelectSharedWith = () => {
  const sharedWith = useCreateListStore((state) => state.sharedWith);
  const setSharedWith = useCreateListStore((state) => state.setSharedWith);
  const removeSelectedUser = useCreateListStore(
    (state) => state.removeSelectedUser
  );

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
  } = trpc.users.getAll.useQuery();

  return (
    <Autocomplete<User>
      disabled={usersLoading || usersError}
      options={users}
      setSelected={(selectedUsers) => setSharedWith(selectedUsers)}
      selected={sharedWith}
      filterFn={(query) => (user) =>
        !!(
          user.name &&
          user.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        ) ||
        !!(
          user.email &&
          user.email
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )}
      renderSelectedOptions={(selectedUsers) => (
        <ul className="my-2 flex w-full flex-wrap gap-1">
          {selectedUsers.map((option) => (
            <li key={option.id}>
              <button
                className="cursor-pointer rounded-md bg-gray-600 p-2 text-xs font-extralight text-white hover:bg-gray-500"
                onClick={() => removeSelectedUser(option.id)}
              >
                {option.name || option.email || "Anónimo"}
              </button>
            </li>
          ))}
        </ul>
      )}
      getDisplayText={(user) => user.name || user.email || "Anónimo"}
      getOptionKey={(option) => option.id}
    />
  );
};

export default SelectSharedWith;

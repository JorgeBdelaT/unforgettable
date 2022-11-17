import { ChangeEvent, Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface AutocompleteProps<OptionType> {
  disabled?: boolean;
  filterFn: (query: string) => (option: OptionType) => boolean;
  getDisplayText: (option: OptionType) => string;
  getOptionKey: (option: OptionType) => string | number;
  options: OptionType[];
  renderSelectedOptions: (options: OptionType[]) => React.ReactNode;
  selected: OptionType[];
  setSelected: (selectedOptions: OptionType[]) => void;
}

const Autocomplete = <OptionType,>({
  disabled = false,
  filterFn,
  getDisplayText,
  getOptionKey,
  options,
  renderSelectedOptions,
  selected,
  setSelected,
}: React.PropsWithChildren<AutocompleteProps<OptionType>>) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === "" ? options : options.filter(filterFn(query));

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <Combobox
      multiple
      value={selected}
      disabled={disabled}
      onChange={setSelected}
    >
      <div className="relative mt-1">
        {selected.length > 0 && renderSelectedOptions(selected)}
        <div
          className={`relative w-full cursor-default overflow-hidden rounded-sm bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ${
            disabled ? "bg-gray-400" : ""
          }`}
        >
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            onChange={handleInputChange}
            placeholder={disabled ? "........." : ""}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-400">
                Sin resultados...
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={getOptionKey(option)}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-emerald-400 text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {getDisplayText(option)}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-emerald-800"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default Autocomplete;

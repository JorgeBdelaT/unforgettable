import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import { FC, FormEvent, FormEventHandler } from "react";
import { BOTTOM_FORM_HEIGHT } from "../../constants";

interface BottomFormProps {
  buttonClassName?: string;
  inputClassName?: string;
  inputName: string;
  loading: boolean;
  onInput: FormEventHandler<HTMLInputElement>;
  onSubmit: (e: FormEvent) => void;
  placeholder: string;
  value: string;
}

const BottomForm: FC<BottomFormProps> = ({
  buttonClassName = "",
  inputClassName = "",
  inputName,
  loading,
  onInput,
  onSubmit,
  placeholder,
  value,
}) => {
  return (
    <form
      className="mt-1 flex items-center justify-center gap-2 px-2"
      autoComplete="off"
      onSubmit={onSubmit}
      style={{ height: BOTTOM_FORM_HEIGHT }}
    >
      <input
        required
        className={`h-12 w-full rounded px-4 text-neutral-900 ${inputClassName}`}
        value={value}
        // TODO: revisar por que no onChange
        onInput={onInput}
        placeholder={placeholder}
        name={inputName}
        type="text"
      />
      <button
        className={`flex h-12 w-12 items-center justify-center rounded bg-indigo-500 text-white hover:bg-indigo-600 disabled:pointer-events-none disabled:animate-pulse disabled:bg-gray-400 ${buttonClassName}`}
        disabled={loading}
      >
        {loading ? (
          <ArrowPathIcon className="h-6 w-6 animate-spin" />
        ) : (
          <PlusIcon className="h-6 w-6" />
        )}
      </button>
    </form>
  );
};

export default BottomForm;

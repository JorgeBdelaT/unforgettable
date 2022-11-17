import { useState } from "react";
import Modal from "../../Modal";
import useCreateListStore from "../../../stores/CreateListStore";
import SelectSharedWith from "./SelectSharedWith";

interface VisibilityConfigModalProps {
  closeModal: () => void;
  handleListCreation: () => void;
  isOpen: boolean;
}

const VisibilityConfigModal: React.FC<VisibilityConfigModalProps> = ({
  closeModal,
  handleListCreation,
  isOpen,
}) => {
  const sharedWith = useCreateListStore((state) => state.sharedWith);
  const setSharedWith = useCreateListStore((state) => state.setSharedWith);
  const listName = useCreateListStore((state) => state.name);

  const [isShared, setIsShared] = useState(false);

  const handleSharedListClick = () => setIsShared(true);

  const handleBtnClick = (shouldCloseModal?: boolean) => {
    setIsShared(false);
    setSharedWith([]);
    shouldCloseModal && closeModal();
  };

  const handleBack = () => handleBtnClick(false);
  const handleClose = () => handleBtnClick(true);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="flex flex-col">
      <h3 className="text-lg font-light leading-6">
        {!isShared ? "Configura la visibilidad de " : "A quién agregarás a "}

        <span className="font-medium text-emerald-200 ">&ldquo;</span>
        <span className="font-medium capitalize text-emerald-400 ">
          {listName}
        </span>
        <span className="font-medium text-emerald-200 ">&rdquo;</span>

        {isShared && "?"}
      </h3>

      {!isShared ? (
        <p className="text-sm text-slate-400">
          Puedes agregar mas miembros después. No es necesario que lo hagas
          ahora!
        </p>
      ) : (
        <SelectSharedWith />
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        {!isShared ? (
          <>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 py-1 px-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={handleSharedListClick}
            >
              Compartida
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 py-1 px-2 text-sm font-medium text-gray-600 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={handleListCreation}
            >
              Privada
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 py-1 px-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-transparent disabled:text-slate-600"
              onClick={handleListCreation}
              disabled={sharedWith.length < 1}
            >
              Listo
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 py-1 px-2 text-sm font-medium text-gray-600 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={handleBack}
            >
              Volver
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
export default VisibilityConfigModal;

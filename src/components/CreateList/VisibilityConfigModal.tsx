import Modal from "../Modal";

interface VisibilityConfigModalProps {
  listName: string;
  isOpen: boolean;
  handlePrivateListCreation: () => void;
  handleSharedListCreation: () => void;
  closeModal: () => void;
}

const VisibilityConfigModal: React.FC<VisibilityConfigModalProps> = ({
  listName,
  isOpen,
  handlePrivateListCreation,
  handleSharedListCreation,
  closeModal,
}) => (
  <Modal isOpen={isOpen} onClose={closeModal}>
    <h3 className="text-lg font-light leading-6">
      Configura la visibilidad de{" "}
      <span className="font-medium text-emerald-200 ">&ldquo;</span>
      <span className="font-medium capitalize text-emerald-400 ">
        {listName}
      </span>
      <span className="font-medium text-emerald-200 ">&rdquo;</span>
    </h3>

    <div className="mt-2">
      <p className="text-sm text-slate-400">
        Puedes agregar mas miembros después. No es necesario que lo hagas ahora!
      </p>
    </div>

    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        type="button"
        className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onClick={handleSharedListCreation}
        disabled
      >
        Compartida
      </button>

      <button
        type="button"
        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onClick={handlePrivateListCreation}
      >
        Privada
      </button>
    </div>
  </Modal>
);

export default VisibilityConfigModal;

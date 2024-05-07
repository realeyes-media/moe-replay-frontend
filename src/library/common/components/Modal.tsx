import { FunctionComponent, ReactNode } from 'react';

interface ModalProps {
  children?: ReactNode;
  close?: () => void;
}

const Modal: FunctionComponent<ModalProps> = ({
  children,
  close,
}: ModalProps) => (
  <div className="fixed z-10 inset-0">
    <div className="flex items-end justify-center min-h-screen text-center px-1 sm:px-12 py-1">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75" />
      </div>

      {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
      <span
        className="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >
        &#8203;
      </span>
      <div
        className="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all my-auto align-middle p-6 w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {children}
      </div>
    </div>
  </div>
);

export default Modal;

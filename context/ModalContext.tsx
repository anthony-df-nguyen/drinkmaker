"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * The properties of the ModalContext.
 */
interface ModalContextProps {
  /**
   * Function to show the modal with the specified content.
   * @param content - The content to be displayed in the modal.
   */
  showModal: (content: ReactNode) => void;
  /**
   * Function to hide the modal.
   */
  hideModal: () => void;
}

/**
 * The ModalContext.
 */
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

/**
 * Hook to access the ModalContext.
 * @returns The ModalContext.
 * @throws Error if used outside of a ModalProvider.
 */
export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

/**
 * The properties of the ModalProvider.
 */
interface ModalProviderProps {
  /**
   * The children components.
   */
  children: ReactNode;
}

/**
 * The ModalProvider component.
 * @param children - The children components.
 * @returns The ModalProvider component.
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (modalContent) {
      // Disable background scroll
      document.body.classList.add("no-scroll");
    } else {
      // Enable background scroll
      document.body.classList.remove("no-scroll");
    }

    // Clean up on component unmount
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [modalContent]);

  /**
   * Function to show the modal with the specified content.
   * @param content - The content to be displayed in the modal.
   */
  const showModal = (content: ReactNode) => setModalContent(content);

  /**
   * Function to hide the modal.
   */
  const hideModal = () => setModalContent(null);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            {modalContent}
            <div
              onClick={hideModal}
              className="h-6 w-6 absolute top-2 right-2 text-black hover:text-gray-700 cursor-pointer"
            >
              <XMarkIcon /> 
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
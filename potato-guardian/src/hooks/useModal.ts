import { useState, useCallback } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  selectedItem: string | null;
  openModal: (item: string) => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState = false): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const openModal = useCallback((item: string) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      setSelectedItem(null);
    }
  }, [isOpen]);

  return {
    isOpen,
    selectedItem,
    openModal,
    closeModal,
    toggleModal,
  };
};

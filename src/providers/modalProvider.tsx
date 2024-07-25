"use client";


import ZtModal, { ZtModalPropsT } from "@/components/ZtModal";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

interface ModalProviderProps {
  children: React.ReactNode;
}

const initialState: ZtModalPropsT = {
  content: null,
  open: false,
  onOpenChange: () => {},
};

interface ModalContextI {
  handleState: (payload: Partial<ZtModalPropsT>) => void;
  clearState: () => void;
}

export const ModalContext = createContext<ModalContextI>({
  handleState: () => {},
  clearState: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [state, setState] = useState<ZtModalPropsT>(initialState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleState = useCallback((payload: Partial<ZtModalPropsT>) => {
    setState((prev) => ({ ...prev, ...payload }));
  }, []);

  const clearState = useCallback(() => {
    handleState({ open: false });
  }, [handleState]);

  const contextValue = useMemo(
    () => ({
      handleState,
      clearState,
    }),
    [handleState, clearState]
  );

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <ZtModal
        {...state}
        onOpenChange={(open) => {
          if (!open) clearState();
          state.onOpenChange(open);
        }}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the ModalProvider");
  }
  return context;
};

export default ModalProvider;

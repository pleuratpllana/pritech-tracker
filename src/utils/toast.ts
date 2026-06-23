type ToastListener = (message: string) => void;

const listeners = new Set<ToastListener>();

export const subscribeToToast = (listener: ToastListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const showToast = (message: string) => {
  listeners.forEach((listener) => listener(message));
};

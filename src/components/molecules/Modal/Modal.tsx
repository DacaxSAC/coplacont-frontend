import React, { useEffect } from "react";
import styles from "./Modal.module.scss";
import { Button, Text } from "@/components/atoms";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  description?: string | React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  children,
}) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        {(title || description) && (
          <div className={styles.header}>
            <div className={styles.titleContainer}>
              {title && (
                <Text as="h2" color="neutral-primary" size="2xl" >
                  {title}
                </Text>
              )}
              {description && (
                <Text
                  as="p"
                  className={styles.description}
                  color="neutral-secondary"
                >
                  {description}
                </Text>
              )}
            </div>
            <button
              className={styles.closeButton}
              aria-label="Cerrar"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        )}

        <div className={styles.content}>{children}</div>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

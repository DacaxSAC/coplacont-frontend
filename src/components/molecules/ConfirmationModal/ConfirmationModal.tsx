import React from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '@/components/atoms';
import styles from './ConfirmationModal.module.scss';

/**
 * ConfirmationModal component props interface
 */
export interface ConfirmationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Function to confirm the action */
  onConfirm: () => void;
  /** Modal title */
  title: string;
  /** Confirmation message */
  message: string | React.ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  /** Whether the action is loading */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable ConfirmationModal component for user confirmations
 * @param props - ConfirmationModal component props
 * @returns JSX element
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'primary',
  loading = false,
  className = ''
}) => {
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const footer = (
    <div className={styles.buttonGroup}>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
        size="medium"
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={handleConfirm}
        disabled={loading}
        size="medium"
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={message}
      footer={footer}
      buttonText={cancelText}
      loading={loading}
    />
  );
};

export default ConfirmationModal;
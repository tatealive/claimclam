import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmColor: 'danger' as const,
          iconColor: 'text-red-500',
          icon: <ExclamationTriangleIcon className="h-6 w-6" />
        };
      case 'warning':
        return {
          confirmColor: 'warning' as const,
          iconColor: 'text-yellow-500',
          icon: <ExclamationTriangleIcon className="h-6 w-6" />
        };
      default:
        return {
          confirmColor: 'primary' as const,
          iconColor: 'text-blue-500',
          icon: <ExclamationTriangleIcon className="h-6 w-6" />
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className={styles.iconColor}>
              {styles.icon}
            </div>
            <span>{title}</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600">{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            {cancelText}
          </Button>
          <Button color={styles.confirmColor} onPress={handleConfirm}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

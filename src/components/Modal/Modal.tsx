/**
 * Modal window API — тем же поведением и разметкой, что и `Dialog`,
 * но с именованием Modal* для кода и дизайн-доков, где ищут «modal».
 */

export type {
  DialogProps as ModalProps,
  DialogContentProps as ModalContentProps,
} from '../Dialog/Dialog';

export {
  Dialog as Modal,
  DialogOverlay as ModalOverlay,
  DialogContent as ModalContent,
  DialogHeader as ModalHeader,
  DialogFooter as ModalFooter,
  DialogTitle as ModalTitle,
  DialogDescription as ModalDescription,
} from '../Dialog/Dialog';

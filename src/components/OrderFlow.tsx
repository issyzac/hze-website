import { useIsMobile } from '../hooks/useIsMobile';
import OrderWizard from './OrderWizard';
import MobileOrderFlow from './MobileOrderFlow';

interface OrderFlowProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
}

export default function OrderFlow({ isOpen, onClose, initialProductId }: OrderFlowProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileOrderFlow isOpen={isOpen} onClose={onClose} initialProductId={initialProductId} />;
  }

  return <OrderWizard isOpen={isOpen} onClose={onClose} initialProductId={initialProductId} />;
}

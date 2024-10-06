import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "../globals/modal";
import Image from "next/image";

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  image: string;
}

const ProofModal: React.FC<ProofModalProps> = ({
  isOpen,
  onClose,
  image,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Proof of Payment"
      description="View and verify the submitted proof of payment for your order. Ensure that the provided image matches your transaction details before proceeding."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-center relative w-full h-[300px]">
        <Image
          src={image}
          alt="Proof of payment"
          fill
          className="w-full h-full object-cover"
        />
      </div>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="default" onClick={onClose}>
          Okay
        </Button>
      </div>
    </Modal>
  );
};

export default ProofModal;

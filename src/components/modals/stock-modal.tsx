import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "../globals/modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onConfirm: (newStock: number) => void; // Updated to accept stock value
}

const StockModal: React.FC<StockModalProps> = ({
  isOpen,
  onClose,
  loading,
  onConfirm,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [newStock, setNewStock] = useState<number | undefined>(undefined); // State for new stock

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal title="Add Stock" description="Manage your inventory effortlessly with our stock add feature." isOpen={isOpen} onClose={onClose}>
      <div className="space-y-1">
        <Label>Stock</Label>
        <Input 
          type="number" 
          placeholder="Enter stock" 
          value={newStock} 
          onChange={(e) => setNewStock(Number(e.target.value))}
        />
      </div>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          disabled={loading || newStock === undefined}
          size="sm" 
          variant="default" 
          onClick={() => {
            if (newStock !== undefined) {
              onConfirm(newStock);
            }
          }}
        >
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default StockModal;

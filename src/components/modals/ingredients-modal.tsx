import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "../globals/modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { addIngredients } from "@/actions/menu";
import { toast } from "sonner";

interface IngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IngredientsModal: React.FC<IngredientsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [stock, setStock] = useState<number | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onConfirm = async () => {
    setLoading(true);
    try {
      // Simulate adding a new ingredient
      console.log("Adding new ingredient:", { name, stock });
      const response = await addIngredients(stock ?? 0, name ?? "");
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.success);
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add ingredient:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Add Ingredients"
      description="Manage your inventory effortlessly with our stock add feature."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-1">
        <Label>Name</Label>
        <Input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1 mt-3">
        <Label>Stock</Label>
        <Input
          type="number"
          placeholder="Enter stock"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </div>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          size="sm"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={
            loading ||
            stock === undefined ||
            name === undefined ||
            name.trim() === ""
          }
          size="sm"
          variant="default"
          onClick={onConfirm}
        >
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default IngredientsModal;

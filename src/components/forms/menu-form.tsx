/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader, Loader2, PlusCircle } from "lucide-react";
import { Flavors, Menus, Variants } from "@prisma/client";
import AlertModal from "../globals/alert-modal";
import Heading from "../globals/heading";
import { MenuFormValidation } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/lib/constants";
import { createCatergory } from "../../actions/category";
import { createMenu, deleteMenu, deleteVariant } from "@/actions/menu";
import { Form } from "../ui/form";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { createFlavor } from "@/actions/flavors";

interface MenuFormWithVariantsAndFlavorsProps extends Menus {
  flavors: Flavors[];
  variants: Variants[];
}

interface MenuFormProps {
  initialData: MenuFormWithVariantsAndFlavorsProps | null;
  categories: { label: string; value: string }[];
  flavors: { label: string; value: string }[];
}

const MenuForm: React.FC<MenuFormProps> = ({
  initialData,
  categories,
  flavors,
}) => {
  const [open, setOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const [variants, setVariants] = useState<
    { name: string; price: number; id?: string }[]
  >([{ name: "", price: 0, id: "" }]);

  const addVariant = () => {
    setVariants([...variants, { name: "", price: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const title = initialData ? "Edit Menu" : "Add Menu";
  const description = initialData
    ? "Make sure to click save changes after you update the menu."
    : "Please fill the required fields to add a new menu.";
  const action = initialData ? "Save Changes" : "Save Menu";
  const form = useForm<z.infer<typeof MenuFormValidation>>({
    resolver: zodResolver(MenuFormValidation),
    defaultValues: initialData
      ? {
          ...initialData,
          category: initialData.categoryId,
          imageUrl: initialData.image,
          flavors: initialData.flavors.map((item) => item.id),
          variants: initialData.variants.map((item) => ({
            name: item.name,
            price: item.price,
            id: item.id,
          })),
        }
      : {
          name: "",
          category: "",
          description: "",
          imageUrl: "",
          stocks: 0,
          featured: "No",
          flavors: [],
          variants: [{ name: "", price: 0 }],
        },
  });

  useEffect(() => {
    if (initialData) {
      // Ensure initialData.variants is an array and has the expected structure
      setIsLoading(true);
      // Map the initialData variants to match your form's structure
      const initialVariants = initialData.variants.map((item) => ({
        name: item.name,
        price: item.price,
        id: item.id,
      }));

      // Update state and form with the initial data
      setVariants(initialVariants);

      form.reset({
        ...form.getValues(),
        variants: initialVariants,
      });

      setIsLoading(false);
    }
  }, [initialData, form]);

  useEffect(() => {
    // @ts-ignore
    form.setValue("variants", variants);
  }, [variants, form]);

  async function onSubmit(values: z.infer<typeof MenuFormValidation>) {
    setIsLoading(true);
    createMenu(values)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/admin/menus");
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const onDelete = async () => {
    setIsLoading(true);
    deleteMenu(initialData?.id as string)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.push("/admin/menus");
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDeleteVariant = async () => {
    if (selectedVariantId) {
      setIsLoading(true);
      deleteVariant(selectedVariantId)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            router.refresh();
          } else {
            toast.error(data.error);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setDeleteModal(false);
        });
    }
  };

  const onCreate = async (category: string) => {
    createCatergory(category)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVariantChange = (
    index: number,
    key: keyof { name: string; price: number },
    value: string
  ) => {
    const newVariants = [...variants];
    if (key === "price") {
      newVariants[index][key] = parseFloat(value);
    } else {
      newVariants[index][key] = value;
    }
    setVariants(newVariants);
  };

  const onCreateFlavor = async (flavor: string) => {
    createFlavor(flavor)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.refresh();
        } else {
          toast.error(data.error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isLoading}
        onConfirm={onDelete}
      />
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        loading={isLoading}
        onConfirm={onDeleteVariant}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            <div className="md:flex hidden items-center space-x-2">
              {initialData && (
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  Discard
                </Button>
              )}
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading && <Loader className="animate-spin w-4 h-4 mr-2" />}
                {action}
              </Button>
            </div>
          </div>
          <div className="grid mt-3 gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Menu Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="grid gap-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Enter Menu Name"
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <CustomFormField
                        onCreate={(value) => onCreate(value)}
                        control={form.control}
                        fieldType={FormFieldType.DYNAMICSELECT}
                        label="Category"
                        name="category"
                        placeholder="Select Menu Category"
                        dynamicOptions={categories}
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        label="Description"
                        name="description"
                        placeholder="Enter Menu Description"
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Menu Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <Table>
                      <TableBody>
                        {variants.map((variant, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-[50%]">
                              <Select
                                disabled={isLoading}
                                defaultValue={variant.name}
                                onValueChange={(value: string) =>
                                  handleVariantChange(index, "name", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Variant Name" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="12 oz">12 oz</SelectItem>
                                  <SelectItem value="16 oz">16 oz</SelectItem>
                                  <SelectItem value="22 oz">22 oz</SelectItem>
                                  <SelectItem value="Food">Food</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="w-[50%]">
                              <Input
                                type="number"
                                placeholder="Enter Variant Price"
                                value={variant.price}
                                onChange={(e) =>
                                  handleVariantChange(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                                min={0}
                              />
                            </TableCell>
                            <TableCell className="flex items-center gap-4">
                              {initialData && (
                                <Button
                                  className="w-full"
                                  variant="destructive"
                                  type="button"
                                  disabled={!variant.id}
                                  onClick={() => {
                                    setSelectedVariantId(variant.id || ""); // Set the variant ID
                                    setDeleteModal(true); // Open the delete modal
                                  }}
                                >
                                  Delete Variant
                                </Button>
                              )}
                              <Button
                                className="w-full"
                                variant="destructive"
                                type="button"
                                onClick={() => removeVariant(index)}
                              >
                                Remove Column
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button
                    onClick={addVariant}
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Another Column
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Other Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="grid gap-3">
                      <CustomFormField
                        onCreate={(value) => onCreateFlavor(value)}
                        control={form.control}
                        fieldType={FormFieldType.DYNAMICSELECTARRAY}
                        label="Flavors"
                        name="flavors"
                        placeholder="Select Menu Flavors"
                        dynamicOptions={flavors}
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        label="Stocks"
                        name="stocks"
                        placeholder="Enter Stocks"
                        isRequired={true}
                        type="number"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.RADIO}
                        label="Featured?"
                        name="featured"
                        options={["Yes", "No"]}
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Menu Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="grid-gap-3">
                      <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.DROP_ZONE}
                        label="Image"
                        name="imageUrl"
                        isRequired={true}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mx-auto mt-3 grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-2 md:hidden">
              {initialData && (
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  Discard
                </Button>
              )}
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading && <Loader className="animate-spin w-4 h-4 mr-2" />}
                {action}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default MenuForm;

import { clsx, type ClassValue } from "clsx";
import { ErrorCode, FileRejection } from "react-dropzone";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleDropRejected = (
  rejectedFiles: FileRejection[],
  maxFiles: number
) => {
  let errorMsg = "";

  rejectedFiles.forEach(({ file, errors }) => {
    if (errors.some((error) => error.code === ErrorCode.FileTooLarge)) {
      errorMsg += `${file.name} is too large. `;
    }
    if (errors.some((error) => error.code === ErrorCode.FileInvalidType)) {
      errorMsg += `${file.name} is not a valid file type. `;
    }
    if (errors.some((error) => error.code === ErrorCode.TooManyFiles)) {
      errorMsg =
        maxFiles === 1
          ? `You can only upload one file. `
          : `You can only upload ${maxFiles} files. `;
    }
  });

  return errorMsg.trim();
};

export const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} bytes`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "PHP";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "PHP", notation = "compact" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Disable compact notation for prices above a certain threshold, like 1000
  const finalNotation = numericPrice >= 1000 ? "standard" : notation;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: finalNotation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function parseAddress(address: string) {
  const addressParts = address.split(", ").map((part) => part.trim());

  // Check if we have at least four parts
  if (addressParts.length < 4) {
    return {
      houseNumber: "",
      region: "",
      province: "",
      municipality: "",
      barangay: "",
    };
  }

  const [barangay, municipality, province, region] = addressParts.slice(-4);
  const houseNumber = addressParts.slice(0, -4).join(" ");

  return {
    houseNumber,
    region,
    province,
    municipality,
    barangay,
  };
}

'use client';

import { IMAGE_FILE_SIZE } from "@/app/global";
import { toast } from "react-toastify";

export async function validateClientImage(file: File) {

  // MIME must be image/*
  if (!file.type.startsWith("image/")) {
    toast.error("Only image files are allowed");
    throw new Error("Only image files are allowed");
  }


  if (file.size > IMAGE_FILE_SIZE) {
    toast.error("Image size exceeds 1MB limit");
    throw new Error("Image size exceeds 1MB limit");
  }

  // Validate if image is readable (not corrupted)
  const img = new Image();

  return new Promise<void>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      toast.error("Invalid or corrupted image file");
      reject(new Error("Invalid or corrupted image file"));
    };

    img.src = objectUrl;
  });
}

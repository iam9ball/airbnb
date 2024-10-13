"use client";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetOptions,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  let cloudinary: {
    createUploadWidget: (
      options: CloudinaryUploadWidgetOptions,
      callback: (
        error: Error | null,
        result: CloudinaryUploadWidgetResults
      ) => void
    ) => CloudinaryUploadWidgetOptions;
  };
}

interface ImageUploadProps {
  onChange: (value: string | CloudinaryUploadWidgetInfo | undefined) => void;
  value: string;
}
export default function ImageUpload({ onChange, value }: ImageUploadProps) {
  const handleUpload = useCallback(
    (result: CloudinaryUploadWidgetResults) => {
      if (result.event !== "success") return;

      const info = result.info as { secure_url: string };
      onChange(info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset="airbnb"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to open</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="upload"
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

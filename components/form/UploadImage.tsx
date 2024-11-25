import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadCardProps {
  onImageUpload: (imageData: string | null) => void;
}

export default function ImageUploadCard({
  onImageUpload,
}: ImageUploadCardProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState(false);

  const handleImageUpload: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageSrc(result);
        setIsUploaded(true);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <div className="relative">
        {imageSrc && (
          <Image
            priority
            src={imageSrc}
            width={256}
            height={256}
            alt="Uploaded Hero"
            className="rounded-md object-cover w-full h-64"
          />
        )}
      </div>
      {!isUploaded && (
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={handleImageUpload} />
        </div>
      )}
    </div>
  );
}

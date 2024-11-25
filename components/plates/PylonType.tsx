import Image from "next/image";
import { useMemo } from "react";

interface PlateTypeProps {
  pylon: string;
}

// Mapping for pylons with associated image paths and page numbers
const pylonInfoMap: Record<string, { page: string; imgSrc: string }> = {
  type1: { page: "15", imgSrc: "/images/general1.jpg" },
  type2: { page: "16", imgSrc: "/images/general2.jpg" },
  type3: { page: "17", imgSrc: "/images/general3.jpg" },
  // Add additional pylon mappings as needed
};

function PylonImage({
  pylon,
  page,
  imgSrc,
}: {
  pylon: string;
  page: string;
  imgSrc: string;
}) {
  return (
    <div className="flex flex-col justify-start">
      <p className="italic text-muted-foreground text-sm">
        ELIA DG page {page}
      </p>
      <Image
        priority={false}
        src={imgSrc}
        alt={pylon}
        className="rounded-md"
        width={512}
        height={512}
      />
    </div>
  );
}

export default function PylonType({ pylon }: PlateTypeProps) {
  // Normalize the pylon identifier

  const normalizedPylon = useMemo(
    () => pylon?.toLowerCase().trim().replace(/\s/g, ""),
    [pylon]
  );

  return (
    <div className="flex">
      <div className="flex flex-col">
        <p className="italic text-muted-foreground text-sm">ELIA DG page 09</p>
        {pylonInfoMap[normalizedPylon] ? (
          <Image
            src={`/images/${normalizedPylon}.jpg`}
            alt={pylon}
            className="rounded-md"
            width={256}
            height={256}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            Choose plate to preview correct measurements
          </p>
        )}
      </div>

      {pylonInfoMap[normalizedPylon] && (
        <PylonImage
          pylon={pylon}
          page={pylonInfoMap[normalizedPylon].page}
          imgSrc={pylonInfoMap[normalizedPylon].imgSrc}
        />
      )}
    </div>
  );
}

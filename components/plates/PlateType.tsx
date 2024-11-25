import Image from "next/image";
import { useMemo } from "react";

interface PlateTypeProps {
  plate: string;
}

// Define a mapping of plate identifiers to page numbers outside the component
const platePageMap: Record<string, string> = {
  plate1a: "115",
  plate1b: "115",
  plate1c: "115",
  plate2: "116",
  plate3: "116",
  plate4a: "116",
  plate4b: "116",
  plate5: "116",
  plate6a: "117",
  plate6b: "117",
  plate8: "120",
  cornerframe: "23-113",
  frontframe: "23-113",
  reinforcementtubes: "7",
  handrail: "132",
};

export default function PlateType({ plate }: PlateTypeProps) {
  // Memoize normalizedPlate to avoid recomputation on every render
  const normalizedPlate = useMemo(
    () => plate.toLowerCase().trim().replace(/\s/g, ""),
    [plate]
  );

  // Get the page number based on the normalized plate, defaulting to "2"
  const page = platePageMap[normalizedPlate];
  const isValidPlate = Boolean(platePageMap[normalizedPlate]);

  return (
    <div className="flex flex-col">
      <p className="italic text-muted-foreground text-sm">
        ELIA DG page {page}
      </p>
      {isValidPlate ? (
        <Image
          src={`/images/${normalizedPlate}.jpg`}
          alt={plate}
          className="rounded-md w-full h-64"
          width={512}
          height={512}
        />
      ) : (
        <p className="text-muted-foreground text-sm">
          Choose plate to preview correct measurements
        </p>
      )}
    </div>
  );
}

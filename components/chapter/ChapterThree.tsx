"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { MdClose } from "react-icons/md";

import { PlateRow, useAppStore } from "@/store/useAppStore";
import SelectForm from "../form/SelectForm";
import UploadImageCard from "../form/UploadImage";
import PlateType from "../plates/PlateType";
import InputForm from "../form/InputForm";
import { Label } from "../ui/label";

export function ChapterThree() {
  const siteData = useAppStore((state) => state.siteData);
  const updatePlateType = useAppStore((state) => state.updatePlateType);
  const plateOptions = useAppStore((state) => state.plateOptions);

  const [plateType, setPlateType] = React.useState<PlateRow[]>(
    siteData?.selectedPlates || []
  );
  React.useEffect(() => {
    setPlateType(siteData?.selectedPlates || []);
  }, [siteData]);
  const handlePlateTypeChange = (rowId: number, newValue: string) => {
    const defaultValues = plateOptions.find((op) => op.type === newValue);
    const updatedPlates = plateType.map((plate) => {
      if (plate.rowId !== rowId) return plate;

      // Base plate data
      const updatedPlate = {
        ...plate,
        plate: {
          ...plate.plate,
          type: newValue,
          quantity: defaultValues?.quantity || 0,
          price: defaultValues?.price || 0,
        },
      };

      // Add measurements based on plate type
      if (["plate 1a", "plate 1b", "plate 1c"].includes(newValue)) {
        updatedPlate.plateMeasure = "400x350x10";
        updatedPlate.pylonLegMeasure = "100x100x250";
        delete updatedPlate.tubeDiameter;
      } else if (newValue === "plate 2") {
        updatedPlate.plateMeasure = "400x350x10";
        // Remove pylonLegMeasure if it exists
        delete updatedPlate.pylonLegMeasure;
        delete updatedPlate.tubeDiameter;
      } else if (["cornerframe", "frontframe"].includes(newValue)) {
        updatedPlate.tubeDiameter = "101.1mm";
        // Remove other measurements if they exist
        delete updatedPlate.plateMeasure;
        delete updatedPlate.pylonLegMeasure;
      } else {
        // For other types, remove all measurements
        delete updatedPlate.plateMeasure;
        delete updatedPlate.pylonLegMeasure;
        delete updatedPlate.tubeDiameter;
      }

      return updatedPlate;
    });

    setPlateType(updatedPlates);
    updatePlateType(updatedPlates);
  };

  const handleAddRow = () => {
    const newRows = [
      ...plateType,
      {
        rowId: new Date().getTime(),
        plate: { type: "", quantity: 0, price: 0 },
        plateMeasure: "400x350x10",
        pylonLegMeasure: "100x100x250",
        tubeDiameter: "101.1mm",
      },
    ];
    setPlateType(newRows);
    updatePlateType(newRows);
  };

  const handleRemoveRow = (rowId: number) => {
    const newRows = plateType.filter((row) => row.rowId !== rowId);
    setPlateType(newRows);
    updatePlateType(newRows);
  };

  const checkPlateType = (type: string, validTypes: string[]) => {
    return validTypes.includes(type || "");
  };
  const getPlateVisibility = (plateType: string) => ({
    showPylonLegInput: checkPlateType(plateType, [
      "plate 1a",
      "plate 1b",
      "plate 1c",
    ]),
    showPlateInput: checkPlateType(plateType, [
      "plate 1a",
      "plate 1b",
      "plate 1c",
      "plate 2",
    ]),
    showTubeDiam: checkPlateType(plateType, ["cornerframe", "frontframe"]),
  });

  const handleImageUpload = (rowId: number, imageData: string | null) => {
    const updatedPlates = plateType.map((plate) =>
      plate.rowId === rowId
        ? {
            ...plate,
            uploadedImage: imageData || undefined,
          }
        : plate
    );
    setPlateType(updatedPlates);

    const cleanedPlates = updatedPlates.map(({ ...rest }) => rest);
    updatePlateType(cleanedPlates);
  };

  const handleInputChange = (
    rowId: number,
    field:
      | "pylonLegMeasure"
      | "plateMeasure"
      | "price"
      | "quantity"
      | "tubeDiameter",
    value: string | number
  ) => {
    const updatedPlates = plateType.map((plate) =>
      plate.rowId === rowId
        ? field === "quantity" || field === "price"
          ? { ...plate, plate: { ...plate.plate, [field]: +value || 0 } }
          : { ...plate, [field]: value }
        : plate
    );

    const cleanedPlates = updatedPlates.map(({ ...rest }) => rest);
    updatePlateType(cleanedPlates);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Plate Type</CardTitle>
        <CardDescription>
          Select the type of plate for the site.
        </CardDescription>
      </CardHeader>
      {plateType.map((pl) => {
        const { showPylonLegInput, showPlateInput, showTubeDiam } =
          getPlateVisibility(pl.plate.type);

        return (
          <CardContent
            key={pl.rowId}
            className="grid grid-cols-[1fr,250px,1fr,30px] gap-4 plate-row"
          >
            <UploadImageCard
              onImageUpload={(imageData) =>
                handleImageUpload(pl.rowId, imageData)
              }
            />

            <div className="flex flex-col gap-2">
              <SelectForm
                label="Plate type"
                id="plate-type"
                values={plateOptions.map((plate) => plate.type)}
                value={pl.plate.type}
                onValueChange={(val) => handlePlateTypeChange(pl.rowId, val)}
              />
              {showPylonLegInput && (
                <InputForm
                  name={`pylon-leg-measurement-${pl.rowId}`}
                  type="text"
                  label="Pylon Leg (LxLxH)mm"
                  value={pl.pylonLegMeasure || "100x100x250"}
                  onChange={(val) =>
                    handleInputChange(pl.rowId, "pylonLegMeasure", val)
                  }
                />
              )}
              {showTubeDiam && (
                <SelectForm
                  id={`tubediam-${pl.rowId}`}
                  label="Tube Diameter"
                  values={["88.9mm", "101.1mm"]}
                  defaultValue="101.1mm"
                  onValueChange={(val) =>
                    handleInputChange(pl.rowId, "tubeDiameter", val)
                  }
                />
              )}
              {showPlateInput && (
                <InputForm
                  name={`plate-measurement-${pl.rowId}`}
                  type="text"
                  label="Plate (HxWxD)mm"
                  value={pl.plateMeasure || "400x350x10"}
                  onChange={(val) =>
                    handleInputChange(pl.rowId, "plateMeasure", val)
                  }
                />
              )}
              {pl.plate.type === "other" && (
                <InputForm
                  name={`price-${pl.rowId}`}
                  type="number"
                  label="Price"
                  value={pl.plate.price.toString() || "0"}
                  onChange={(val) => handleInputChange(pl.rowId, "price", val)}
                />
              )}
              <InputForm
                name={`quantity-${pl.rowId}`}
                type="number"
                label="Quantity"
                value={pl.plate.quantity.toString() || "0"}
                onChange={(val) => handleInputChange(pl.rowId, "quantity", val)}
              />
            </div>
            {pl.plate.type !== "other" ? (
              <PlateType plate={pl.plate.type} />
            ) : (
              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Comments</Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  rows={5}
                />
              </div>
            )}
            <Button
              variant="ghost"
              className="flex justify-center items-center"
              onClick={() => handleRemoveRow(pl.rowId)}
              aria-label="remove"
            >
              <MdClose size={20} />
            </Button>
          </CardContent>
        );
      })}
      <CardFooter className="flex justify-between no-print">
        <Button onClick={handleAddRow}>Load More</Button>
      </CardFooter>
    </Card>
  );
}

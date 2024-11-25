"use client";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import InputForm from "../form/InputForm";
import { Site, useAppStore } from "@/store/useAppStore";
import SelectForm from "../form/SelectForm";
import CalculationsTable from "../table/CalculationsTable";

export function ChapterOne() {
  const { siteData, updateSiteField } = useAppStore();
  const [techConfig, setTechConfig] = React.useState(
    siteData?.techConfig || ""
  );

  React.useEffect(() => {
    setTechConfig(siteData?.techConfig || "");
  }, [siteData]);

  const handleInputChange = (field: keyof Site, value: string) => {
    updateSiteField(field, value);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Site Details</CardTitle>
        <CardDescription className="no-print">
          Fill in the details for the site.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex gap-2">
          <InputForm
            name="siteCode"
            label="Site Code"
            type="text"
            value={siteData?.siteCode || ""}
            onChange={(value) => handleInputChange("siteCode", value)}
          />
          <InputForm
            name="swapId"
            label="Swap Id"
            type="text"
            value={siteData?.swapId || ""}
            onChange={(value) => handleInputChange("swapId", value)}
          />
        </div>
        <SelectForm
          label="Tech config"
          id="tech-config"
          values={["lowcap", "lowcap+", "lowcap+14", "highcap", "highcap+"]}
          value={techConfig}
          onValueChange={(value) => {
            setTechConfig(value);
            handleInputChange("techConfig", value);
          }}
        />
        <InputForm
          name="address"
          label="Address"
          type="text"
          value={siteData?.address || ""}
          onChange={(value) => handleInputChange("address", value)}
        />
        <InputForm
          name="pylonCode"
          label="Pylon Code"
          type="text"
          value={siteData?.pylonCode || ""}
          onChange={(value) => handleInputChange("pylonCode", value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <CalculationsTable />
      </CardFooter>
    </Card>
  );
}

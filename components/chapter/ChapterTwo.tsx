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

import { useAppStore } from "@/store/useAppStore";
import SelectForm from "../form/SelectForm";
import PylonType from "../plates/PylonType";

export function ChapterTwo() {
  const { siteData, pylonTypes, updatePylonType } = useAppStore();
  const [pylonType, setPylonType] = React.useState(
    siteData?.selectedPylonType || ""
  );
  React.useEffect(() => {
    setPylonType(siteData?.selectedPylonType || "");
  }, [siteData]);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Pylon Type</CardTitle>
        <CardDescription>
          Select the type of pylon for the site.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-[300px,1fr] gap-4">
        <SelectForm
          label="Pylon type"
          id="pylon-type"
          values={pylonTypes.map((pylonType) => pylonType.type)}
          value={pylonType}
          onValueChange={(value) => updatePylonType(value)}
        />
        <PylonType pylon={pylonType} />
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button variant="outline">Cancel</Button> */}
        {/* <Button onClick={() => updatePylonType(pylonType)}>Deploy</Button> */}
      </CardFooter>
    </Card>
  );
}

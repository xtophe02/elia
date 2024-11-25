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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Site, useAppStore } from "@/store/useAppStore";
import { saveSite } from "@/utils/actions";

export function LoadSaveSite({
  initialSitesData,
}: {
  initialSitesData: Site[];
}) {
  const { siteData, setSiteData } = useAppStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load / Save Site</CardTitle>
        <CardDescription>
          Load an existing site or save the current site.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="framework">Load Site</Label>
          <Select
            onValueChange={(value) => {
              const site = initialSitesData.find(
                (site) => site.siteCode === value
              );
              if (site) {
                setSiteData(site);
              } else if (value === "new") {
                setSiteData({} as Site);
              }
            }}
          >
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="new">New</SelectItem>
              {initialSitesData.map((site) => (
                <SelectItem key={site.siteCode} value={site.siteCode}>
                  {site.siteCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            if (siteData) {
              saveSite(siteData);
            }
          }}
        >
          Save Site
        </Button>
        <Button onClick={() => window.print()}>Export PDF</Button>
      </CardFooter>
    </Card>
  );
}

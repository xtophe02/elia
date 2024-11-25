"use server";

import { Site } from "@/store/useAppStore";
import { saveSitesData, loadSitesData } from "@/utils/data-json";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loadSites() {
  const sites = await loadSitesData();
  return sites;
}

export async function saveSite(siteData: Site) {
  try {
    const existingSites = await loadSitesData();

    if (!Array.isArray(existingSites)) {
      throw new Error("Invalid sites data format");
    }

    const siteIndex = existingSites.findIndex(
      (site) => site.siteCode === siteData.siteCode
    );

    const updatedSites =
      siteIndex >= 0
        ? existingSites.map((site, index) =>
            index === siteIndex ? { ...site, ...siteData } : site
          )
        : [...existingSites, siteData];

    await saveSitesData(updatedSites);
    // return { success: true, message: "Site saved successfully" };
  } catch (error) {
    console.error("Error saving site:", error);
    throw new Error("Failed to save site data");
  }
  revalidatePath("/");

  redirect("/");
}

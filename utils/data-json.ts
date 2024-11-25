import { Site } from "@/store/useAppStore";
import { promises as fs } from "fs";

export async function loadSitesData(): Promise<Site[]> {
  try {
    const file = await fs.readFile(process.cwd() + "/data/sites.json", "utf8");

    // Handle empty file case
    if (!file.trim()) {
      return [];
    }

    const data = JSON.parse(file);

    // Ensure data is an array, if not return empty array
    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch (error) {
    // If file doesn't exist, create it with empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(process.cwd() + "/data/sites.json", "[]");
      return [];
    }

    console.error("Error loading sites data:", error);
    throw new Error(
      "Failed to load sites data. Please check if the file is properly formatted."
    );
  }
}

export async function saveSitesData(siteData: Site[]) {
  try {
    await fs.writeFile(
      process.cwd() + "/data/sites.json",
      JSON.stringify(siteData, null, 2)
    );
  } catch (error) {
    console.error("Error saving sites data:", error);
    throw new Error(
      "Failed to save sites data. Please check if the file exists and is properly formatted."
    );
  }
}

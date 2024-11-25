import fs from "fs/promises";
import path from "path";

export async function loadImageAsBase64(imagePath: string): Promise<string> {
  try {
    const fullPath = path.join(
      process.cwd(),
      "public",
      imagePath.replace(" ", "")
    );
    const imageBuffer = await fs.readFile(fullPath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = getMimeType(imagePath);
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error(`Error loading image: ${imagePath}`, error);
    throw error;
  }
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

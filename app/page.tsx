import { LoadSaveSite } from "@/components/chapter/LoadSaveSite";
import { ChapterOne } from "@/components/chapter/ChapterOne";
import { ChapterTwo } from "@/components/chapter/ChapterTwo";
import { ChapterThree } from "@/components/chapter/ChapterThree";
import { loadSites } from "@/utils/actions";

export default async function HomePage() {
  const initialSitesData = await loadSites();
  return (
    <div className="max-w-7xl mx-auto mt-4 space-y-4">
      <div className="no-print">
        <LoadSaveSite initialSitesData={initialSitesData} />
      </div>
      <div className="print-layout">
        <ChapterOne />
        <ChapterTwo />
      </div>
      <ChapterThree />
    </div>
  );
}

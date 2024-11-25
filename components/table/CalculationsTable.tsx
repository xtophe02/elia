import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/store/useAppStore";

import {
  FRAME_ADDITIONAL_COST,
  ADAPTER_COSTS,
  ADAPTER_PLATE_TYPES,
} from "@/store/constants";

export default function CalculationsTable() {
  const { siteData, calculateLumpSumPrice, calculateTotalPriceByItem } =
    useAppStore();

  const calculatePlateDetails = () => {
    if (!siteData.selectedPlates) return [];

    // Check if any adapter plates are selected
    const hasAdapterPlates = siteData.selectedPlates.some((sp) =>
      ADAPTER_PLATE_TYPES.includes(sp.plate.type)
    );

    return siteData.selectedPlates.map((sp) => {
      const { type, quantity, price } = sp.plate;

      // Only apply frame additional costs if no adapter plates are selected
      const additionalCost =
        !hasAdapterPlates && isFrameType(type)
          ? FRAME_ADDITIONAL_COST * quantity
          : 0;

      const adapterCost = calculateAdapterCost(type, quantity);
      const basePrice = price * quantity;
      const totalCost = basePrice + additionalCost + adapterCost;

      return {
        ...sp.plate,
        quantity,
        basePrice,
        additionalCost,
        adapterCost,
        totalCost,
      };
    });
  };

  const isFrameType = (type: string): boolean => {
    return ["frontframe", "cornerframe"].includes(type);
  };

  const calculateAdapterCost = (type: string, quantity: number): number => {
    const adapterPrice = ADAPTER_COSTS[type as keyof typeof ADAPTER_COSTS];
    return adapterPrice ? adapterPrice * quantity : 0;
  };

  const initialFee = 1500;
  const totalPriceByItem = calculateTotalPriceByItem();
  const lumpsum = calculateLumpSumPrice();

  return (
    <Table className="w-full">
      <TableCaption>
        <span className="font-bold">Estimated</span> calculations for total
        price per pylon <span className="underline">specific item</span>
        <span className="italic"> versus </span>
        pylon type <span className="underline">lump sum</span>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Base Price (€)</TableHead>
          <TableHead>
            Additional Cost (€)
            <span className="block text-xs font-normal text-gray-500">
              for dismantling frames
            </span>
          </TableHead>
          <TableHead>
            Adapter Cost (€)
            <span className="block text-xs font-normal text-gray-500">
              man hours to secure adjacent frames
            </span>
          </TableHead>
          <TableHead className="text-right">Total (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            Transport + Cleaning + ELIA specifications
          </TableCell>
          <TableCell>1</TableCell>
          <TableCell>{initialFee}</TableCell>
          <TableCell>0</TableCell>
          <TableCell>0</TableCell>
          <TableCell className="text-right font-semibold">
            {initialFee} €
          </TableCell>
        </TableRow>
        {calculatePlateDetails().map((pl, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{pl.type}</TableCell>
            <TableCell>{pl.quantity}</TableCell>
            <TableCell>{pl.price}</TableCell>
            <TableCell>{pl.additionalCost}</TableCell>
            <TableCell>{pl.adapterCost}</TableCell>
            <TableCell className="text-right font-semibold">
              {pl.totalCost} €
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="font-semibold text-right">
            <p>Total Price by Item:</p>
            <p>Lump sum pylon type {siteData.selectedPylonType}:</p>
          </TableCell>
          <TableCell className="text-right font-semibold">
            <p>{totalPriceByItem} €</p>
            <p>{lumpsum} €</p>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

import { create } from "zustand";

import {
  INITIAL_FEE,
  FRAME_ADDITIONAL_COST,
  ADAPTER_COSTS,
  ADAPTER_PLATE_TYPES,
  FRAME_TYPES,
} from "./constants";

export interface PlateOption {
  type: string;
  quantity: number;
  price: number;
  pylonLegMeasure?: string;
  plateMeasure?: string;
  tubeDiameter?: string;
}
export interface PlateRow {
  rowId: number;
  plate: PlateOption;
  uploadedImage?: string;
  pylonLegMeasure?: string;
  plateMeasure?: string;
  tubeDiameter?: string;
}
export interface PylonType {
  type: string;
  numPlates: number;
  numTubes: number;
  price: number;
}

const pylonTypes: PylonType[] = [
  { type: "type 1", numPlates: 42, numTubes: 16, price: 20000 },
  { type: "type 2", numPlates: 8, numTubes: 6, price: 10000 },
  { type: "type 3", numPlates: 33, numTubes: 8, price: 15000 },
];

const plateOptions: PlateOption[] = [
  { type: "plate 1a", quantity: 8, price: 350 },
  { type: "plate 1b", quantity: 8, price: 350 },
  { type: "plate 1c", quantity: 8, price: 350 },
  { type: "plate 2", quantity: 16, price: 350 },
  { type: "plate 3", quantity: 6, price: 200 },
  { type: "plate 4a", quantity: 6, price: 280 },
  { type: "plate 4b", quantity: 6, price: 280 },
  { type: "plate 5", quantity: 6, price: 200 },
  { type: "plate 6a", quantity: 6, price: 280 },
  { type: "plate 6b", quantity: 6, price: 280 },
  { type: "plate 8", quantity: 4, price: 200 },
  { type: "cornerframe", quantity: 8, price: 500 },
  { type: "frontframe", quantity: 8, price: 1000 },
  { type: "reinforcement tubes", quantity: 4, price: 600 },
  { type: "handrail", quantity: 4, price: 1000 },
  { type: "other", quantity: 0, price: 0 },
];

export interface Site {
  siteCode: string;
  address: string;
  pylonCode: string;
  swapId: string;
  techConfig: string;
  selectedPylonType: string;
  selectedPlates: PlateRow[];
}

interface AppStore {
  plateOptions: PlateOption[];
  pylonTypes: PylonType[];
  siteData: Site;
  setSiteData: (siteData: Site) => void;
  updateSiteField: (field: keyof Site, value: any) => void;
  updatePylonType: (value: string) => void;
  updatePlateType: (value: PlateRow[]) => void;

  calculateLumpSumPrice: () => number;
  calculateTotalPriceByItem: () => number;
}

export const useAppStore = create<AppStore>((set, get) => ({
  plateOptions: plateOptions,
  pylonTypes: pylonTypes,
  siteData: {} as Site,
  setSiteData: (siteData: Site) => set({ siteData }),
  updateSiteField: (field, value) =>
    set((state) => ({
      siteData: { ...state.siteData, [field]: value },
    })),
  updatePylonType: (value: string) =>
    set((state) => ({
      siteData: {
        ...state.siteData,
        selectedPylonType: value,
      },
    })),
  updatePlateType: (values: PlateRow[]) =>
    set((state) => ({
      siteData: {
        ...state.siteData,
        selectedPlates: values,
      },
    })),

  calculateLumpSumPrice: () => {
    const state = get();
    return (
      state.pylonTypes.find((p) => p.type === state.siteData.selectedPylonType)
        ?.price || 0
    );
  },
  calculateTotalPriceByItem: () => {
    const state = get();
    if (!state.siteData.selectedPlates) return INITIAL_FEE;

    // Check if any adapter plates are selected
    const hasAdapterPlates = state.siteData.selectedPlates.some((sp) =>
      ADAPTER_PLATE_TYPES.includes(sp.plate.type)
    );

    return state.siteData.selectedPlates.reduce((total, sp) => {
      const { type, quantity, price } = sp.plate;

      // Only apply frame additional costs if no adapter plates are selected
      const additionalCost =
        !hasAdapterPlates && FRAME_TYPES.includes(type)
          ? FRAME_ADDITIONAL_COST * quantity
          : 0;

      // Always calculate adapter costs for adapter plates
      const adapterCost =
        ADAPTER_COSTS[type as keyof typeof ADAPTER_COSTS] || 0;
      const totalAdapterCost = adapterCost * quantity;

      const itemTotal = quantity * price + additionalCost + totalAdapterCost;
      return total + itemTotal;
    }, INITIAL_FEE);
  },
}));

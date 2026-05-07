export const FITTING_PRICE_META_KEY = "fdl_fitting_price";

export type MetaDataEntry = {
  id?: number;
  key: string;
  value: unknown;
};

export function normalizePriceInput(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";

  const normalized = String(value).replace(/[^0-9.]/g, "").trim();
  if (!normalized) return "";
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return "";

  return normalized;
}

export function getFittingPriceString(
  metaData?: MetaDataEntry[] | null,
): string {
  const matched = metaData?.find((entry) => entry.key === FITTING_PRICE_META_KEY);
  const normalized = normalizePriceInput(matched?.value);

  if (!normalized || Number.parseFloat(normalized) <= 0) {
    return "";
  }

  return normalized;
}

export function getFittingPriceNumber(
  metaData?: MetaDataEntry[] | null,
): number | null {
  const normalized = getFittingPriceString(metaData);
  return normalized ? Number.parseFloat(normalized) : null;
}

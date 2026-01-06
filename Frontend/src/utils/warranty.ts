export const calculateWarrantyExpiryDate = (
  dateOfSale: string,
  durationInMonths?: number
): string | null => {
  if (
    !dateOfSale ||
    durationInMonths === undefined ||
    durationInMonths === null
  )
    return null;

  const base = new Date(dateOfSale);
  if (Number.isNaN(base.getTime())) return null;

  const months = Number(durationInMonths);
  if (Number.isNaN(months)) return null;

  if (months < 1) {
    // Weeks are expressed as fractional months; convert to days (approx. 30 days per month)
    const days = Math.round(months * 30);
    base.setDate(base.getDate() + days);
  } else {
    const fullMonths = Math.floor(months);
    const extraDays = Math.round((months - fullMonths) * 30);
    base.setMonth(base.getMonth() + fullMonths);
    if (extraDays) {
      base.setDate(base.getDate() + extraDays);
    }
  }

  return base.toISOString();
};

export const formatWarrantyExpiry = (isoDate?: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
  });
};

export const WARRANTY_OPTIONS = [
  { label: "1 Week", value: 0.25 },
  { label: "2 Weeks", value: 0.5 },
  { label: "3 Weeks", value: 0.75 },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} Month${i + 1 === 1 ? "" : "s"}`,
    value: i + 1,
  })),
  { label: "2 Years", value: 24 },
  { label: "3 Years", value: 36 },
];

export const warrantyLabelFromMonths = (months?: number | null) => {
  if (months === undefined || months === null) return "";
  const match = WARRANTY_OPTIONS.find((option) => option.value === months);
  if (match) return match.label;
  return `${months} Months`;
};

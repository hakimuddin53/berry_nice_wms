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

  const months = Number(durationInMonths);
  if (!Number.isFinite(months) || months <= 0) return null;

  const base = new Date(dateOfSale);
  if (Number.isNaN(base.getTime())) return null;

  const wholeMonths = Math.trunc(months);
  const fractional = months - wholeMonths;
  const weeksFromFraction = Math.round(fractional * 4); // map quarter months to weeks

  base.setMonth(base.getMonth() + wholeMonths);
  if (weeksFromFraction > 0) {
    base.setDate(base.getDate() + weeksFromFraction * 7);
  }

  return base.toISOString();
};

export const formatWarrantyExpiry = (isoDate?: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const locale =
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : "en-MY";
  const timeZone = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return undefined;
    }
  })();
  return date.toLocaleDateString(locale, timeZone ? { timeZone } : undefined);
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
  if (months < 1) {
    const weeks = Math.round(months * 4);
    if (weeks > 0) {
      return `${weeks} Week${weeks === 1 ? "" : "s"}`;
    }
  }
  return `${months} Months`;
};

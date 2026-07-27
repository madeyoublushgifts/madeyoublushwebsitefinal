export type OccasionType =
  | "valentines"
  | "mothers_day"
  | "anniversary"
  | "birthday"
  | "holiday"
  | "special_occasion"
  | "custom";

export type SubscriptionOccasion = {
  id: string;
  type: OccasionType;
  label: string;
  date: string;
};

export const occasionTypeOptions: Array<{ value: OccasionType; label: string }> = [
  { value: "valentines", label: "Valentine's Day" },
  { value: "mothers_day", label: "Mother's Day" },
  { value: "anniversary", label: "Anniversary" },
  { value: "birthday", label: "Birthday" },
  { value: "holiday", label: "Holiday" },
  { value: "special_occasion", label: "Special occasion" },
  { value: "custom", label: "Custom" },
];

export function createOccasionId(): string {
  return `occ_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function occasionTypeLabel(type: OccasionType): string {
  return occasionTypeOptions.find((o) => o.value === type)?.label ?? type;
}

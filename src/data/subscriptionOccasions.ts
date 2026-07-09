export type OccasionType = "birthday" | "anniversary" | "holiday" | "special_event";

export type SubscriptionOccasion = {
  id: string;
  type: OccasionType;
  label: string;
  date: string;
};

export const occasionTypeOptions: Array<{ value: OccasionType; label: string }> = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "holiday", label: "Holiday" },
  { value: "special_event", label: "Special event" },
];

export function createOccasionId(): string {
  return `occ_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function occasionTypeLabel(type: OccasionType): string {
  return occasionTypeOptions.find((o) => o.value === type)?.label ?? type;
}

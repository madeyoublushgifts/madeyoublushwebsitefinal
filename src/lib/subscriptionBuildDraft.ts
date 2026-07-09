export type SubscriptionBuildDraft = {
  summary: string;
  estimatedTotal: number;
};

const STORAGE_KEY = "myb-subscription-build-draft";

export function saveSubscriptionBuildDraft(draft: SubscriptionBuildDraft): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function loadSubscriptionBuildDraft(): SubscriptionBuildDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SubscriptionBuildDraft;
  } catch {
    return null;
  }
}

export function clearSubscriptionBuildDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

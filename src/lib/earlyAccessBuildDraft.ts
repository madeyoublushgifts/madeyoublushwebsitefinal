import type { EarlyAccessGiveawayId } from "@/data/earlyAccessGiveaways";

export type EarlyAccessBuildDraft = {
  summary: string;
  estimatedTotal: number;
  month?: number;
  giveawayId?: EarlyAccessGiveawayId;
};

export function earlyAccessDraftStorageKey(
  giveawayId: EarlyAccessGiveawayId,
  month: number
): string {
  return `myb-early-access-build-draft:${giveawayId}:month-${month}`;
}

export function saveEarlyAccessBuildDraft(
  giveawayId: EarlyAccessGiveawayId,
  month: number,
  draft: EarlyAccessBuildDraft
): void {
  sessionStorage.setItem(
    earlyAccessDraftStorageKey(giveawayId, month),
    JSON.stringify({ ...draft, giveawayId, month })
  );
}

export function loadEarlyAccessBuildDraft(
  giveawayId: EarlyAccessGiveawayId,
  month: number
): EarlyAccessBuildDraft | null {
  try {
    const raw = sessionStorage.getItem(
      earlyAccessDraftStorageKey(giveawayId, month)
    );
    if (!raw) return null;
    return JSON.parse(raw) as EarlyAccessBuildDraft;
  } catch {
    return null;
  }
}

export function clearEarlyAccessBuildDraft(
  giveawayId: EarlyAccessGiveawayId,
  month: number
): void {
  sessionStorage.removeItem(earlyAccessDraftStorageKey(giveawayId, month));
}

export function clearAllEarlyAccessBuildDrafts(
  giveawayId: EarlyAccessGiveawayId,
  months: number[]
): void {
  for (const month of months) {
    clearEarlyAccessBuildDraft(giveawayId, month);
  }
}

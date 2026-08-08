import { useMemo } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import CreateBouquet from "@/pages/CreateBouquet";
import {
  getEarlyAccessGiveaway,
  getEarlyAccessMonthConfig,
  type EarlyAccessGiveawayId,
} from "@/data/earlyAccessGiveaways";

type EarlyAccessBuildBouquetProps = {
  giveawayId: EarlyAccessGiveawayId;
};

/** Early-access giveaway custom builder — returns to the secret claim page. */
const EarlyAccessBuildBouquet = ({ giveawayId }: EarlyAccessBuildBouquetProps) => {
  const [searchParams] = useSearchParams();
  const giveaway = getEarlyAccessGiveaway(giveawayId);

  const month = useMemo(() => {
    const raw = Number.parseInt(searchParams.get("month") ?? "1", 10);
    if (!Number.isFinite(raw) || raw < 1) return 1;
    const max = giveaway.monthsCount;
    return Math.min(raw, max);
  }, [searchParams, giveaway.monthsCount]);

  const monthConfig = getEarlyAccessMonthConfig(giveaway, month);

  if (!monthConfig.styles.includes("custom")) {
    return <Navigate to={`${giveaway.claimPath}#claim`} replace />;
  }

  return (
    <CreateBouquet
      mode="early-access"
      earlyAccessVariant={monthConfig.builderVariant}
      giveawayId={giveawayId}
      buildMonth={monthConfig.month}
      returnPath={
        giveaway.monthsCount > 1
          ? `${giveaway.claimPath}?month=${monthConfig.month}#claim`
          : `${giveaway.claimPath}#claim`
      }
    />
  );
};

export default EarlyAccessBuildBouquet;

/**

 * Brand photography — Made You Blush (`public/images/myb/`).

 * Curated gift cards use full-bleed photos; `giftGridSrc` remains for the flower-crown tile (2×2 crop).

 */

const base = import.meta.env.BASE_URL;

const myb = (file: string) => `${base}images/myb/${file}`;



const q = "auto=format&fit=crop&w=200&q=80";

const ph = (id: string) => `https://images.unsplash.com/${id}?${q}`;



/** 2×2 add-ons — bottom-right quadrant (flower crown) until a dedicated crown photo is added */

export const giftGridSrc = myb("myb-gift-grid.png");



/** Shop → Curated Gift Sets (hero product shots) */

export const curatedGiftChocolates = myb("myb-curated-chocolates.png");

export const curatedGiftCandle = myb("myb-curated-candle.png");

export const curatedGiftTeddy = myb("myb-curated-teddy.png");

/** Shop → Curated Gift Sets — flower crowns */
export const crownSimpleBlush = myb("myb-crown-simple-blush.png");
export const crownSimpleRosebud = myb("myb-crown-simple-rosebud.png");



/** Shop → Signature Bouquets (full-bleed squares) */

export const signatureRomanticGarden = myb("myb-signature-02.png");

export const signatureSunshineDelight = myb("myb-signature-01.png");

export const signaturePurpleElegance = myb("myb-signature-03.png");

export const signaturePureSerenity = myb("myb-signature-04.png");

export const signatureVelvetRed = myb("myb-signature-05.png");

export const signatureBohoBlush = myb("myb-signature-06.png");



// Shop → Bouquet tiers ($5.99 / $16.99 / $34.99 / $56.99 / $75)

export const tierSingleStem = myb("myb-tier-single-stem.png");

export const tierMini = myb("myb-tier-mini.png");

export const tierStandard = myb("myb-tier-standard.png");

export const tierDeluxe = myb("myb-tier-deluxe.png");

export const tierLuxury = myb("myb-tier-luxury.png");



export const romanticGarden = tierSingleStem;

export const sunshineDelight = tierMini;

export const purpleElegance = tierStandard;

export const pureSerenity = tierLuxury;

export const deluxeBouquet = tierDeluxe;



/** Home — Shop highlights (luxury / signatures collage / curated sets collage) */

export const showcaseLuxuryBouquet = tierLuxury;

export const showcaseSignatureBouquets = myb("myb-highlight-signatures-collage.png");

export const showcaseCuratedGiftSets = myb("myb-highlight-curated-gifts-collage.png");



/** Hero & tiers */

export const showcaseMiniBouquet = tierMini;

export const showcaseStandardBouquet = tierStandard;

export const showcaseDeluxeBouquet = tierDeluxe;

export const showcaseGiftBundle = myb("myb-gift-bundle.png");



// Hero slides (legacy export order: mini → standard → gift bundle)

export const heroSlide1 = tierMini;

export const heroSlide2 = tierStandard;

export const heroSlide3 = myb("myb-gift-bundle.png");



// Testimonial avatars

export const client1 = ph("photo-1494790108377-be9c29b29330");

export const client2 = ph("photo-1507003211169-0a1dd7228f2d");

export const client3 = ph("photo-1438761681033-6461ffad8d80");



/** Coming Soon — build-your-own mockups */

export const comingSoonBuilder = myb("myb-coming-soon-builder.png");

export const comingSoonBuilderDone = myb("myb-coming-soon-builder-done.png");



// Legacy names — map to shop-highlight art if referenced elsewhere

export const roses1 = showcaseLuxuryBouquet;

export const lillies1 = showcaseSignatureBouquets;

export const orchids1 = showcaseCuratedGiftSets;



export const chocolatesAndBlooms = myb("myb-gift-bundle.png");

export const floralCandleSet = myb("myb-snail-mail-addon.png");

export const card = myb("myb-card-addon.png");

export const teddyBloom = myb("myb-curated-teddy.png");

export const floralCrown = tierLuxury;



// Build-a-bouquet — stems (main, filler, greenery)

export const stemHydrangea = myb("myb-stem-hydrangea.png");

export const stemDaisy = myb("myb-stem-daisy.png");

export const stemAlstroemeria = myb("myb-stem-alstroemeria.png");

export const stemRanunculus = myb("myb-stem-ranunculus.png");

export const stemSprayRoses = myb("myb-stem-spray-roses.png");

export const stemRose = myb("myb-stem-rose.png");

export const stemCallaLily = myb("myb-stem-calla-lily.png");

export const stemCarnation = myb("myb-stem-carnation.png");

export const stemLily = myb("myb-stem-lily.png");

export const stemSunflower = myb("myb-stem-sunflower.png");

export const stemButtons = myb("myb-stem-buttons.png");

export const stemCremons = myb("myb-stem-cremons.png");

export const stemCushions = myb("myb-stem-cushions.png");

export const stemMagnums = myb("myb-stem-magnums.png");

export const stemLimonium = myb("myb-stem-limonium.png");

export const stemBabysBreath = myb("myb-stem-babys-breath.png");

export const stemLavenderStock = myb("myb-stem-lavender-stock.png");

export const stemSolidago = myb("myb-stem-solidago.png");

export const stemStatice = myb("myb-stem-statice.png");

export const stemPittosporum = myb("myb-stem-pittosporum.png");

export const stemRuscus = myb("myb-stem-ruscus.png");

export const stemBabyEucalyptus = myb("myb-stem-baby-eucalyptus.png");

export const stemSilverDollarEucalyptus = myb("myb-stem-silver-dollar-eucalyptus.png");

export const customRose1 = stemRose;

export const customLily = stemLily;

export const customOrchid = myb("myb-stem-orchids.png");

export const customCarnations = stemCarnation;

export const customPeonies = stemBabyEucalyptus;

export const customEucalyptus = stemSilverDollarEucalyptus;

// Build-a-bouquet — materials & presentation (step 2)

export const kraftPaper = myb("myb-material-kraft.png");

export const silkRibbon = myb("myb-material-silk-ribbon.png");

export const basket = myb("myb-material-basket.png");

export const vase = myb("myb-material-vase.png");

export const buildGreetingCard = myb("myb-material-card.png");



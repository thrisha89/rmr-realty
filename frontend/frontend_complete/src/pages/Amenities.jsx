import { useTranslation } from "react-i18next";
import SectionHeading from "../components/SectionHeading.jsx";
import Reveal from "../components/Reveal.jsx";
import PageHero, { splitGold } from "../components/PageHero.jsx";

const AMENITIES = [
  { key: "clubHouse", image: "/clubhouse.jpeg", icon: "M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-6h6v6" },
  { key: "childrensPark", image: "/childrens-park.jpeg", icon: "M12 3v3m0 0a4 4 0 100 8 4 4 0 000-8zM6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" },
  { key: "overheadTank", image: "/overhead-tank.jpeg", icon: "M12 3c3 3.6 5 6.4 5 9a5 5 0 11-10 0c0-2.6 2-5.4 5-9z" },
  { key: "cctv", image: "/cctv.jpeg", icon: "M2 8l6 2v6l-6 2V8zm14-3l6 3v8l-6 3V5zM8 10.5h8" },
  { key: "commercialShops", image: "/commercial-shops.jpeg", icon: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" },
];

function AmenityCard({ a, t, featured = false, delay = 0, variant = "up-sm" }) {
  return (
    <Reveal
      variant={variant}
      delay={delay}
      className={`group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[var(--shadow-xs)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-md)] ${
        featured ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
    >
      <div className={`relative w-full overflow-hidden bg-navy-50 ${featured ? "h-64 sm:h-full sm:min-h-[22rem]" : "h-56"}`}>
        <img
          src={a.image}
          alt={t(`amenitiesPage.${a.key}Label`)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />

        {/* Content overlaid directly on the photograph rather than
            sitting in a separate white panel below it — reads as a
            single immersive tile instead of image-plus-card. */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-white/80 bg-gradient-to-b from-gold-400 to-gold-500 text-navy-900 shadow-[var(--shadow-gold)] transition-transform duration-500 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d={a.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h3 className={`mt-4 font-bold tracking-tight text-white ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
            {t(`amenitiesPage.${a.key}Label`)}
          </h3>
          <p
            className={`mt-2 max-w-md leading-relaxed text-white/85 transition-all duration-500 ${
              featured
                ? "text-sm sm:text-base"
                : "max-h-0 overflow-hidden opacity-0 group-hover:mt-2 group-hover:max-h-24 group-hover:opacity-100 sm:max-h-24 sm:opacity-100 text-sm"
            }`}
          >
            {t(`amenitiesPage.${a.key}Desc`)}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Amenities() {
  const { t } = useTranslation();
  const [featured, ...rest] = AMENITIES;

  return (
    <div>
      <PageHero
        eyebrow={t("amenitiesPage.eyebrow", "Amenities")}
        heading={splitGold(t("amenitiesPage.title", "Thoughtfully planned, genuinely useful"), 2)}
        subtitle={t(
          "amenitiesPage.heroSubtitle",
          "Clubhouse, park, water supply and security — planned into every layout from day one."
        )}
        bgWord={t("bgWord.amenities")}
        bgImage="/clubhouse.jpeg"
        heroVariant="showcase"
        bgImageZoom="1.1"
        bgImageFocus="48% 40%"
      />

      {/* Lifestyle showcase — an asymmetric bento wall: one amenity
          featured large with its description always visible, the rest
          as compact tiles that reveal their copy on hover, instead of
          a uniform 3-column grid of matching cards. */}
      <section className="relative overflow-hidden section-pad">
        <div className="gold-atmosphere gold-atmosphere-light-b" />
        <div className="container-content relative">
          <SectionHeading
            title={t("amenitiesPage.sectionTitle", "What our projects offer")}
            subtitle={t(
              "amenitiesPage.sectionSubtitle",
              "Availability may vary by project — please check individual project pages or enquire for confirmation."
            )}
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[13rem]">
            <AmenityCard a={featured} t={t} featured delay={0} variant="scale" />
            {rest.map((a, i) => (
              <AmenityCard a={a} t={t} key={a.key} delay={(i + 1) * 90} variant={i % 2 === 0 ? "up-sm" : "right"} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useLocation, useParams } from "react-router-dom";
import { BUSINESS } from "./constants.js";

// Known slug -> display name map so the WhatsApp message reads naturally
// even before the project detail page has finished loading. Any project
// added later (unknown slug) still works via the title-case fallback below.
const PROJECT_NAMES = {
  "geetha-garden": "Geetha Garden",
  "prestige-imperial": "Prestige Imperial",
  "royal-enclasa": "Royal Enclasa",
};

function slugToName(slug) {
  if (PROJECT_NAMES[slug]) return PROJECT_NAMES[slug];
  return slug
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Builds a WhatsApp message tailored to whichever page the visitor is
// currently on, so the floating WhatsApp button always opens a chat that
// already states what they were looking at instead of one generic line
// from every page on the site.
export function buildContextualWhatsAppMessage(pathname, params = {}) {
  if (pathname.startsWith("/projects/") && params.slug) {
    const name = slugToName(params.slug);
    return `Hi RMR, I need to know details about this project - ${name}. Could you share the pricing, layout and availability?`;
  }
  if (pathname === "/projects") {
    return "Hi RMR, I'd like to see the list of your ongoing and upcoming projects.";
  }
  if (pathname === "/amenities") {
    return "Hi RMR, I'd like to know more about the amenities offered in your projects.";
  }
  if (pathname === "/calculator") {
    return "Hi RMR, I used your investment calculator and would like to discuss a plot investment plan.";
  }
  if (pathname === "/gallery") {
    return "Hi RMR, I was checking your gallery and would like more information on your projects.";
  }
  if (pathname === "/about") {
    return "Hi RMR, I'd like to know more about RMR Realty as a company.";
  }
  if (pathname === "/broker-registration") {
    return "Hi RMR, I'm interested in partnering with you as a broker/channel partner.";
  }
  if (pathname === "/contact") {
    return "Hi RMR, I have an enquiry and would like to get in touch.";
  }
  return "Hi RMR, I'm interested in your projects. Could you share more details?";
}

export function projectWhatsAppLink(projectName) {
  const text = `Hi RMR, I need to know details about this project - ${projectName}. Could you share the pricing, layout and availability?`;
  return `https://wa.me/91${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}

// Hook version for components rendered inside the router (WhatsAppButton).
export function useContextualWhatsAppLink() {
  const location = useLocation();
  const params = useParams();
  const message = buildContextualWhatsAppMessage(location.pathname, params);
  return `https://wa.me/91${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

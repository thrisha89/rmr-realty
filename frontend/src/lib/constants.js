// All values here are taken verbatim from the client's requirements
// document. Do not edit without a verified source.
export const BUSINESS = {
  name: "RMR Realty",
  tagline: "Turning dreams into realty",
  phone: "7550395917",
  email: "rmrrealty.official@gmail.com",
  whatsapp: "8122749118",
  address: "Chamundi Nagar, Nallur Road, Near Nallur Checkpost, Hosur 635109",
  hours: "9:30 AM – 6:30 PM (Tuesday: Holiday)",
  mapLink: "https://maps.google.com/?cid=6735115362098635152",
  // NOTE: verify this Facebook URL matches the real page -- Facebook page
  // slugs don't always match the display name exactly (spaces/casing can
  // differ from "Rmr-realty Hosur"). Update if it doesn't match.
  instagram: "https://www.instagram.com/rmrrealty.official",
  facebook: "https://www.facebook.com/share/1P5PNWcieY/",
};

export const WHATSAPP_LINK = `https://wa.me/91${BUSINESS.whatsapp}`;

// Default subject/body used when a visitor clicks the footer email action.
// This only pre-fills the visitor's own email composer (via a standard
// mailto: link) — it does not send anything automatically, and the
// visitor can edit both fields before sending.
const EMAIL_ENQUIRY_SUBJECT = "Enquiry - RMR Realty";
const EMAIL_ENQUIRY_BODY = `Hi RMR Realty team,

I would like to know more about your projects and available plots.

Name:
Phone number:
Preferred project (if any):

Thank you.`;

export const EMAIL_ENQUIRY_LINK = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
  EMAIL_ENQUIRY_SUBJECT
)}&body=${encodeURIComponent(EMAIL_ENQUIRY_BODY)}`;

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

// RMR Realty — "Ask RMR" smart assistant knowledge base.
//
// This is a rules/keyword-matching FAQ engine, not a generative AI model.
// It is intentionally NOT labeled as generative AI anywhere in the UI.
// Every answer below is sourced directly from the client's requirements
// document. Nothing here is invented. Unmatched questions get an honest
// "I don't have verified information on that" response plus a lead-capture
// nudge, per the client's zero-cost/no-fake-AI requirement.
//
// Language support: each intent carries one answer per supported site
// language (en/ta/te/kn). Keyword matching itself stays English-only —
// project names and common real-estate terms are typically typed in
// English regardless of the visitor's chosen display language — but the
// answer returned follows whatever language the site is currently set to,
// per the client's requirement that the chatbot "follow the selected
// website language."
//
// Architecture note: this module is the entire "brain" of the bot. To
// upgrade to a real LLM later (if the client approves a paid provider),
// only this file's `matchIntent` function needs to be swapped for an API
// call — the routes, DB logging, and frontend widget stay unchanged.
//
// Interactivity: each intent can optionally carry:
//   - quickReplies: short suggestion chips shown under the bot's answer so
//     the visitor can tap instead of typing. Each is just plain text that
//     gets "sent" as the next message when tapped, so it re-enters the same
//     matchIntent() pipeline — no separate code path needed.
//   - projectSlug: ties an answer to one specific project so the widget can
//     offer a "View project page" / "Enquire on WhatsApp" action scoped to
//     that project.
//   - requiresLead: true marks intents where a human follow-up is the right
//     next step (pricing, financing, a specific project, or an explicit
//     request to talk to someone). The route layer uses this to prompt an
//     inline name+phone capture, which is then saved as a Lead and used to
//     build a pre-filled WhatsApp message — see routes/chatbot.js.

export const SUPPORTED_LANGS = ["en", "ta", "te", "kn"];
const DEFAULT_LANG = "en";

const DEFAULT_QUICK_REPLIES = ["Show me your projects", "Pricing", "Amenities", "Talk to an agent"];

export const INTENTS = [
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    quickReplies: DEFAULT_QUICK_REPLIES,
    answers: {
      en: "Hello! I'm the RMR Realty assistant. I can help with information about our projects, pricing, amenities, location, and contact details. What would you like to know?",
      ta: "வணக்கம்! நான் RMR Realty உதவியாளர். எங்கள் திட்டங்கள், விலை, வசதிகள், இடம் மற்றும் தொடர்பு விவரங்கள் குறித்து உதவ முடியும். நீங்கள் என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?",
      te: "నమస్కారం! నేను RMR Realty సహాయకుడిని. మా ప్రాజెక్టులు, ధర, సౌకర్యాలు, స్థానం మరియు సంప్రదింపు వివరాల గురించి సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      kn: "ನಮಸ್ಕಾರ! ನಾನು RMR Realty ಸಹಾಯಕ. ನಮ್ಮ ಯೋಜನೆಗಳು, ಬೆಲೆ, ಸೌಲಭ್ಯಗಳು, ಸ್ಥಳ ಮತ್ತು ಸಂಪರ್ಕ ವಿವರಗಳ ಬಗ್ಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    },
  },
  {
    id: "company_intro",
    keywords: ["about rmr", "who are you", "about the company", "about your company", "what is rmr"],
    quickReplies: ["Show me your projects", "Why choose RMR?", "Contact details"],
    answers: {
      en: "RMR Realty is a real estate, builders and promoters company based in Hosur, Tamil Nadu, established in 2026. We focus on relationship-driven, transparent guidance for clients looking for residential and commercial plots. Our tagline is \"Turning dreams into realty.\"",
      ta: "RMR Realty என்பது 2026-இல் நிறுவப்பட்ட, ஹொசூர், தமிழ்நாட்டை தளமாகக் கொண்ட ஒரு ரியல் எஸ்டேட், கட்டுநர் மற்றும் மேம்பாட்டாளர் நிறுவனம். குடியிருப்பு மற்றும் வணிக மனைகளை தேடும் வாடிக்கையாளர்களுக்கு உறவு சார்ந்த, வெளிப்படையான வழிகாட்டுதலில் கவனம் செலுத்துகிறோம். எங்கள் முழக்கம் \"கனவுகளை நிலமாக்குதல்.\"",
      te: "RMR Realty అనేది 2026లో స్థాపించబడిన, హోసూర్, తమిళనాడులో ఉన్న ఒక రియల్ ఎస్టేట్, బిల్డర్లు మరియు ప్రమోటర్ల సంస్థ. నివాస మరియు వాణిజ్య ప్లాట్‌లు కోరుకునే క్లయింట్లకు సంబంధ-ఆధారిత, పారదర్శక మార్గదర్శకత్వంపై దృష్టి పెడతాము. మా ట్యాగ్‌లైన్ \"కలలను రియల్టీగా మార్చడం.\"",
      kn: "RMR Realty ಎಂಬುದು 2026ರಲ್ಲಿ ಸ್ಥಾಪಿತವಾದ, ಹೊಸೂರು, ತಮಿಳುನಾಡಿನಲ್ಲಿರುವ ರಿಯಲ್ ಎಸ್ಟೇಟ್, ಬಿಲ್ಡರ್‌ಗಳು ಮತ್ತು ಪ್ರವರ್ತಕರ ಸಂಸ್ಥೆ. ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ನಿವೇಶನಗಳನ್ನು ಹುಡುಕುವ ಗ್ರಾಹಕರಿಗೆ ಸಂಬಂಧ-ಆಧಾರಿತ, ಪಾರದರ್ಶಕ ಮಾರ್ಗದರ್ಶನದ ಮೇಲೆ ನಾವು ಗಮನ ಹರಿಸುತ್ತೇವೆ. ನಮ್ಮ ಟ್ಯಾಗ್‌ಲೈನ್ \"ಕನಸುಗಳನ್ನು ರಿಯಾಲ್ಟಿಯಾಗಿ ಪರಿವರ್ತಿಸುವುದು.\"",
    },
  },
  {
    id: "projects_list",
    keywords: ["projects", "project list", "which projects", "properties", "plots available"],
    // The route layer appends a live `projectOptions` list (built from the
    // Project table) to this intent's response so the buttons always match
    // whatever projects are actually published — see routes/chatbot.js.
    answers: {
      en: "We currently have three projects: Geetha Garden (Nallur), Prestige Imperial (Kalasthipuram, Bagalur Road), and Royal Enclasa. You can view all of them on our Projects page. Would you like details on a specific one?",
      ta: "தற்போது எங்களிடம் மூன்று திட்டங்கள் உள்ளன: கீதா கார்டன் (நல்லூர்), பிரெஸ்டீஜ் இம்பீரியல் (களஸ்திபுரம், பாகலூர் ரோடு), மற்றும் ராயல் என்க்லாசா. அனைத்தையும் எங்கள் திட்டங்கள் பக்கத்தில் காணலாம். ஒரு குறிப்பிட்ட திட்டம் பற்றிய விவரங்கள் வேண்டுமா?",
      te: "ప్రస్తుతం మా వద్ద మూడు ప్రాజెక్టులు ఉన్నాయి: గీతా గార్డెన్ (నల్లూర్), ప్రెస్టీజ్ ఇంపీరియల్ (కళస్తిపురం, బాగలూర్ రోడ్), మరియు రాయల్ ఎన్‌క్లాసా. వీటన్నింటినీ మా ప్రాజెక్టుల పేజీలో చూడవచ్చు. ఏదైనా నిర్దిష్ట ప్రాజెక్ట్ వివరాలు కావాలా?",
      kn: "ಪ್ರಸ್ತುತ ನಮ್ಮಲ್ಲಿ ಮೂರು ಯೋಜನೆಗಳಿವೆ: ಗೀತಾ ಗಾರ್ಡನ್ (ನಲ್ಲೂರ್), ಪ್ರೆಸ್ಟೀಜ್ ಇಂಪೀರಿಯಲ್ (ಕಳಸ್ತಿಪುರಂ, ಬಾಗಲೂರು ರಸ್ತೆ), ಮತ್ತು ರಾಯಲ್ ಎನ್‌ಕ್ಲಾಸಾ. ಇವೆಲ್ಲವನ್ನೂ ನಮ್ಮ ಯೋಜನೆಗಳ ಪುಟದಲ್ಲಿ ನೋಡಬಹುದು. ಯಾವುದಾದರೂ ನಿರ್ದಿಷ್ಟ ಯೋಜನೆಯ ವಿವರಗಳು ಬೇಕೇ?",
    },
  },
  {
    id: "geetha_garden",
    keywords: ["geetha garden", "geetha"],
    projectSlug: "geetha-garden",
    requiresLead: true,
    quickReplies: ["Pricing", "Amenities", "Talk to an agent"],
    answers: {
      en: "Geetha Garden is located in Nallur. It offers residential and commercial plots. For the latest pricing and layout details, please visit the Geetha Garden project page or contact our team directly.",
      ta: "கீதா கார்டன் நல்லூரில் அமைந்துள்ளது. இது குடியிருப்பு மற்றும் வணிக மனைகளை வழங்குகிறது. சமீபத்திய விலை மற்றும் தளவமைப்பு விவரங்களுக்கு, கீதா கார்டன் திட்டப் பக்கத்தைப் பார்க்கவும் அல்லது எங்கள் குழுவை நேரடியாகத் தொடர்பு கொள்ளவும்.",
      te: "గీతా గార్డెన్ నల్లూర్‌లో ఉంది. ఇది నివాస మరియు వాణిజ్య ప్లాట్‌లను అందిస్తుంది. తాజా ధర మరియు లేఅవుట్ వివరాల కోసం, దయచేసి గీతా గార్డెన్ ప్రాజెక్ట్ పేజీని సందర్శించండి లేదా మా బృందాన్ని నేరుగా సంప్రదించండి.",
      kn: "ಗೀತಾ ಗಾರ್ಡನ್ ನಲ್ಲೂರಿನಲ್ಲಿದೆ. ಇದು ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ನಿವೇಶನಗಳನ್ನು ನೀಡುತ್ತದೆ. ಇತ್ತೀಚಿನ ಬೆಲೆ ಮತ್ತು ಲೇಔಟ್ ವಿವರಗಳಿಗಾಗಿ, ದಯವಿಟ್ಟು ಗೀತಾ ಗಾರ್ಡನ್ ಯೋಜನೆ ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ನಮ್ಮ ತಂಡವನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.",
    },
  },
  {
    id: "prestige_imperial",
    keywords: ["prestige imperial", "prestige", "imperial"],
    projectSlug: "prestige-imperial",
    requiresLead: true,
    quickReplies: ["Pricing", "Amenities", "Talk to an agent"],
    answers: {
      en: "Prestige Imperial is located at Kalasthipuram, Bagalur Road. It offers residential and commercial plots. For the latest pricing and layout details, please visit the Prestige Imperial project page or contact our team directly.",
      ta: "பிரெஸ்டீஜ் இம்பீரியல் களஸ்திபுரம், பாகலூர் ரோட்டில் அமைந்துள்ளது. இது குடியிருப்பு மற்றும் வணிக மனைகளை வழங்குகிறது. சமீபத்திய விலை மற்றும் தளவமைப்பு விவரங்களுக்கு, பிரெஸ்டீஜ் இம்பீரியல் திட்டப் பக்கத்தைப் பார்க்கவும் அல்லது எங்கள் குழுவை நேரடியாகத் தொடர்பு கொள்ளவும்.",
      te: "ప్రెస్టీజ్ ఇంపీరియల్ కళస్తిపురం, బాగలూర్ రోడ్‌లో ఉంది. ఇది నివాస మరియు వాణిజ్య ప్లాట్‌లను అందిస్తుంది. తాజా ధర మరియు లేఅవుట్ వివరాల కోసం, దయచేసి ప్రెస్టీజ్ ఇంపీరియల్ ప్రాజెక్ట్ పేజీని సందర్శించండి లేదా మా బృందాన్ని నేరుగా సంప్రదించండి.",
      kn: "ಪ್ರೆಸ್ಟೀಜ್ ಇಂಪೀರಿಯಲ್ ಕಳಸ್ತಿಪುರಂ, ಬಾಗಲೂರು ರಸ್ತೆಯಲ್ಲಿದೆ. ಇದು ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ನಿವೇಶನಗಳನ್ನು ನೀಡುತ್ತದೆ. ಇತ್ತೀಚಿನ ಬೆಲೆ ಮತ್ತು ಲೇಔಟ್ ವಿವರಗಳಿಗಾಗಿ, ದಯವಿಟ್ಟು ಪ್ರೆಸ್ಟೀಜ್ ಇಂಪೀರಿಯಲ್ ಯೋಜನೆ ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ನಮ್ಮ ತಂಡವನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ.",
    },
  },
  {
    id: "royal_enclasa",
    keywords: ["royal enclasa", "royal", "enclasa"],
    projectSlug: "royal-enclasa",
    requiresLead: true,
    quickReplies: ["Talk to an agent", "Show me your projects"],
    answers: {
      en: "Royal Enclasa is one of our upcoming projects. Full verified details (location, pricing, amenities) are being finalized and will be published here soon. Please share your contact details and our team will reach out with the latest information.",
      ta: "ராயல் என்க்லாசா எங்கள் வரவிருக்கும் திட்டங்களில் ஒன்று. முழு சரிபார்க்கப்பட்ட விவரங்கள் (இடம், விலை, வசதிகள்) இறுதி செய்யப்பட்டு விரைவில் இங்கு வெளியிடப்படும். உங்கள் தொடர்பு விவரங்களைப் பகிரவும், எங்கள் குழு சமீபத்திய தகவலுடன் தொடர்பு கொள்ளும்.",
      te: "రాయల్ ఎన్‌క్లాసా మా రాబోయే ప్రాజెక్టులలో ఒకటి. పూర్తి ధృవీకరించబడిన వివరాలు (స్థానం, ధర, సౌకర్యాలు) ఖరారు చేయబడుతున్నాయి మరియు త్వరలో ఇక్కడ ప్రచురించబడతాయి. దయచేసి మీ సంప్రదింపు వివరాలను పంచుకోండి, మా బృందం తాజా సమాచారంతో సంప్రదిస్తుంది.",
      kn: "ರಾಯಲ್ ಎನ್‌ಕ್ಲಾಸಾ ನಮ್ಮ ಮುಂಬರುವ ಯೋಜನೆಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಸಂಪೂರ್ಣ ಪರಿಶೀಲಿಸಿದ ವಿವರಗಳು (ಸ್ಥಳ, ಬೆಲೆ, ಸೌಲಭ್ಯಗಳು) ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ ಮತ್ತು ಶೀಘ್ರದಲ್ಲೇ ಇಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗುವುದು. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ, ನಮ್ಮ ತಂಡ ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    },
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "rate", "per sq ft", "sq ft price", "how much"],
    requiresLead: true,
    quickReplies: ["Show me your projects", "Financing / loan options"],
    answers: {
      en: "Our plots start from Rs. 3,899/- per sq ft, depending on the project and plot. For an exact quote on a specific plot, please share your contact details and our team will get back to you.",
      ta: "எங்கள் மனைகள் திட்டம் மற்றும் மனையைப் பொறுத்து ரூ. 3,899/- ஒரு சதுர அடிக்கு தொடங்குகின்றன. ஒரு குறிப்பிட்ட மனைக்கான துல்லியமான மேற்கோளுக்கு, உங்கள் தொடர்பு விவரங்களைப் பகிரவும், எங்கள் குழு தொடர்பு கொள்ளும்.",
      te: "మా ప్లాట్‌లు ప్రాజెక్ట్ మరియు ప్లాట్‌ను బట్టి చ.అ.కు రూ. 3,899/- నుండి ప్రారంభమవుతాయి. ఒక నిర్దిష్ట ప్లాట్‌కు ఖచ్చితమైన కోట్ కోసం, దయచేసి మీ సంప్రదింపు వివరాలను పంచుకోండి, మా బృందం మిమ్మల్ని సంప్రదిస్తుంది.",
      kn: "ನಮ್ಮ ನಿವೇಶನಗಳು ಯೋಜನೆ ಮತ್ತು ನಿವೇಶನವನ್ನು ಅವಲಂಬಿಸಿ ಪ್ರತಿ ಚ.ಅಡಿಗೆ ರೂ. 3,899/- ನಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತವೆ. ನಿರ್ದಿಷ್ಟ ನಿವೇಶನದ ನಿಖರ ಉಲ್ಲೇಖಕ್ಕಾಗಿ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ, ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    },
  },
  {
    id: "amenities",
    keywords: ["amenities", "facilities", "club house", "clubhouse", "park", "cctv", "security", "shops"],
    quickReplies: ["Show me your projects", "Pricing"],
    answers: {
      en: "Our projects feature amenities such as a Club House, Children's Park, Overhead Tank, CCTV surveillance, and Commercial Shops (availability may vary by project).",
      ta: "எங்கள் திட்டங்களில் கிளப் ஹவுஸ், குழந்தைகள் பூங்கா, மேல்நிலைத் தொட்டி, சிசிடிவி கண்காணிப்பு மற்றும் வணிக கடைகள் போன்ற வசதிகள் உள்ளன (கிடைக்கும் தன்மை திட்டத்திற்கு ஏற்ப மாறுபடலாம்).",
      te: "మా ప్రాజెక్టులలో క్లబ్ హౌస్, పిల్లల పార్క్, ఓవర్‌హెడ్ ట్యాంక్, సీసీటీవీ నిఘా మరియు వాణిజ్య దుకాణాలు వంటి సౌకర్యాలు ఉన్నాయి (లభ్యత ప్రాజెక్ట్‌ను బట్టి మారవచ్చు).",
      kn: "ನಮ್ಮ ಯೋಜನೆಗಳಲ್ಲಿ ಕ್ಲಬ್ ಹೌಸ್, ಮಕ್ಕಳ ಉದ್ಯಾನ, ಓವರ್‌ಹೆಡ್ ಟ್ಯಾಂಕ್, ಸಿಸಿಟಿವಿ ನಿಗಾ ಮತ್ತು ವಾಣಿಜ್ಯ ಅಂಗಡಿಗಳಂತಹ ಸೌಲಭ್ಯಗಳಿವೆ (ಲಭ್ಯತೆ ಯೋಜನೆಗೆ ಅನುಗುಣವಾಗಿ ಬದಲಾಗಬಹುದು).",
    },
  },
  {
    id: "payment",
    keywords: ["loan", "emi", "payment plan", "finance", "financing", "bank loan"],
    requiresLead: true,
    quickReplies: ["EMI calculator", "Talk to an agent"],
    answers: {
      en: "Yes, home loans are available for our projects. Our team can guide you through the loan process — please share your contact details for a callback.",
      ta: "ஆம், எங்கள் திட்டங்களுக்கு வீட்டுக் கடன்கள் கிடைக்கின்றன. கடன் செயல்முறை குறித்து எங்கள் குழு உங்களுக்கு வழிகாட்டும் — திரும்ப அழைப்புக்கு உங்கள் தொடர்பு விவரங்களைப் பகிரவும்.",
      te: "అవును, మా ప్రాజెక్టులకు గృహ రుణాలు అందుబాటులో ఉన్నాయి. రుణ ప్రక్రియ ద్వారా మా బృందం మీకు మార్గనిర్దేశం చేయగలదు — కాల్‌బ్యాక్ కోసం దయచేసి మీ సంప్రదింపు వివరాలను పంచుకోండి.",
      kn: "ಹೌದು, ನಮ್ಮ ಯೋಜನೆಗಳಿಗೆ ಗೃಹ ಸಾಲಗಳು ಲಭ್ಯವಿದೆ. ಸಾಲ ಪ್ರಕ್ರಿಯೆಯ ಮೂಲಕ ನಮ್ಮ ತಂಡ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಹುದು — ಕಾಲ್‌ಬ್ಯಾಕ್‌ಗಾಗಿ ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.",
    },
  },
  {
    id: "gallery",
    keywords: ["gallery", "photos", "images", "pictures", "site photos"],
    quickReplies: ["Show me your projects", "Contact details"],
    answers: {
      en: "You can view photos of our projects, site progress, and amenities on the Gallery page in the site menu. Each project page also has its own photo gallery.",
      ta: "எங்கள் திட்டங்கள், தள முன்னேற்றம் மற்றும் வசதிகளின் புகைப்படங்களை தளத் தொலைவில் உள்ள கேலரி பக்கத்தில் காணலாம். ஒவ்வொரு திட்டப் பக்கத்திலும் அதன் சொந்த புகைப்பட கேலரியும் உள்ளது.",
      te: "మా ప్రాజెక్టులు, సైట్ పురోగతి మరియు సౌకర్యాల ఫోటోలను మెనూలోని గ్యాలరీ పేజీలో చూడవచ్చు. ప్రతి ప్రాజెక్ట్ పేజీకి దాని స్వంత ఫోటో గ్యాలరీ కూడా ఉంటుంది.",
      kn: "ನಮ್ಮ ಯೋಜನೆಗಳು, ಸೈಟ್ ಪ್ರಗತಿ ಮತ್ತು ಸೌಲಭ್ಯಗಳ ಫೋಟೋಗಳನ್ನು ಮೆನುವಿನಲ್ಲಿರುವ ಗ್ಯಾಲರಿ ಪುಟದಲ್ಲಿ ನೋಡಬಹುದು. ಪ್ರತಿ ಯೋಜನೆ ಪುಟಕ್ಕೂ ತನ್ನದೇ ಆದ ಫೋಟೋ ಗ್ಯಾಲರಿ ಇದೆ.",
    },
  },
  {
    id: "calculator",
    keywords: ["calculator", "emi calculator", "investment calculator", "investment planner", "estimate"],
    quickReplies: ["Pricing", "Financing / loan options"],
    answers: {
      en: "Our Investment Planner (on the Calculator page) lets you estimate the total cost and a rough EMI for any of our plots — just pick a project or enter a custom size and rate.",
      ta: "எங்கள் முதலீட்டு திட்டமிடுபவர் (கால்குலேட்டர் பக்கத்தில்) மொத்த செலவு மற்றும் தோராயமான EMI-ஐ மதிப்பிட உதவுகிறது — ஒரு திட்டத்தைத் தேர்ந்தெடுக்கவும் அல்லது தனிப்பயன் அளவு/விலையை உள்ளிடவும்.",
      te: "మా ఇన్వెస్ట్‌మెంట్ ప్లానర్ (కాలిక్యులేటర్ పేజీలో) మొత్తం ఖర్చు మరియు సుమారు EMIని అంచనా వేయడానికి సహాయపడుతుంది — ఒక ప్రాజెక్ట్‌ను ఎంచుకోండి లేదా అనుకూల పరిమాణం/రేటును నమోదు చేయండి.",
      kn: "ನಮ್ಮ ಇನ್ವೆಸ್ಟ್‌ಮೆಂಟ್ ಪ್ಲಾನರ್ (ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಪುಟದಲ್ಲಿ) ಒಟ್ಟು ವೆಚ್ಚ ಮತ್ತು ಅಂದಾಜು EMI ಅನ್ನು ಲೆಕ್ಕಹಾಕಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ — ಒಂದು ಯೋಜನೆಯನ್ನು ಆರಿಸಿ ಅಥವಾ ಕಸ್ಟಮ್ ಗಾತ್ರ/ದರ ನಮೂದಿಸಿ.",
    },
  },
  {
    id: "account",
    keywords: ["login", "log in", "sign in", "register", "sign up", "create account", "my account", "my enquiries"],
    quickReplies: ["Contact details", "Talk to an agent"],
    answers: {
      en: "You can create a free account using Register in the site menu to track your enquiries, or Login if you already have one. This is separate from our admin/broker portals.",
      ta: "தளத் தொலைவில் உள்ள பதிவு (Register) மூலம் இலவச கணக்கை உருவாக்கி உங்கள் விசாரணைகளைக் கண்காணிக்கலாம், ஏற்கனவே கணக்கு இருந்தால் உள்நுழையவும் (Login). இது எங்கள் நிர்வாக/தரகர் போர்ட்டல்களில் இருந்து தனியானது.",
      te: "మెనూలోని రిజిస్టర్ ద్వారా ఉచిత ఖాతాను సృష్టించి మీ విచారణలను ట్రాక్ చేయవచ్చు, ఇప్పటికే ఖాతా ఉంటే లాగిన్ చేయండి. ఇది మా అడ్మిన్/బ్రోకర్ పోర్టల్‌ల నుండి వేరు.",
      kn: "ಮೆನುವಿನಲ್ಲಿರುವ Register ಮೂಲಕ ಉಚಿತ ಖಾತೆ ರಚಿಸಿ ನಿಮ್ಮ ವಿಚಾರಣೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು, ಈಗಾಗಲೇ ಖಾತೆ ಇದ್ದರೆ Login ಮಾಡಿ. ಇದು ನಮ್ಮ ಅಡ್ಮಿನ್/ಬ್ರೋಕರ್ ಪೋರ್ಟಲ್‌ಗಳಿಂದ ಪ್ರತ್ಯೇಕ.",
    },
  },
  {
    id: "why_choose_us",
    keywords: ["why choose", "why rmr", "why should i", "trust", "reliable", "genuine"],
    quickReplies: ["Show me your projects", "Contact details"],
    answers: {
      en: "RMR Realty focuses on relationship-driven, transparent guidance — verified project details, RERA-aligned policies, and a real local team in Hosur you can call, visit, or WhatsApp directly, instead of a faceless portal.",
      ta: "RMR Realty உறவு சார்ந்த, வெளிப்படையான வழிகாட்டுதலில் கவனம் செலுத்துகிறது — சரிபார்க்கப்பட்ட திட்ட விவரங்கள், RERA-இணக்கமான கொள்கைகள், மற்றும் ஹொசூரில் நேரடியாக அழைக்கவோ, சந்திக்கவோ, WhatsApp செய்யவோ கூடிய உண்மையான உள்ளூர் குழு.",
      te: "RMR Realty సంబంధ-ఆధారిత, పారదర్శక మార్గదర్శకత్వంపై దృష్టి పెడుతుంది — ధృవీకరించబడిన ప్రాజెక్ట్ వివరాలు, RERA-అనుకూల విధానాలు, మరియు హోసూర్‌లో మీరు నేరుగా కాల్ చేయగల, సందర్శించగల లేదా WhatsApp చేయగల నిజమైన స్థానిక బృందం.",
      kn: "RMR Realty ಸಂಬಂಧ-ಆಧಾರಿತ, ಪಾರದರ್ಶಕ ಮಾರ್ಗದರ್ಶನದ ಮೇಲೆ ಗಮನ ಹರಿಸುತ್ತದೆ — ಪರಿಶೀಲಿಸಿದ ಯೋಜನೆ ವಿವರಗಳು, RERA-ಅನುಗುಣ ನೀತಿಗಳು, ಮತ್ತು ಹೊಸೂರಿನಲ್ಲಿ ನೀವು ನೇರವಾಗಿ ಕರೆ ಮಾಡಬಹುದಾದ, ಭೇಟಿ ನೀಡಬಹುದಾದ ಅಥವಾ WhatsApp ಮಾಡಬಹುದಾದ ನಿಜವಾದ ಸ್ಥಳೀಯ ತಂಡ.",
    },
  },
  {
    id: "legal_pages",
    keywords: ["terms", "terms and conditions", "privacy policy", "disclaimer", "rera"],
    answers: {
      en: "Our Terms & Conditions, Privacy Policy, Refund Policy, and Disclaimer are all available in the site footer, and our policies follow RERA guidelines.",
      ta: "எங்கள் விதிமுறைகள் மற்றும் நிபந்தனைகள், தனியுரிமைக் கொள்கை, திரும்பப் பெறுதல் கொள்கை மற்றும் மறுப்பு அறிக்கை அனைத்தும் தளத்தின் அடிக்குறிப்பில் கிடைக்கும், எங்கள் கொள்கைகள் RERA வழிகாட்டுதல்களைப் பின்பற்றுகின்றன.",
      te: "మా నిబంధనలు & షరతులు, గోప్యతా విధానం, వాపసు విధానం మరియు నిరాకరణ అన్నీ సైట్ ఫుటర్‌లో అందుబాటులో ఉన్నాయి, మా విధానాలు RERA మార్గదర్శకాలను అనుసరిస్తాయి.",
      kn: "ನಮ್ಮ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು, ಗೌಪ್ಯತಾ ನೀತಿ, ಮರುಪಾವತಿ ನೀತಿ ಮತ್ತು ಹಕ್ಕುತ್ಯಾಗ ಎಲ್ಲವೂ ಸೈಟ್ ಫೂಟರ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ, ನಮ್ಮ ನೀತಿಗಳು RERA ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಅನುಸರಿಸುತ್ತವೆ.",
    },
  },
  {
    id: "talk_to_agent",
    keywords: ["talk to an agent", "talk to agent", "human", "real person", "call me", "callback", "speak to someone", "site visit"],
    requiresLead: true,
    answers: {
      en: "Sure — I'll connect you with our team. Please share your name and phone number below and we'll reach out shortly, or you can continue directly on WhatsApp.",
      ta: "நிச்சயமாக — எங்கள் குழுவுடன் உங்களை இணைக்கிறேன். கீழே உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணைப் பகிரவும், விரைவில் தொடர்பு கொள்வோம், அல்லது நேரடியாக WhatsApp-இல் தொடரலாம்.",
      te: "తప్పకుండా — మా బృందంతో మిమ్మల్ని కనెక్ట్ చేస్తాను. దయచేసి మీ పేరు మరియు ఫోన్ నంబర్‌ను క్రింద పంచుకోండి, మేము త్వరలో సంప్రదిస్తాము, లేదా నేరుగా WhatsAppలో కొనసాగవచ్చు.",
      kn: "ಖಂಡಿತ — ನಮ್ಮ ತಂಡದೊಂದಿಗೆ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ, ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ, ಅಥವಾ ನೇರವಾಗಿ WhatsApp‌ನಲ್ಲಿ ಮುಂದುವರಿಯಬಹುದು.",
    },
  },
  {
    id: "help",
    keywords: ["what can you do", "help", "menu", "options", "commands"],
    quickReplies: DEFAULT_QUICK_REPLIES,
    answers: {
      en: "I can help with: our projects (Geetha Garden, Prestige Imperial, Royal Enclasa), pricing, amenities, location, business hours, home loans/EMI, broker registration, and connecting you to our team. What would you like to know?",
      ta: "நான் உதவக்கூடியவை: எங்கள் திட்டங்கள் (கீதா கார்டன், பிரெஸ்டீஜ் இம்பீரியல், ராயல் என்க்லாசா), விலை, வசதிகள், இடம், வணிக நேரம், வீட்டுக் கடன்/EMI, தரகர் பதிவு, மற்றும் எங்கள் குழுவுடன் இணைத்தல். என்ன தெரிந்துகொள்ள விரும்புகிறீர்கள்?",
      te: "నేను వీటిలో సహాయం చేయగలను: మా ప్రాజెక్టులు (గీతా గార్డెన్, ప్రెస్టీజ్ ఇంపీరియల్, రాయల్ ఎన్‌క్లాసా), ధర, సౌకర్యాలు, స్థానం, వ్యాపార వేళలు, గృహ రుణం/EMI, బ్రోకర్ నమోదు, మరియు మా బృందంతో మిమ్మల్ని కనెక్ట్ చేయడం. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      kn: "ನಾನು ಇವುಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ: ನಮ್ಮ ಯೋಜನೆಗಳು (ಗೀತಾ ಗಾರ್ಡನ್, ಪ್ರೆಸ್ಟೀಜ್ ಇಂಪೀರಿಯಲ್, ರಾಯಲ್ ಎನ್‌ಕ್ಲಾಸಾ), ಬೆಲೆ, ಸೌಲಭ್ಯಗಳು, ಸ್ಥಳ, ವ್ಯಾಪಾರ ಸಮಯ, ಗೃಹ ಸಾಲ/EMI, ಬ್ರೋಕರ್ ನೋಂದಣಿ, ಮತ್ತು ನಮ್ಮ ತಂಡಕ್ಕೆ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುವುದು. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
    },
  },
  {
    id: "location",
    keywords: ["location", "address", "where are you", "office", "how to reach"],
    quickReplies: ["Contact details", "Business hours"],
    answers: {
      en: "Our office is at Chamundi Nagar, Nallur Road, Near Nallur Checkpost, Hosur 635109. You can also view us on Google Maps from our Contact page.",
      ta: "எங்கள் அலுவலகம் சாமுண்டி நகர், நல்லூர் ரோடு, நல்லூர் செக்பொஸ்ட் அருகில், ஹொசூர் 635109 இல் உள்ளது. எங்கள் தொடர்பு பக்கத்தில் இருந்து Google Maps-இலும் எங்களைப் பார்க்கலாம்.",
      te: "మా కార్యాలయం చాముండి నగర్, నల్లూర్ రోడ్, నల్లూర్ చెక్‌పోస్ట్ సమీపంలో, హోసూర్ 635109లో ఉంది. మా సంప్రదింపు పేజీ నుండి మీరు Google Maps‌లో కూడా మమ్మల్ని చూడవచ్చు.",
      kn: "ನಮ್ಮ ಕಚೇರಿ ಚಾಮುಂಡಿ ನಗರ, ನಲ್ಲೂರ್ ರಸ್ತೆ, ನಲ್ಲೂರ್ ಚೆಕ್‌ಪೋಸ್ಟ್ ಬಳಿ, ಹೊಸೂರು 635109ರಲ್ಲಿದೆ. ನಮ್ಮ ಸಂಪರ್ಕ ಪುಟದಿಂದ Google Maps‌ನಲ್ಲಿಯೂ ನೀವು ನಮ್ಮನ್ನು ನೋಡಬಹುದು.",
    },
  },
  {
    id: "contact",
    keywords: ["contact", "phone number", "call", "email", "reach you"],
    quickReplies: ["Talk to an agent", "Business hours"],
    answers: {
      en: "You can reach us at 7550395917 or rmrrealty.official@gmail.com. You can also WhatsApp us at 8122749118, or use the contact form on this website.",
      ta: "எங்களை 7550395917 அல்லது rmrrealty.official@gmail.com மூலம் தொடர்பு கொள்ளலாம். 8122749118-க்கு WhatsApp செய்யலாம், அல்லது இந்த வலைத்தளத்தின் தொடர்பு படிவத்தைப் பயன்படுத்தலாம்.",
      te: "మీరు మమ్మల్ని 7550395917 లేదా rmrrealty.official@gmail.com ద్వారా సంప్రదించవచ్చు. 8122749118కి WhatsApp చేయవచ్చు, లేదా ఈ వెబ్‌సైట్‌లోని సంప్రదింపు ఫారమ్‌ను ఉపయోగించవచ్చు.",
      kn: "ನೀವು ನಮ್ಮನ್ನು 7550395917 ಅಥವಾ rmrrealty.official@gmail.com ಮೂಲಕ ಸಂಪರ್ಕಿಸಬಹುದು. 8122749118ಗೆ WhatsApp ಮಾಡಬಹುದು, ಅಥವಾ ಈ ವೆಬ್‌ಸೈಟ್‌ನ ಸಂಪರ್ಕ ಫಾರ್ಮ್ ಬಳಸಬಹುದು.",
    },
  },
  {
    id: "hours",
    keywords: ["business hours", "timing", "open", "working hours", "when are you open"],
    answers: {
      en: "Our business hours are 9:30 AM – 6:30 PM. We are closed on Tuesdays.",
      ta: "எங்கள் வணிக நேரம் காலை 9:30 - மாலை 6:30 வரை. செவ்வாய்க்கிழமைகளில் மூடப்பட்டிருக்கும்.",
      te: "మా వ్యాపార వేళలు ఉదయం 9:30 - సాయంత్రం 6:30 వరకు. మంగళవారాల్లో మూసివేయబడుతుంది.",
      kn: "ನಮ್ಮ ವ್ಯಾಪಾರ ಸಮಯ ಬೆಳಿಗ್ಗೆ 9:30 - ಸಂಜೆ 6:30 ರವರೆಗೆ. ಮಂಗಳವಾರಗಳಂದು ಮುಚ್ಚಿರುತ್ತದೆ.",
    },
  },
  {
    id: "broker",
    keywords: ["broker", "channel partner", "commission", "broker registration"],
    quickReplies: ["Contact details"],
    answers: {
      en: "We welcome broker partnerships. You can register through our Broker Registration page, and our team will get in touch with you.",
      ta: "தரகர் கூட்டாண்மைகளை நாங்கள் வரவேற்கிறோம். எங்கள் தரகர் பதிவு பக்கத்தின் மூலம் பதிவு செய்யலாம், எங்கள் குழு உங்களைத் தொடர்பு கொள்ளும்.",
      te: "మేము బ్రోకర్ భాగస్వామ్యాలను స్వాగతిస్తున్నాము. మీరు మా బ్రోకర్ నమోదు పేజీ ద్వారా నమోదు చేసుకోవచ్చు, మా బృందం మిమ్మల్ని సంప్రదిస్తుంది.",
      kn: "ನಾವು ಬ್ರೋಕರ್ ಪಾಲುದಾರಿಕೆಗಳನ್ನು ಸ್ವಾಗತಿಸುತ್ತೇವೆ. ನೀವು ನಮ್ಮ ಬ್ರೋಕರ್ ನೋಂದಣಿ ಪುಟದ ಮೂಲಕ ನೋಂದಾಯಿಸಬಹುದು, ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    },
  },
  {
    id: "refund_policy",
    keywords: ["refund", "cancellation", "cancel booking"],
    answers: {
      en: "Our refund and cancellation policy follows RERA guidelines.",
      ta: "எங்கள் திரும்பப் பெறுதல் மற்றும் ரத்து செய்தல் கொள்கை RERA வழிகாட்டுதல்களைப் பின்பற்றுகிறது.",
      te: "మా వాపసు మరియు రద్దు విధానం RERA మార్గదర్శకాలను అనుసరిస్తుంది.",
      kn: "ನಮ್ಮ ಮರುಪಾವತಿ ಮತ್ತು ರದ್ದತಿ ನೀತಿ RERA ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಅನುಸರಿಸುತ್ತದೆ.",
    },
  },
  {
    id: "thanks",
    keywords: ["thank you", "thanks", "ok thanks", "great thanks"],
    answers: {
      en: "You're welcome! Is there anything else I can help you with?",
      ta: "வரவேற்கிறேன்! வேறு எதற்காவது நான் உதவ முடியுமா?",
      te: "మీకు స్వాగతం! మరేదైనా విషయంలో నేను సహాయం చేయగలనా?",
      kn: "ಸ್ವಾಗತ! ಇನ್ನೇನಾದರೂ ಸಹಾಯ ಬೇಕೇ?",
    },
  },
];

const FALLBACK_ANSWERS = {
  en: "I don't have verified information on that yet. I don't want to guess — please share your contact details or reach us directly at 7550395917 / rmrrealty.official@gmail.com, and our team will help you personally.",
  ta: "இதற்கு எனக்கு இன்னும் சரிபார்க்கப்பட்ட தகவல் இல்லை. நான் யூகிக்க விரும்பவில்லை — உங்கள் தொடர்பு விவரங்களைப் பகிரவும் அல்லது 7550395917 / rmrrealty.official@gmail.com மூலம் நேரடியாகத் தொடர்பு கொள்ளவும், எங்கள் குழு தனிப்பட்ட முறையில் உதவும்.",
  te: "దీనిపై నాకు ఇంకా ధృవీకరించబడిన సమాచారం లేదు. నేను ఊహించదలచుకోలేదు — దయచేసి మీ సంప్రదింపు వివరాలను పంచుకోండి లేదా 7550395917 / rmrrealty.official@gmail.com ద్వారా నేరుగా సంప్రదించండి, మా బృందం వ్యక్తిగతంగా మీకు సహాయం చేస్తుంది.",
  kn: "ಇದರ ಬಗ್ಗೆ ನನ್ನ ಬಳಿ ಇನ್ನೂ ಪರಿಶೀಲಿಸಿದ ಮಾಹಿತಿ ಇಲ್ಲ. ನಾನು ಊಹಿಸಲು ಬಯಸುವುದಿಲ್ಲ — ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಅಥವಾ 7550395917 / rmrrealty.official@gmail.com ಮೂಲಕ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ, ನಮ್ಮ ತಂಡ ವೈಯಕ್ತಿಕವಾಗಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
};

function resolveLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
}

export function matchIntent(userMessage, lang = DEFAULT_LANG) {
  const text = userMessage.toLowerCase();
  const resolvedLang = resolveLang(lang);
  let best = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    for (const kw of intent.keywords) {
      if (text.includes(kw)) {
        // longer keyword matches are more specific/confident
        if (kw.length > bestScore) {
          bestScore = kw.length;
          best = intent;
        }
      }
    }
  }

  if (best) {
    const answer = best.answers[resolvedLang] || best.answers[DEFAULT_LANG];
    return {
      intentId: best.id,
      answer,
      quickReplies: best.quickReplies || [],
      requiresLead: Boolean(best.requiresLead),
      projectSlug: best.projectSlug || null,
    };
  }
  return {
    intentId: null,
    answer: FALLBACK_ANSWERS[resolvedLang] || FALLBACK_ANSWERS[DEFAULT_LANG],
    quickReplies: DEFAULT_QUICK_REPLIES,
    requiresLead: true,
    projectSlug: null,
  };
}

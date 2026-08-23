// Adds translated (kn/ta/te) overlay rows for Project fields (category,
// priceLabel, description) and for reusable amenity labels. Purely additive:
// does not modify the existing Project/ProjectAmenity rows or admin editor.
import { db, genId } from "../src/db/index.js";

const projectTranslations = {
  "geetha-garden": {
    kn: {
      category: "ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಪ್ಲಾಟ್‌ಗಳು",
      priceLabel: "ಪ್ರತಿ ಚ.ಅಡಿಗೆ ರೂ. 3,899/- ರಿಂದ ಪ್ರಾರಂಭ*",
      description: "ಗೀತಾ ಗಾರ್ಡನ್ ಎಂಬುದು RMR Realty ನೀಡುವ, ಹೊಸೂರಿನ ನಲ್ಲೂರಿನಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಪ್ಲಾಟ್ ಅಭಿವೃದ್ಧಿಯಾಗಿದೆ. ಅರ್ಹ ಖರೀದಿದಾರರಿಗೆ ಸಾಲ ಸಹಾಯ ಲಭ್ಯವಿದೆ.",
    },
    ta: {
      category: "குடியிருப்பு மற்றும் வணிக மனைகள்",
      priceLabel: "சதுர அடிக்கு ரூ. 3,899/- முதல் தொடங்கும்*",
      description: "கீதா கார்டன் என்பது RMR Realty வழங்கும், ஓசூர் நல்லூரில் அமைந்துள்ள குடியிருப்பு மற்றும் வணிக மனை மேம்பாடு ஆகும். தகுதியான வாங்குபவர்களுக்கு கடன் உதவி கிடைக்கிறது.",
    },
    te: {
      category: "నివాస & వాణిజ్య ప్లాట్లు",
      priceLabel: "చ.అ.కు రూ. 3,899/- నుండి ప్రారంభం*",
      description: "గీత గార్డెన్ అనేది RMR Realty అందించే, హోసూర్‌లోని నల్లూర్‌లో ఉన్న నివాస మరియు వాణిజ్య ప్లాట్ అభివృద్ధి. అర్హులైన కొనుగోలుదారులకు లోన్ సహాయం అందుబాటులో ఉంది.",
    },
  },
  "prestige-imperial": {
    kn: {
      category: "ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಪ್ಲಾಟ್‌ಗಳು",
      priceLabel: "ಪ್ರತಿ ಚ.ಅಡಿಗೆ ರೂ. 3,899/- ರಿಂದ ಪ್ರಾರಂಭ*",
      description: "ಪ್ರೆಸ್ಟೀಜ್ ಇಂಪೀರಿಯಲ್ ಎಂಬುದು RMR Realty ನೀಡುವ, ಕಳಸ್ತಿಪುರಂ, ಬಾಗಲೂರು ರಸ್ತೆಯಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ವಸತಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಪ್ಲಾಟ್ ಅಭಿವೃದ್ಧಿಯಾಗಿದೆ. ಅರ್ಹ ಖರೀದಿದಾರರಿಗೆ ಸಾಲ ಸಹಾಯ ಲಭ್ಯವಿದೆ.",
    },
    ta: {
      category: "குடியிருப்பு மற்றும் வணிக மனைகள்",
      priceLabel: "சதுர அடிக்கு ரூ. 3,899/- முதல் தொடங்கும்*",
      description: "பிரெஸ்டீஜ் இம்பீரியல் என்பது RMR Realty வழங்கும், கலஸ்திபுரம், பாகலூர் சாலையில் அமைந்துள்ள குடியிருப்பு மற்றும் வணிக மனை மேம்பாடு ஆகும். தகுதியான வாங்குபவர்களுக்கு கடன் உதவி கிடைக்கிறது.",
    },
    te: {
      category: "నివాస & వాణిజ్య ప్లాట్లు",
      priceLabel: "చ.అ.కు రూ. 3,899/- నుండి ప్రారంభం*",
      description: "ప్రెస్టీజ్ ఇంపీరియల్ అనేది RMR Realty అందించే, కళస్తిపురం, బాగలూరు రోడ్‌లో ఉన్న నివాస మరియు వాణిజ్య ప్లాట్ అభివృద్ధి. అర్హులైన కొనుగోలుదారులకు లోన్ సహాయం అందుబాటులో ఉంది.",
    },
  },
  "royal-enclasa": {
    kn: {
      category: "ವಸತಿ ಪ್ಲಾಟ್‌ಗಳು",
      priceLabel: "ಪ್ರತಿ ಚ.ಅಡಿಗೆ ₹3,999",
      description: "ರಾಯಲ್ ಎನ್‌ಕಾಸಾ ಎಂಬುದು ಎಲುವಪಲ್ಲಿ, ನಲ್ಲೂರಿನಲ್ಲಿ ಸುಮಾರು 10 ಎಕರೆಗಳಷ್ಟು ವ್ಯಾಪಿಸಿರುವ ಪ್ರೀಮಿಯಂ ಗೇಟೆಡ್ ವಸತಿ ಪ್ಲಾಟ್ ಅಭಿವೃದ್ಧಿಯಾಗಿದೆ. ಈ ಪ್ರಾಜೆಕ್ಟ್ HNTDA ಮತ್ತು RERA ಅನುಮೋದನೆಗಳು, 183 ಪ್ರೀಮಿಯಂ ಪ್ಲಾಟ್‌ಗಳು, ವಿಶಾಲವಾದ 30 ಅಡಿ ಮತ್ತು 40 ಅಡಿ ರಸ್ತೆಗಳು, ಮಕ್ಕಳ ಉದ್ಯಾನ, ಭೂದೃಶ್ಯದ ಅವೆನ್ಯೂಗಳು ಮತ್ತು ಅಗತ್ಯ ಮೂಲಸೌಕರ್ಯವನ್ನು ಒಳಗೊಂಡಿದೆ, ಹೊಸೂರು ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ಬೆಳವಣಿಗೆಯ ಕಾರಿಡಾರ್‌ನ ಪ್ರಮುಖ ಪ್ರದೇಶಗಳಿಗೆ ಅನುಕೂಲಕರ ಪ್ರವೇಶದೊಂದಿಗೆ.",
    },
    ta: {
      category: "குடியிருப்பு மனைகள்",
      priceLabel: "சதுர அடிக்கு ₹3,999",
      description: "ராயல் என்காசா என்பது எலுவபள்ளி, நல்லூரில் சுமார் 10 ஏக்கர் பரப்பளவில் அமைந்துள்ள பிரீமியம் கேட்டட் குடியிருப்பு மனை மேம்பாடு ஆகும். இந்த திட்டம் HNTDA மற்றும் RERA ஒப்புதல்கள், 183 பிரீமியம் மனைகள், அகலமான 30 அடி மற்றும் 40 அடி சாலைகள், குழந்தைகள் பூங்கா, நிலப்பரப்பு அமைந்த வீதிகள் மற்றும் அத்தியாவசிய உள்கட்டமைப்பைக் கொண்டுள்ளது, ஓசூர் மற்றும் சுற்றியுள்ள வளர்ச்சி பாதையின் முக்கிய பகுதிகளுக்கு வசதியான அணுகலுடன்.",
    },
    te: {
      category: "నివాస ప్లాట్లు",
      priceLabel: "చ.అ.కు ₹3,999",
      description: "రాయల్ ఎన్‌కాసా అనేది ఎలువపల్లి, నల్లూర్‌లో సుమారు 10 ఎకరాల విస్తీర్ణంలో ఉన్న ప్రీమియం గేటెడ్ నివాస ప్లాట్ అభివృద్ధి. ఈ ప్రాజెక్ట్‌లో HNTDA మరియు RERA ఆమోదాలు, 183 ప్రీమియం ప్లాట్లు, విశాలమైన 30 అడుగుల మరియు 40 అడుగుల రోడ్లు, పిల్లల పార్క్, ల్యాండ్‌స్కేప్డ్ వీధులు మరియు అవసరమైన మౌలిక సదుపాయాలు ఉన్నాయి, హోసూర్ మరియు చుట్టుపక్కల వృద్ధి కారిడార్‌లోని ముఖ్యమైన ప్రాంతాలకు అనుకూలమైన ప్రవేశంతో.",
    },
  },
};

const amenityTranslations = {
  "Club House": { kn: "ಕ್ಲಬ್ ಹೌಸ್", ta: "கிளப் ஹவுஸ்", te: "క్లబ్ హౌస్" },
  "Children's Park": { kn: "ಮಕ್ಕಳ ಉದ್ಯಾನ", ta: "குழந்தைகள் பூங்கா", te: "పిల్లల పార్క్" },
  "Overhead Tank": { kn: "ಓವರ್‌ಹೆಡ್ ಟ್ಯಾಂಕ್", ta: "மேல்நிலை தொட்டி", te: "ఓవర్‌హెడ్ ట్యాంక్" },
  "CCTV": { kn: "CCTV ಕಣ್ಗಾವಲು", ta: "CCTV கண்காணிப்பு", te: "CCTV నిఘా" },
  "Commercial Shops": { kn: "ವಾಣಿಜ್ಯ ಅಂಗಡಿಗಳು", ta: "வணிக கடைகள்", te: "వాణిజ్య దుకాణాలు" },
  "Grand Entrance Arch": { kn: "ಭವ್ಯ ಪ್ರವೇಶ ಕಮಾನು", ta: "பிரம்மாண்ட நுழைவு வளைவு", te: "గ్రాండ్ ఎంట్రన్స్ ఆర్చ్" },
  "Outdoor Gym": { kn: "ಹೊರಾಂಗಣ ಜಿಮ್", ta: "வெளிப்புற ஜிம்", te: "ఔట్‌డోర్ జిమ్" },
  "Elders Park": { kn: "ಹಿರಿಯರ ಉದ್ಯಾನ", ta: "முதியோர் பூங்கா", te: "సీనియర్ సిటిజన్ పార్క్" },
  "30ft & 40ft Blacktop Roads": { kn: "30 ಅಡಿ ಮತ್ತು 40 ಅಡಿ ಡಾಂಬರು ರಸ್ತೆಗಳು", ta: "30 அடி & 40 அடி தார் சாலைகள்", te: "30 అడుగుల & 40 అడుగుల బ్లాక్‌టాప్ రోడ్లు" },
  "Sewage Treatment Plant": { kn: "ಒಳಚರಂಡಿ ಸಂಸ್ಕರಣಾ ಘಟಕ", ta: "கழிவுநீர் சுத்திகரிப்பு நிலையம்", te: "మురుగునీటి శుద్ధి ప్లాంట్" },
  "Overhead Tank & Water Line": { kn: "ಓವರ್‌ಹೆಡ್ ಟ್ಯಾಂಕ್ ಮತ್ತು ನೀರಿನ ಮಾರ್ಗ", ta: "மேல்நிலை தொட்டி & நீர் இணைப்பு", te: "ఓవర్‌హెడ్ ట్యాంక్ & వాటర్ లైన్" },
  "3-Phase Electricity": { kn: "3-ಫೇಸ್ ವಿದ್ಯುತ್", ta: "3-கட்ட மின்சாரம்", te: "3-ఫేజ్ కరెంట్" },
  "Avenue Plantation": { kn: "ರಸ್ತೆಬದಿ ಸಸ್ಯಸಂಪತ್ತು", ta: "விதி மரங்கள் நடவு", te: "వీధి మొక్కల పెంపకం" },
};

const projectRows = db.prepare("SELECT id, slug FROM Project").all();
const byId = Object.fromEntries(projectRows.map((p) => [p.slug, p.id]));

const insertProjTx = db.transaction(() => {
  for (const [slug, langs] of Object.entries(projectTranslations)) {
    const projectId = byId[slug];
    if (!projectId) {
      console.warn(`Skipping ${slug}: project not found.`);
      continue;
    }
    for (const [lang, fields] of Object.entries(langs)) {
      const existing = db
        .prepare("SELECT id FROM ProjectTranslation WHERE projectId = ? AND lang = ?")
        .get(projectId, lang);
      if (existing) {
        db.prepare(
          "UPDATE ProjectTranslation SET category=?, priceLabel=?, description=?, updatedAt=datetime('now') WHERE id=?"
        ).run(fields.category, fields.priceLabel, fields.description, existing.id);
        console.log(`Updated ProjectTranslation ${slug}/${lang}`);
      } else {
        db.prepare(
          "INSERT INTO ProjectTranslation (id, projectId, lang, category, priceLabel, description) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(genId("ptr"), projectId, lang, fields.category, fields.priceLabel, fields.description);
        console.log(`Inserted ProjectTranslation ${slug}/${lang}`);
      }
    }
  }
});

const insertAmenityTx = db.transaction(() => {
  for (const [label, langs] of Object.entries(amenityTranslations)) {
    for (const [lang, translated] of Object.entries(langs)) {
      const existing = db
        .prepare("SELECT id FROM AmenityTranslation WHERE label = ? AND lang = ?")
        .get(label, lang);
      if (existing) {
        db.prepare("UPDATE AmenityTranslation SET translated = ? WHERE id = ?").run(translated, existing.id);
      } else {
        db.prepare(
          "INSERT INTO AmenityTranslation (id, label, lang, translated) VALUES (?, ?, ?, ?)"
        ).run(genId("amt"), label, lang, translated);
      }
      console.log(`Amenity translation set: ${label} / ${lang}`);
    }
  }
});

insertProjTx();
insertAmenityTx();
console.log("Done seeding project + amenity translations.");

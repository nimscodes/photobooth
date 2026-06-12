import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "nt42z7dh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

const homePage = {
  _id: "homePage",
  _type: "homePage",
  hero: {
    headline: "Luxury Photo Booth Experiences for Unforgettable Events",
    subtext:
      "Modern photo booth rentals for weddings, birthdays, corporate events, and celebrations across the DFW Metroplex and Surrounding Areas.",
    stat1Value: "500+",
    stat1Label: "Events Captured",
    stat2Value: "5.0★",
    stat2Label: "Average Rating",
    stat3Value: "10K+",
    stat3Label: "Memories Made",
  },
  features: [
    { _key: "f1", icon: "🎥", title: "360 Video Booth", description: "Stunning slow-motion 360° videos your guests will share instantly." },
    { _key: "f2", icon: "📸", title: "Open-Air iPad Booth", description: "Modern iPad booth with instant digital sharing via QR, text, or email." },
    { _key: "f3", icon: "✨", title: "Custom Branding", description: "Add your logo, names, or custom message to every photo and video." },
    { _key: "f4", icon: "📱", title: "Instant Digital Sharing", description: "Guests share photos instantly — no waiting, no extra app needed." },
    { _key: "f5", icon: "🖼️", title: "Online Gallery", description: "Every event gets a private online gallery delivered after the event." },
    { _key: "f6", icon: "👤", title: "Professional Attendant", description: "Our attendant manages everything so you can enjoy your event stress-free." },
  ],
  howItWorks: [
    { _key: "s1", step: "01", title: "Pick a Package", description: "Browse our packages and choose the one that fits your event and budget." },
    { _key: "s2", step: "02", title: "Book Your Date", description: "Fill out our simple booking form and reserve your date in minutes." },
    { _key: "s3", step: "03", title: "We Handle the Rest", description: "We arrive early, set up everything, and make sure your guests have a blast." },
  ],
  cta: {
    heading: "Ready to Make Your Event Unforgettable?",
    subtext: "Dates fill up fast — especially for weekends and holidays. Reserve yours today.",
  },
};

const aboutPage = {
  _id: "aboutPage",
  _type: "aboutPage",
  hero: {
    eyebrow: "Our Story",
    heading: "About Us",
    subtext:
      "We started with one booth and a passion for making people smile. Now we bring that same energy to every event across the DFW Metroplex.",
  },
  whoWeAre: {
    heading: "We Capture the Moments That Matter Most",
    paragraph1:
      "At Elite Event Images, we believe every celebration deserves unforgettable moments. Our modern photo booth experiences are designed to bring people together, capture genuine memories, and add excitement to every event.",
    paragraph2:
      "From weddings and birthdays to corporate events and private celebrations, we provide high-quality photo booth rentals that are stylish, interactive, and easy for guests of all ages to enjoy.",
    paragraph3:
      "With premium backdrops, fun props, instant digital sharing, and fully customizable experiences, we help turn special moments into lasting memories that people talk about long after the event ends.",
  },
  stats: [
    { _key: "st1", value: "500+", label: "Events Served" },
    { _key: "st2", value: "5.0★", label: "Average Rating" },
    { _key: "st3", value: "10K+", label: "Memories Made" },
    { _key: "st4", value: "4+", label: "Years Experience" },
  ],
  values: [
    { _key: "v1", title: "Professionalism", description: "We arrive early, stay late, and handle every detail so you don't have to think about a thing." },
    { _key: "v2", title: "Premium Quality", description: "HD cameras, instant prints, and high-resolution digital galleries — nothing is cut-rate." },
    { _key: "v3", title: "Guest Experience", description: "Our attendants are friendly, patient, and focused on making every guest feel like a star." },
    { _key: "v4", title: "Reliability", description: "Over 500 events without a single no-show. Your date is locked in and protected." },
  ],
  cta: {
    heading: "Ready to create unforgettable memories?",
    subtext: "Serving the DFW Metroplex and Surrounding Areas.",
  },
};

async function seed() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error("❌  Set SANITY_WRITE_TOKEN before running this script.");
    console.error("   You can create a token at https://www.sanity.io/manage/project/nt42z7dh/api");
    process.exit(1);
  }

  console.log("Seeding homePage…");
  await client.createOrReplace(homePage);
  console.log("✓ homePage");

  console.log("Seeding aboutPage…");
  await client.createOrReplace(aboutPage);
  console.log("✓ aboutPage");

  console.log("\n✅ Done! Open the studio to see the pre-filled content.");
}

seed().catch((err) => { console.error(err); process.exit(1); });

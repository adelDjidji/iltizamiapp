export const MONTHS_AR = [
  "جانفي",
  "فيفري",
  "مارس",
  "أفريل",
  "ماي",
  "جوان",
  "جويلية",
  "أوت",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const salatOptions = [
  { value: 10, label: "كاملة مع الجماعة", key: "salatOpts.withJamaa" },
  { value: 8, label: "جزء مع الجماعة", key: "salatOpts.partWithJamaa" },
  { value: 6, label: "منفردا في وقتها", key: "salatOpts.aloneOnTime" },
  { value: 4, label: "منفردا خارج وقتها", key: "salatOpts.aloneOffTime" },
  { value: 1, label: "قضاء", key: "salatOpts.qada" },
];

export const Indicators = [
  {
    title: "🕌 مادة الصلاة",
    titleKey: "ind.prayer",
    id: "0000",
    color: "#e26a00",
    items: [
      { id: "0001", title: "🌖 الفجر ", titleKey: "ind.fajr", options: salatOptions, weight: 1 },
      { id: "0002", title: "☀️ الظهر ", titleKey: "ind.dhuhr", options: salatOptions, weight: 1 },
      { id: "0003", title: "🌤 العصر ", titleKey: "ind.asr", options: salatOptions, weight: 1 },
      { id: "0004", title: "🌅 المغرب ", titleKey: "ind.maghrib", options: salatOptions, weight: 1 },
      { id: "0005", title: "🌃 العشاء ", titleKey: "ind.isha", options: salatOptions, weight: 1 },
      { id: "0006", title: "🕋 السنن الرواتب ", titleKey: "ind.sunan", options: [], weight: 0.7 },
      { id: "0007", title: "🌙 القيام ", titleKey: "ind.qiyam", options: [], weight: 1.3 },
    ],
  },
  {
    title: "🤲 مادة الأذكار",
    titleKey: "ind.adkar",
    id: "0100",
    color: "white",
    items: [
      { id: "0101", title: "أذكار الصباح", titleKey: "ind.adkarSabah", options: [], weight: 1 },
      { id: "0102", title: "أذكار المساء", titleKey: "ind.adkarMasa", options: [], weight: 1 },
      { id: "0103", title: "الاستغفار", titleKey: "ind.istighfar", options: [], weight: 1 },
      { id: "0104", title: "التسبيح", titleKey: "ind.tasbih", options: [], weight: 1 },
      { id: "0105", title: "أذكار أخرى", titleKey: "ind.adkarOther", options: [], weight: 1 },
    ],
  },
  {
    title: "🕋 مادة القرآن",
    titleKey: "ind.quran",
    id: "0200",
    color: "grey",
    items: [
      { id: "0201", title: "الورد اليومي ، تلاوة", titleKey: "ind.tilawa", options: [], weight: 1 },
      { id: "0202", title: "حفظ ما تيسر", titleKey: "ind.hifz", options: [], weight: 1 },
    ],
  },
  {
    title: "🍶 مادة الصيام",
    titleKey: "ind.fasting",
    id: "0300",
    color: "grey",
    items: [
      { id: "0301", title: "صيام التطوع", titleKey: "ind.fastingNafl", options: [], weight: 1 },
      { id: "0302", title: "صيام الفرض", titleKey: "ind.fastingFard", options: [], weight: 1 },
      { id: "0303", title: "صيام القضاء", titleKey: "ind.fastingQada", options: [], weight: 1 },
      { id: "0304", title: "لا", titleKey: "ind.no", options: [], weight: 1 },
    ],
  },
  {
    title: "💰 مادة الصدقات",
    titleKey: "ind.charity",
    id: "0400",
    color: "grey",
    items: [
      { id: "0401", title: "نعم", titleKey: "ind.yes", options: [], weight: 1 },
      { id: "0402", title: "لا", titleKey: "ind.no", options: [], weight: 1 },
    ],
  },
  {
    title: "أعمال أخرى",
    titleKey: "ind.other",
    id: "0500",
    color: "grey",
    items: [
      { id: "0501", title: "نعم", titleKey: "ind.yes", options: [], weight: 1 },
      { id: "0502", title: "لا", titleKey: "ind.no", options: [], weight: 1 },
    ],
  },
];

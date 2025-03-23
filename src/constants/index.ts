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

export const salatOptions = [
  { value: 10, label: "كاملة مع الجماعة" },
  { value: 8, label: "جزء مع الجماعة" },
  { value: 6, label: "منفردا في وقتها" },
  { value: 4, label: "منفردا خارج وقتها" },
  { value: 1, label: "قضاء" },
];

export const Indicators = [
  {
    title: "🕌 مادة الصلاة",
    id: "0000",
    color: "#e26a00",
    items: [
      { id: "0001", title: "🌖 الفجر ", options: salatOptions, weight: 1 },
      { id: "0002", title: "☀️ الظهر ", options: salatOptions, weight: 1 },
      { id: "0003", title: "🌤 العصر ", options: salatOptions, weight: 1 },
      { id: "0004", title: "🌅 المغرب ", options: salatOptions, weight: 1 },
      { id: "0005", title: "🌃 العشاء ", options: salatOptions, weight: 1 },
      { id: "0006", title: "🕋 السنن الرواتب ", options: [], weight: 0.7 },
      { id: "0007", title: "🌙 القيام ", options: [], weight: 1.3 },
    ],
  },
  {
    title: "🤲 مادة الأذكار",
    id: "0100",
    color: "white",
    items: [
      { id: "0101", title: "أذكار الصباح", options: [], weight: 1 },
      { id: "0102", title: "أذكار المساء", options: [], weight: 1 },
      { id: "0103", title: "الاستغفار", options: [], weight: 1 },
      { id: "0104", title: "التسبيح", options: [], weight: 1 },
      { id: "0105", title: "أذكار أخرى", options: [], weight: 1 },
    ],
  },
  {
    title: "🕋 مادة القرآن",
    id: "0200",
    color: "grey",
    items: [
      { id: "0201", title: "الورد اليومي ، تلاوة", options: [], weight: 1 },
      { id: "0202", title: "حفظ ما تيسر", options: [], weight: 1 },
    ],
  },
  {
    title: "🍶 مادة الصيام",
    id: "0300",
    color: "grey",
    items: [
      { id: "0301", title: "صيام التطوع", options: [], weight: 1 },
      { id: "0302", title: "صيام الفرض", options: [], weight: 1 },
      { id: "0303", title: "صيام القضاء", options: [], weight: 1 },
      { id: "0304", title: "لا", options: [], weight: 1 },
    ],
  },
  {
    title: "💰 مادة الصدقات",
    id: "0400",
    color: "grey",
    items: [
      { id: "0401", title: "نعم", options: [], weight: 1 },
      { id: "0402", title: "لا", options: [], weight: 1 },
    ],
  },
  {
    title: "أعمال أخرى",
    id: "0500",
    color: "grey",
    items: [
      { id: "0501", title: "نعم", options: [], weight: 1 },
      { id: "0502", title: "لا", options: [], weight: 1 },
    ],
  },
];

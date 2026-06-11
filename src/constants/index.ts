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
  {
    value: 10,
    label: "كاملة مع الجماعة مع تكبيرة الإحرام",
    key: "salatOpts.withJamaaANdTakbir",
  },
  { value: 9, label: "كاملة مع الجماعة", key: "salatOpts.withJamaa" },
  { value: 8, label: "جزء مع الجماعة", key: "salatOpts.partWithJamaa" },
  { value: 5, label: "منفردا في وقتها", key: "salatOpts.aloneOnTime" },
  { value: 3, label: "منفردا خارج وقتها", key: "salatOpts.aloneOffTime" },
  { value: 1, label: "قضاء", key: "salatOpts.qada" },
];

export type IndicatorOption = {
  value: number;
  label: string;
  key: string;
};

export type IndicatorItem = {
  id: string;
  title: string;
  titleKey: string;
  options: IndicatorOption[];
  // [min, max] → numeric range input; [true, false] → checkbox
  range?: [number, number] | [boolean, boolean];
  weight: number;
};

export type Indicator = {
  title: string;
  titleKey: string;
  id: string;
  color: string;
  items: IndicatorItem[];
};

export const isNumberRange = (
  range?: IndicatorItem["range"],
): range is [number, number] => typeof range?.[0] === "number";

export const isBooleanRange = (
  range?: IndicatorItem["range"],
): range is [boolean, boolean] => typeof range?.[0] === "boolean";

export const MAX_ITEM_SCORE = 10;

// An indicator made only of boolean items (e.g. fasting types) is a group of
// mutually exclusive alternatives: checking any one of them earns the
// indicator's full mark, and the indicator counts as a single item.
export const isAlternativesIndicator = (indicator: Indicator) =>
  indicator.items.length > 0 &&
  indicator.items.every((item) => isBooleanRange(item.range));

export const getSectionScore = (indicator: Indicator, values: number[]) =>
  isAlternativesIndicator(indicator)
    ? values.some((v) => v > 0)
      ? MAX_ITEM_SCORE
      : 0
    : values.reduce((a, b) => a + b, 0);

export const getSectionMaxScore = (indicator: Indicator) =>
  isAlternativesIndicator(indicator)
    ? MAX_ITEM_SCORE
    : indicator.items.length * MAX_ITEM_SCORE;

export const Indicators: Indicator[] = [
  {
    title: "🕌 مادة الصلاة",
    titleKey: "ind.prayer",
    id: "0000",
    color: "#e26a00",
    items: [
      {
        id: "0001",
        title: "🌖 الفجر ",
        titleKey: "ind.fajr",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0002",
        title: "☀️ الظهر ",
        titleKey: "ind.dhuhr",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0003",
        title: "🌤 العصر ",
        titleKey: "ind.asr",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0004",
        title: "🌅 المغرب ",
        titleKey: "ind.maghrib",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0005",
        title: "🌃 العشاء ",
        titleKey: "ind.isha",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0006",
        title: "🕋 السنن الرواتب ",
        titleKey: "ind.sunan",
        options: [],
        range: [0, 12],
        weight: 0.7,
      },
      {
        id: "0007",
        title: "🌙 القيام ",
        titleKey: "ind.qiyam",
        options: [],
        range: [0, 12],
        weight: 1.3,
      },
    ],
  },
  {
    title: "🤲 مادة الأذكار",
    titleKey: "ind.adkar",
    id: "0100",
    color: "white",
    items: [
      {
        id: "0101",
        title: "أذكار الصباح",
        titleKey: "ind.adkarSabah",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      {
        id: "0102",
        title: "أذكار المساء",
        titleKey: "ind.adkarMasa",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      {
        id: "0103",
        title: "الاستغفار",
        titleKey: "ind.istighfar",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      {
        id: "0104",
        title: "التسبيح",
        titleKey: "ind.tasbih",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      {
        id: "0105",
        title: "أذكار أخرى",
        titleKey: "ind.adkarOther",
        options: [],
        range: [0, 10],
        weight: 1,
      },
    ],
  },
  {
    title: "🕋 مادة القرآن",
    titleKey: "ind.quran",
    id: "0200",
    color: "grey",
    items: [
      {
        id: "0201",
        title: "الورد اليومي ، تلاوة",
        titleKey: "ind.tilawa",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      {
        id: "0202",
        title: "حفظ ما تيسر",
        titleKey: "ind.hifz",
        options: [],
        range: [0, 10],
        weight: 1,
      },
    ],
  },
  {
    title: "🍶 مادة الصيام",
    titleKey: "ind.fasting",
    id: "0300",
    color: "grey",
    items: [
      {
        id: "0301",
        title: "صيام التطوع",
        titleKey: "ind.fastingNafl",
        options: [],
        range: [true, false],
        weight: 1,
      },
      {
        id: "0302",
        title: "صيام الفرض",
        titleKey: "ind.fastingFard",
        options: [],
        range: [true, false],
        weight: 1,
      },
      {
        id: "0303",
        title: "صيام القضاء",
        titleKey: "ind.fastingQada",
        options: [],
        range: [true, false],
        weight: 1,
      },
      // { id: "0304", title: "لا", titleKey: "ind.no", options: [], weight: 1 },
    ],
  },
  {
    title: "💰 مادة الصدقات",
    titleKey: "ind.charity",
    id: "0400",
    color: "grey",
    items: [
      {
        id: "0401",
        title: "الصدقات",
        titleKey: "ind.charities",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      // { id: "0402", title: "لا", titleKey: "ind.no", options: [], weight: 1 },
    ],
  },
  {
    title: "أعمال أخرى",
    titleKey: "ind.other",
    id: "0500",
    color: "grey",
    items: [
      {
        id: "0501",
        title: "أعمال أخرى",
        titleKey: "ind.otherWorks",
        options: [],
        range: [0, 10],
        weight: 1,
      },
      // { id: "0502", title: "لا", titleKey: "ind.no", options: [], weight: 1 },
    ],
  },
];

import { View, ScrollView } from "react-native";
import React from "react";
import Classes from "../constants/Classes";
import Text from "../components/Text";
import Colors from "../constants/Colors";

const salatOptions = [
  {
    value: 10,
    label: "كاملة مع الجماعة",
  },
  {
    value: 8,
    label: "جزء مع الجماعة",
  },
  {
    value: 6,
    label: "منفردا في وقتها",
  },
  {
    value: 4,
    label: "منفردا خارج وقتها",
  },
  {
    value: 1,
    label: "قضاء",
  },
];
const Indicators = [
  {
    title: "مادة الصلاة",
    id: "0000",
    items: [
      {
        id: "0001",
        title: "الفجر",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0002",
        title: "الظهر",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0003",
        title: "العصر",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0004",
        title: "المغرب",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0005",
        title: "العشاء",
        options: salatOptions,
        weight: 1,
      },
      {
        id: "0006",
        title: "النوافل",
        options: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        weight: 0.7,
      },
      {
        id: "0007",
        title: "القيام",
        options: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        weight: 1.3,
      },
    ],
  },
  {
    title: "مادة الأذكار",
    id: "0100",
    items: [
      {
        id: "0101",
        title: "أذكار الصباح",
        options: [],
        weight: 1,
      },
      {
        id: "0102",
        title: "أذكار المساء",
        options: [],
        weight: 1,
      },
      {
        id: "0103",
        title: "الاستغفار",
        options: [],
        weight: 1,
      },
      {
        id: "0104",
        title: "التسبيح",
        options: [],
        weight: 1,
      },
      {
        id: "0104",
        title: "أذكار أخرى",
        options: [],
        weight: 1,
      },
    ],
  },
  {
    title: "مادة القرآن",
    id: "0200",
    items: [
        {
            id: "0201",
            title: "الورد اليومي ، تلاوة",
            options: [],
            weight: 1,
          },
        {
            id: "0202",
            title: "حفظ ما تيسر",
            options: [],
            weight: 1,
          },
    ],
  },
  {
    title: "مادة الصيام",
    id: "0300",
    items: [
        {
            id: "0301",
            title:"صيام التطوع",
            options: [],
            weight: 1,
            
        },
        {
            id: "0302",
            title:"صيام الفرض",
            options: [],
            weight: 1,
            
        },
        {
            id: "0303",
            title:"صيام القضاء",
            options: [],
            weight: 1,
            
        },
        {
            id: "0304",
            title:"لا",
            options: [],
            weight: 1,
        },
    ],
  },
  {
    title: "مادة الصدقات",
    id: "0400",
    items: [
        {
            id: "0401",
            title:"نعم",
            options: [],
            weight: 1,
        },
        {
            id: "0402",
            title:"لا",
            options: [],
            weight: 1,
        },
    ],
  },
  {
    title: "أعمال أخرى",
    id: "0500",
    items: [
        {
            id: "0501",
            title:"نعم",
            options: [],
            weight: 1,
        },
        {
            id: "0502",
            title:"لا",
            options: [],
            weight: 1,
        },
    ],
  },
];
export default function FormEvaluation() {
  return (
    <ScrollView>
      <Text> تقييم إلتزامي اليومي ليوم </Text>
      {
          Indicators.map((indicator,index)=>{
              return <View style={Classes.containerCard}>
              <View
                style={{
                  marginBottom: 10,
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                }}
              >
                <Text bold> {indicator.title}</Text>
                <Text bold color={Colors.goldDark}>
                  0/3
                </Text>
              </View>
              <View>
                  {
                      indicator.items.map(item=>{
                          return <Text>{item.title}</Text>
                      })
                  }
              </View>
            </View>
          })
      }
      {/* <View style={Classes.containerCard}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text bold> مادة الصلاة</Text>
          <Text bold color={Colors.goldDark}>
            0/3
          </Text>
        </View>
        <View>
          <Text>الفجر</Text>
          <Text>الظهر</Text>
          <Text>العصر</Text>
          <Text>المغرب</Text>
          <Text>العشاء</Text>
          <Text>النوافل</Text>
          <Text>القيام</Text>
        </View>
      </View>

      <View style={Classes.containerCard}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text bold> مادة الأذكار</Text>
          <Text bold color={Colors.goldDark}>
            0/3
          </Text>
        </View>
        <View>
          <Text>أذكار الصباح</Text>
          <Text>أذكار المساء</Text>
          <Text>الاستغفار</Text>
          <Text>التسبيح</Text>
          <Text>أذكار أخرى</Text>
        </View>
      </View>

      <View style={Classes.containerCard}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text bold> مادة القرآن</Text>
          <Text bold color={Colors.goldDark}>
            0/3
          </Text>
        </View>
        <View>
          <Text>الورد اليومي ، تلاوة</Text>
          <Text>حفظ ما تيسر</Text>
        </View>
      </View>

      <View style={Classes.containerCard}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text bold> مادة الصيام</Text>
          <Text bold color={Colors.goldDark}>
            0/3
          </Text>
        </View>
        <View>
          <Text>صيام التطوع</Text>
          <Text>صيام الفرض</Text>
          <Text>صيام القضاء</Text>
          <Text>لا</Text>
        </View>
      </View>
      <View style={Classes.containerCard}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text bold> مادة الصدقات</Text>
          <Text bold color={Colors.goldDark}>
            0/3
          </Text>
        </View>
        <View>
          <Text>نعم</Text>
          <Text>لا</Text>
        </View>
      </View>
      <View style={Classes.containerCard}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text bold> أعمال أخرى</Text>
          <Text bold color={Colors.goldDark}>
            0/3
          </Text>
        </View>
        <View>
          <Text>نعم</Text>
          <Text>لا</Text>
        </View>
      </View> */}
    </ScrollView>
  );
}

import { View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Container from "../components/Container";
import Text from "../components/Text";
import Colors from "../constants/Colors";
import * as Linking from 'expo-linking';
import Constants from "expo-constants";

export default function About() {
  const version = Constants.manifest.version;

  return (
    <Container style={{flex:1}}>
      <View
        style={{
          alignItems: "center",
          borderBottomColor: Colors.gold,
          backgroundColor: Colors.goldLight,
          paddingBottom: 20,
          borderWidth: 1,
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
            margin: 20,
          }}
          source={require("../../assets/iltizamiIcon.png")}
        />
        <Text h2>حول تطبيق إلتزامي </Text>
      </View>
      <View style={{ padding: 12 }}>
        <Text>
          يسمح لك تطبيق التزامي باضافة تقييمات يومية على مختلف العبادات كالصلوات
          و الاذكار او الصدقات. .يقوم التطبيق ايضا برسم منحنى بياني يوضح نتائج
          تقييماتك على مدى الايام و الشهور
        </Text>
        <Text>
          و هذا انطلاقا من مقولة عمر بن الخطاب رضي الله عنه: حاسبوا أنفسكم قبل
          ان تحاسبوا و زنوا أعمالكم قبل أن توزن عليكم.
        </Text>

        <TouchableOpacity style={{display:'flex', flexDirection:'row-reverse', alignSelf:"center", margin:50}} onPress={()=>Linking.openURL('https://www.facebook.com/iltizamiApp')}>
        <Text align="center" h3>
        شاركنا رايك و اقتراحاتك
        <Image
          style={{
            width: 20,
            height: 20,
            margin: 20,
          }}
          source={require("../../assets/messenger-icon.png")}
        />
        </Text>
        
      </TouchableOpacity>
      </View>
      
      <View style={{ position:"absolute", bottom:0, alignSelf:"center"}}>
        <Text p color="grey"> العديد من المميزات الجديدة قادمة بحول الله</Text>
        <Text align="center"> النسخة: {version}</Text>
      </View>
    </Container>
  );
}

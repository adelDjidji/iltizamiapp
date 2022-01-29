import { View, Text, Button } from 'react-native';
import React from 'react';

export default function DrawerScreen(props) {
  return (
    <View>
      <Text>Drawer</Text>
      <Button title='Go back' onPress={()=>props.navigation.goBack()}/>
    </View>
  );
}

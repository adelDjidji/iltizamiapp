import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import Classes from '../constants/Classes';

export default function Container(props) {
    useEffect(() => {
        props.navigation && props.navigation.setOptions({
          // headerShown: props.showHeader || false,
        });
      }, []);
  return (
    <View style={[Classes.screenContainer, props.style]}>
      {props.children}
    </View>
  );
}

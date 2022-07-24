import React, { useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

const RTLScrollView = (props) => {
  const scrollRef = useRef();
  const scrollToEnd = () => scrollRef.current.scrollToEnd({ animated: false });

  return (
    <ScrollView
      horizontal
      ref={scrollRef}
      showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator || false}
      onContentSizeChange={scrollToEnd}
      contentContainerStyle={styles.contentContainerStyle}
    >
      {props.children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexDirection: 'row-reverse'
  }
});

export default RTLScrollView;
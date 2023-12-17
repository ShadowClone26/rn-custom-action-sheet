import React from "react";
import { Animated, ViewStyle, StyleSheet } from "react-native";

export type DummyAbsoluteViewProps = {
  opacity?: number | Animated.Value;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
};

const DummyAbsoluteView = ({
  opacity = 0.5,
  backgroundColor = "white",
  containerStyle = {},
  children = <></>,
}: DummyAbsoluteViewProps) => {
  return (
    <Animated.View
      style={[
        styles.containerStyle,
        {
          backgroundColor,
          opacity: opacity,
        },
        containerStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    // zIndex: -1,
  },
});

export default DummyAbsoluteView;

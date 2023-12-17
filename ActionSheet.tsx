import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  ViewStyle,
  TextStyle,
  StatusBarProps,
  TouchableOpacity,
  TouchableOpacityProps,
  TextProps,
  ViewProps,
  BackHandler,
} from "react-native";
import DummyAbsoluteView from "./DummyAbsoluteView";

const { height, width } = Dimensions.get("window");
const buttonColors = {
  red: "red",
  blue: "#007bff",
  green: "#28a745",
};

type actionSheetAnimationRefValueType = { x: number; y: number };

export type ActionSheetActionType = {
  label?: string;
  key: string;
  onPress?: () => {};
  customLabelContainerStyle?: ViewStyle;
  customLabelTextStyle?: TextStyle;
  type?: "normal" | "destructive" | "good";
};

export type ActionSheetPropsType = {
  visible: boolean;
  actionArray: ActionSheetActionType[];
  actionContainerStyle?: ViewStyle;
  actionLabelStyle?: TextStyle;
  backDropOpacity?: number;
  backDropContainerStyle?: ViewStyle;
  isStatusBarEnabled?: boolean;
  statusBarProps?: StatusBarProps;
  actionSheetListContainerStyle?: ViewStyle;
  actionListItemBackDropOpacity?: number;
  actionButtonContainerProps?: TouchableOpacityProps;
  actionButtonLabelProps?: TextProps;
  theme?: { primaryColor?: string; secondaryColor?: string };
  cancelButtonLabel?: string;
  cancelButtonProps?: TouchableOpacityProps;
  cancelButtonContainerStyle?: ViewStyle;
  cancelButtonLabelStyle?: TextStyle;
  itemSeprator?: React.ReactNode;
  itemSepratorStyle?: ViewStyle;
  itemSepratorProps?: ViewProps;
  onPressCancle?: () => void;
};

const ActionSheet = (props: ActionSheetPropsType) => {
  const {
    visible = false,
    actionArray = [],
    actionContainerStyle = {},
    actionLabelStyle = {},
    backDropOpacity = 0.5,
    backDropContainerStyle = {},
    isStatusBarEnabled = false,
    statusBarProps = {},
    actionSheetListContainerStyle = {},
    actionListItemBackDropOpacity = 0.4,
    actionButtonContainerProps = {},
    actionButtonLabelProps = {},
    theme = {
      primaryColor: "white",
      secondaryColor: "black",
    },
    cancelButtonLabel = "Cancel",
    cancelButtonProps = {},
    cancelButtonContainerStyle = {},
    cancelButtonLabelStyle = {},
    itemSeprator,
    itemSepratorStyle = {},
    itemSepratorProps = {},
    onPressCancle = () => {},
  } = props;

  const sheetPosAndScaleStartPoint: actionSheetAnimationRefValueType = {
    x: -(height * 0.6),
    y: 0.4,
  };
  const sheetPosAndScaleEndPoint: actionSheetAnimationRefValueType = {
    x: height * 0.07,
    y: 1,
  };
  const cancelBtnStartPoint: actionSheetAnimationRefValueType = {
    x: 0,
    y: 0.4,
  };
  const cancelBtnEndPoint: actionSheetAnimationRefValueType = {
    x: 1,
    y: 1,
  };

  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const actionSheetListBorderRadius = width * 0.07;
  const cancelBtnBorderRadius = width * 0.05;
  const actionSheetListPositionAndScale = useRef(
    new Animated.ValueXY(sheetPosAndScaleStartPoint)
  ).current;
  const cancelBtnOpacityAndScale = useRef(
    new Animated.ValueXY(cancelBtnStartPoint)
  ).current;

  const [sheetExist, setSheetExist] = useState<boolean>(false);

  const showNecessaryPropError = () => {
    if (!(props?.actionArray?.length > 0)) {
      console.error(
        "rn-custom-action-sheet : You must provide valid 'actionArray' to 'ActionSheet' to show options in action sheet."
      );
    }
  };
  useEffect(showNecessaryPropError, [props]);
  useEffect(() => {
    let backListner = BackHandler.addEventListener("hardwareBackPress", () => {
      if (visible) {
        onPressCancle();
      }
      return true;
    });
    return () => backListner.remove();
  }, [visible]);

  const timingFunc = (
    animationRef: Animated.Value | Animated.ValueXY,
    config: Animated.TimingAnimationConfig
  ) =>
    Animated.timing(animationRef, {
      ...config,
    });
  const parellelFunc = (arr: Animated.CompositeAnimation[]) =>
    Animated.parallel(arr);
  const sequenceFunc = (arr: Animated.CompositeAnimation[]) =>
    Animated.sequence(arr);

  const duration150 = {
    useNativeDriver: false,
    duration: 150,
  };
  const duration300 = {
    useNativeDriver: false,
    duration: 300,
  };

  const showSheet = () => {
    sequenceFunc([
      parellelFunc([
        timingFunc(sheetOpacity, {
          toValue: 1,
          ...duration150,
        }),
        timingFunc(actionSheetListPositionAndScale, {
          toValue: sheetPosAndScaleEndPoint,
          ...duration300,
        }),
        timingFunc(cancelBtnOpacityAndScale, {
          toValue: cancelBtnEndPoint,
          ...duration150,
          delay: 300,
        }),
      ]),
    ]).start();
  };
  const hideSheet = () => {
    sequenceFunc([
      parellelFunc([
        timingFunc(cancelBtnOpacityAndScale, {
          toValue: cancelBtnStartPoint,
          ...duration150,
        }),
        timingFunc(sheetOpacity, {
          toValue: 0,
          ...duration150,
          delay: 150,
        }),
        timingFunc(actionSheetListPositionAndScale, {
          toValue: sheetPosAndScaleStartPoint,
          ...duration300,
          delay: 150,
        }),
      ]),
    ]).start(() => {
      setSheetExist(false);
    });
  };

  useEffect(() => {
    if (visible) {
      setSheetExist(true);
      showSheet();
    } else {
      hideSheet();
    }
  }, [visible]);

  const renderActionSheetItem = (
    item: ActionSheetActionType,
    index: number
  ) => {
    const color =
      item?.type === "good"
        ? buttonColors.green
        : item?.type === "destructive"
        ? buttonColors.red
        : buttonColors.blue;
    return (
      <>
        <TouchableOpacity
          style={[
            styles.actionItemContainer,
            actionContainerStyle ?? {},
            item.customLabelContainerStyle ?? {},
          ]}
          key={item.key}
          {...actionButtonContainerProps}
        >
          <Text
            style={[
              styles.actionLabelStyle,
              { color },
              actionLabelStyle ?? {},
              item?.customLabelTextStyle ?? {},
            ]}
            numberOfLines={1}
            {...actionButtonLabelProps}
          >
            {item?.label ?? item?.key}
          </Text>
        </TouchableOpacity>
        {index != (actionArray?.length > 6 ? 5 : actionArray.length - 1) &&
          (itemSeprator ?? (
            <View
              style={[
                styles.itemSepratorStyle,
                {
                  backgroundColor: theme.secondaryColor,
                },
                itemSepratorStyle,
              ]}
              {...itemSepratorProps}
            />
          ))}
      </>
    );
  };

  if (!sheetExist) {
    return <></>;
  }

  return (
    <DummyAbsoluteView
      opacity={sheetOpacity}
      containerStyle={{ flex: 1, zIndex: 10000 }}
    >
      <DummyAbsoluteView
        opacity={backDropOpacity}
        containerStyle={backDropContainerStyle}
        backgroundColor={theme.secondaryColor}
      />
      <View style={[styles.actionListStyle, actionSheetListContainerStyle]}>
        <Animated.View
          style={[
            {
              borderRadius: actionSheetListBorderRadius,
              overflow: "hidden",
              position: "absolute",
              left: 0,
              right: 0,
              bottom: actionSheetListPositionAndScale.x,
              transform: [
                {
                  scale: actionSheetListPositionAndScale.y,
                },
              ],
            },
          ]}
        >
          <DummyAbsoluteView
            opacity={actionListItemBackDropOpacity}
            containerStyle={backDropContainerStyle}
          />
          {[...actionArray]?.slice(0, 6)?.map(renderActionSheetItem)}
        </Animated.View>
        <Animated.View
          style={{
            opacity: cancelBtnOpacityAndScale.x,
            transform: [
              {
                scale: cancelBtnOpacityAndScale.y,
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[
              styles.cancelButtonContainerStyle,
              {
                borderRadius: cancelBtnBorderRadius,
                paddingVertical: styles.actionItemContainer.paddingVertical,
              },
              cancelButtonContainerStyle,
            ]}
            activeOpacity={0.8}
            {...cancelButtonProps}
            onPress={onPressCancle}
          >
            <DummyAbsoluteView opacity={0.7} />
            <Text
              style={[
                styles.actionLabelStyle,
                styles.cancelButtonLabelStyle,
                cancelButtonLabelStyle,
              ]}
            >
              {cancelButtonLabel}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <>
        {!isStatusBarEnabled && (
          <StatusBar
            translucent={true}
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            {...statusBarProps}
          />
        )}
      </>
    </DummyAbsoluteView>
  );
};
const styles = StyleSheet.create({
  actionListStyle: {
    justifyContent: "flex-end",
    marginBottom: height * 0.02,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    width: width * 0.87,
    alignSelf: "center",
  },
  actionItemContainer: {
    backgroundColor: "transparent",
    paddingVertical: (height * 1.5) / 100,
    alignItems: "center",
  },
  actionLabelStyle: {
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
  cancelButtonContainerStyle: {
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: height * 0.01,
    overflow: "hidden",
  },
  cancelButtonLabelStyle: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  itemSepratorStyle: {
    height: height * 0.001,
    opacity: 0.2,
  },
});

export default ActionSheet;

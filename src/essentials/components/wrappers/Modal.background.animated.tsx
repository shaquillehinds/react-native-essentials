//$lf-ignore
import { type PropsWithChildren } from 'react';
import { StatusBar, View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { maxZIndex } from '../../styles';

export type ModalBackgroundAnimatedProps = {
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  onPress?: () => Promise<void> | void;
  avoidStatusBar?: boolean;
};

export function ModalBackgroundAnimated(
  props: PropsWithChildren<ModalBackgroundAnimatedProps>
) {
  const transparentBg = { backgroundColor: 'rgba(0,0,0,.2)' };

  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <Animated.View
        style={[
          { ...StyleSheet.absoluteFillObject, zIndex: maxZIndex },
          props.style,
          props.animatedStyle,
        ]}
      >
        {props.children ?? (
          <View
            style={[
              StyleSheet.absoluteFill,
              transparentBg,
              {
                marginTop: props.avoidStatusBar
                  ? StatusBar.currentHeight
                  : undefined,
              },
            ]}
          />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

import type { PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { ArcSpinnerAnimation } from '../../animations/ArcSpinner.animation';
import { transformSpacing } from '../../styles';
import {
  borderSizes,
  buttonSizes,
  fontSizes,
  radiusSizes,
} from '../../utils/sizeCalculations';
import { BaseText } from '../typography';
import { Press } from '../wrappers';
import type { ButtonProps } from './Button.types';

export function BaseButton(props: PropsWithChildren<ButtonProps>) {
  const sizes = buttonSizes[props.buttonSize || 'medium'];
  const configuredStyles: ViewStyle = {
    ...transformSpacing({ padding: props.padding }),
    borderWidth: borderSizes[props.borderWidth || 'thin'],
    borderColor: props.borderColor || 'transparent',
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
    borderRadius: props.borderRadius
      ? radiusSizes[props.borderRadius]
      : radiusSizes[sizes.borderRadius],
    width: sizes.width,
    alignSelf: props.alignSelf,
    backgroundColor: props.backgroundColor,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const contentStyle: ViewStyle = {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    opacity: props.loading ? 0 : 1,
  };
  const loadingContainerStyle: ViewStyle = {
    position: 'absolute',
  };

  const ViewComponent = props.animate
    ? Animated.View
    : (View as unknown as typeof Animated.View);

  const fontSize = props.fontSize || sizes.fontSize;
  return (
    <Press
      activeOpacity={props.disabled ? 0.5 : props.activeOpacity || 0.8}
      style={{
        ...transformSpacing({ margin: props.margin }),
        width: configuredStyles.width,
        alignSelf: configuredStyles.alignSelf || 'center',
      }}
      onPress={props.onPress}
      disabled={props.disabled || !!props.loading}
    >
      <ViewComponent style={[configuredStyles, props.style]}>
        <View style={contentStyle}>
          {props.leftComponent}
          <BaseText
            animate={props.animateText}
            animatedStyle={[
              { lineHeight: fontSizes[fontSize] * 1.3 },
              props.textStyle,
            ]}
            fontSize={fontSize}
            fontStyle={props.fontStyle || 'Medium'}
            customColor={props.customFontColor}
          >
            {props.children || 'Submit'}
          </BaseText>
          {props.rightComponent}
        </View>
        {props.loading ? (
          <View style={loadingContainerStyle}>
            <ArcSpinnerAnimation
              size={fontSizes[fontSize] * 1.3}
              color={props.customFontColor}
            />
          </View>
        ) : null}
      </ViewComponent>
    </Press>
  );
}

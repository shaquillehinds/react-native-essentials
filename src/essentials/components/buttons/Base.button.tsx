import type { PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Press } from '../wrappers';
import { BaseText } from '../typography';
import { transformSpacing } from '../../styles';
import type { ButtonProps } from './Button.types';
import {
  borderSizes,
  buttonSizes,
  radiusSizes,
} from '../../utils/sizeCalculations';
import { normalize } from '../../utils';

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
    alignItems: 'center',
    alignSelf: props.alignSelf,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: props.backgroundColor,
  };
  const ViewComponent = props.animate
    ? Animated.View
    : (View as unknown as typeof Animated.View);

  return (
    <Press
      activeOpacity={props.activeOpacity || 0.8}
      style={{
        ...transformSpacing({ margin: props.margin }),
        width: configuredStyles.width,
        alignSelf: configuredStyles.alignSelf || 'center',
      }}
      onPress={props.onPress}
    >
      <ViewComponent style={[configuredStyles, props.style]}>
        {props.leftComponent}
        <BaseText
          animate={props.animateText}
          animatedStyle={[{ lineHeight: normalize(19) }, props.textStyle]}
          fontSize={props.fontSize || sizes.fontSize}
          fontStyle={props.fontStyle || 'Medium'}
          customColor={props.customFontColor}
        >
          {props.children || 'Submit'}
        </BaseText>
        {props.rightComponent}
      </ViewComponent>
    </Press>
  );
}

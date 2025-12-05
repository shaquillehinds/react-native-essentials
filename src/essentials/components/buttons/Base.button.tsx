import type { PropsWithChildren } from 'react';
import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useDeviceOrientation, useFontSizes } from '../../hooks';
import { transformSpacing } from '../../styles';
import {
  borderSizes,
  buttonSizes,
  radiusSizes,
} from '../../utils/sizeCalculations';
import { BaseText } from '../typography';
import { Press } from '../wrappers';
import type { ButtonProps } from './Button.types';

export function BaseButton({
  buttonSize,
  padding,
  borderColor,
  borderWidth,
  borderRadius,
  alignSelf,
  backgroundColor,
  animate,
  loading,
  fontSize,
  disabled,
  margin,
  customFontColor,
  leftComponent,
  onPress,
  activeOpacity,
  textStyle,
  children,
  rightComponent,
  style,
  fontStyle,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  const orientation = useDeviceOrientation();
  const fontSizes = useFontSizes();
  const sizes = buttonSizes[buttonSize || 'medium'];
  const configuredStyles: ViewStyle = {
    ...transformSpacing({ padding, orientation }),
    borderWidth: borderSizes[borderWidth || 'thin'],
    borderColor: borderColor || 'transparent',
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
    borderRadius: borderRadius
      ? radiusSizes[borderRadius]
      : radiusSizes[sizes.borderRadius],
    width: sizes.width,
    alignSelf,
    backgroundColor,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const contentStyle: ViewStyle = {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    opacity: loading ? 0 : 1,
  };
  const loadingContainerStyle: ViewStyle = {
    position: 'absolute',
  };

  const ViewComponent = animate
    ? Animated.View
    : (View as unknown as typeof Animated.View);

  const fSize = fontSize || sizes.fontSize;
  return (
    <Press
      activeOpacity={disabled ? 0.5 : activeOpacity || 0.8}
      style={{
        ...transformSpacing({ margin, orientation }),
        width: configuredStyles.width,
        alignSelf: configuredStyles.alignSelf || 'center',
      }}
      onPress={onPress}
      disabled={disabled || !!loading}
    >
      <ViewComponent style={[configuredStyles, style]}>
        <View style={contentStyle}>
          {leftComponent}
          <BaseText
            {...rest}
            customColor={customFontColor}
            fontSize={fSize}
            fontStyle={fontStyle || 'Medium'}
            animatedStyle={[{ lineHeight: fontSizes[fSize] * 1.3 }, textStyle]}
          >
            {children || 'Submit'}
          </BaseText>
          {rightComponent}
        </View>
        {loading ? (
          <View style={loadingContainerStyle}>
            <ActivityIndicator size="small" color={customFontColor} />
          </View>
        ) : null}
      </ViewComponent>
    </Press>
  );
}

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
import { AbsoluteLinearGradient } from '../../svgs';

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
  onPress,
  activeOpacity,
  textStyle,
  children,
  leftComponent,
  leftComponentGap,
  rightComponent,
  rightComponentGap,
  style,
  fontStyle,
  enableRapidPress,
  gradientEnd,
  gradientStart,
  gradientOpacities,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  const orientation = useDeviceOrientation();
  const fontSizes = useFontSizes();
  const isGradient = typeof backgroundColor === 'object';
  const sizes = buttonSizes[buttonSize || 'medium'];
  const radius =
    typeof borderRadius === 'number'
      ? borderRadius
      : borderRadius
        ? radiusSizes[borderRadius]
        : radiusSizes[sizes.borderRadius];
  const borderConfig = {
    borderWidth: borderSizes[borderWidth || 'thin'],
    borderColor: borderColor || 'transparent',
    borderRadius: radius,
  };

  const configuredStyles: ViewStyle = {
    borderRadius: radius - 1,
    overflow: 'hidden',
    width: sizes.width,
    alignSelf,
    backgroundColor: isGradient ? undefined : backgroundColor,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const contentStyle: ViewStyle = {
    ...transformSpacing({ padding, orientation }),
    paddingHorizontal: sizes.paddingHorizontal,
    paddingVertical: sizes.paddingVertical,
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
      enableRapidPress={enableRapidPress}
      activeOpacity={disabled ? 0.5 : activeOpacity || 0.8}
      style={{
        ...transformSpacing({ margin, orientation }),
        ...borderConfig,
        overflow: 'hidden',
        width: configuredStyles.width,
        alignSelf: configuredStyles.alignSelf || 'center',
      }}
      onPress={onPress}
      disabled={disabled || !!loading}
    >
      <>
        <ViewComponent style={[configuredStyles, style]}>
          {isGradient ? (
            <AbsoluteLinearGradient
              colors={backgroundColor}
              end={gradientEnd}
              start={gradientStart}
              opacities={gradientOpacities}
            />
          ) : undefined}
          <View style={contentStyle}>
            {leftComponent}
            <BaseText
              {...rest}
              style={{
                marginRight: rightComponentGap,
                marginLeft: leftComponentGap,
              }}
              customColor={customFontColor}
              fontSize={fSize}
              fontStyle={fontStyle || 'Medium'}
              animatedStyle={[
                { lineHeight: fontSizes[fSize] * 1.3 },
                textStyle,
              ]}
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
      </>
    </Press>
  );
}

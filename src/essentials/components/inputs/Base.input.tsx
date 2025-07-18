import {
  TextInput,
  type DimensionValue,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { RowLayout } from '../layouts';
import type { BaseInputProps } from './Input.types';
import { isAndroid } from '../../constants/device.const';
import { useRef, useState } from 'react';

export function BaseInput({
  backgroundColor,
  textInputProps,
  RightComponent,
  LeftComponent,
  TextInputComponent,
  refTextInput,
  focusedBorderColor,
  blurredBorderColor,
  style,
  ...rest
}: BaseInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  let width = 100;
  if (LeftComponent) width -= 10;
  if (RightComponent) width -= 10;
  const layoutStyle: StyleProp<ViewStyle> = {
    width: '100%' as DimensionValue,
    borderWidth: 1,
    borderColor: isFocused
      ? focusedBorderColor || '#4A87F2'
      : blurredBorderColor || 'transparent',
  };
  const inputStyle: StyleProp<TextStyle> = { width: '100%' as DimensionValue };
  if (refTextInput) refTextInput.current = inputRef.current;
  return (
    <RowLayout
      center
      spaceBetween
      backgroundColor={backgroundColor}
      padding={[isAndroid ? 0.4 : 1.5, 4]}
      style={[layoutStyle, style]}
      {...rest}
    >
      <RowLayout style={{ width: `${width}%` }}>
        {LeftComponent}
        {TextInputComponent ? (
          <TextInputComponent
            ref={inputRef}
            placeholder={textInputProps.placeholder ?? 'Type here...'}
            style={[inputStyle, textInputProps.style]}
            {...textInputProps}
            onTouchEnd={(e) => {
              inputRef.current?.focus();
              textInputProps.onTouchEnd?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              textInputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              textInputProps.onBlur?.(e);
            }}
          />
        ) : (
          <TextInput
            ref={inputRef}
            {...textInputProps}
            placeholder={textInputProps.placeholder ?? 'Type here...'}
            style={[inputStyle, textInputProps.style]}
            onTouchEnd={(e) => {
              inputRef.current?.focus();
              textInputProps.onTouchEnd?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              textInputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              textInputProps.onBlur?.(e);
            }}
          />
        )}
      </RowLayout>
      {RightComponent}
    </RowLayout>
  );
}

import { TextInput, type DimensionValue } from 'react-native';
import { RowLayout } from '../layouts';
import type { BaseInputProps } from './Input.types';

export function BaseInput({
  backgroundColor,
  textInputProps,
  RightComponent,
  LeftComponent,
  TextInputComponent,
  refTextInput,
  style,
  ...rest
}: BaseInputProps) {
  let width = 100;
  if (LeftComponent) width -= 10;
  if (RightComponent) width -= 10;
  const layoutStyle = { width: '100%' as DimensionValue };
  const inputStyle = { width: '100%' as DimensionValue };
  return (
    <RowLayout
      center
      spaceBetween
      backgroundColor={backgroundColor}
      padding={[1.5, 4]}
      style={[layoutStyle, style]}
      {...rest}
    >
      <RowLayout style={{ width: `${width}%` }}>
        {LeftComponent}
        {TextInputComponent ? (
          <TextInputComponent
            ref={refTextInput}
            {...textInputProps}
            style={[inputStyle, textInputProps.style]}
          />
        ) : (
          <TextInput
            ref={refTextInput}
            {...textInputProps}
            style={[inputStyle, textInputProps.style]}
          />
        )}
      </RowLayout>
      {RightComponent}
    </RowLayout>
  );
}

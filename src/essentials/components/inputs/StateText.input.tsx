import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { TextInput, type TextInputProps } from 'react-native';

export type StateInputRef = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export type StateInputProps = TextInputProps & {
  refStateInput?: React.Ref<StateInputRef>;
  refStateInputValidator?: (text: string) => boolean;
};

export const StateTextInput = forwardRef<TextInput, StateInputProps>(
  ({ onChangeText, refStateInput, refStateInputValidator, ...rest }, ref) => {
    const [value, setValue] = useState('');

    const onTextChange = useCallback(
      (val: string) => {
        if (refStateInputValidator) {
          if (refStateInputValidator(val)) {
            setValue(val);
            onChangeText?.(val);
          }
        } else {
          setValue(val);
          onChangeText?.(val);
        }
      },
      [onChangeText]
    );

    useImperativeHandle(refStateInput, () => ({
      value,
      setValue,
    }));

    //prettier-ignore
    return <TextInput ref={ref} {...rest} value={value} onChangeText={onTextChange} />;
  }
);

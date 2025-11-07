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
};

export const StateTextInput = forwardRef<TextInput, StateInputProps>(
  ({ onChangeText, refStateInput, ...rest }, ref) => {
    const [value, setValue] = useState('');

    const onTextChange = useCallback(
      (val: string) => {
        setValue(val);
        onChangeText?.(val);
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

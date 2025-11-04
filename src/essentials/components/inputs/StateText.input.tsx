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
export type StateInputProps = {
  refStateInput?: React.MutableRefObject<StateInputRef | null>;
} & TextInputProps;

export const StateTextInput = forwardRef(function ({
  refStateInput,
  onChangeText,
  ...rest
}: StateInputProps) {
  const [value, setValue] = useState('');
  const onTextChange = useCallback((val: string) => {
    setValue(val);
    onChangeText?.(val);
  }, []);
  useImperativeHandle(refStateInput, () => ({
    value,
    setValue,
  }));
  return <TextInput {...rest} value={value} onChangeText={onTextChange} />;
});

import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';

type UseInputRefProps = {
  inputValidationFunction?: (text: string) => boolean;
};

/**
 * 
 * @description If you're using an inputValidationFunction you must 
 * use the inputValue and defaultInputValue returned from this as well
 * @example 
 * const [inputRef, onChangeText, inputValue, defaultInputValue] = useInputRef({ inputValidationFunction: (text: string)=> text.length <= 10 })
 *
<TextInput
    inputRef={inputRef}
    onChangeText={onChangeText}
    value={inputValue}
    defaultValue={inputDefaultValue}
/>
 */
export function useInputRef(props?: UseInputRefProps) {
  const inputRef = useRef<TextInput & { value: string }>(null);
  const [inputValue, setInputValue] = useState<string>();
  const [defaultInputValue, setDefaultInputValue] = useState<string>();
  const onChangeText = (text: string) => {
    if (inputRef.current) {
      if (props?.inputValidationFunction) {
        if (props.inputValidationFunction(text)) {
          if (inputValue) {
            setInputValue(undefined);
            setDefaultInputValue(text);
          }
          inputRef.current.value = text;
        } else {
          !inputValue && setInputValue(inputRef.current.value || '');
        }
      } else inputRef.current.value = text;
    }
  };
  return [inputRef, onChangeText, inputValue, defaultInputValue] as const;
}

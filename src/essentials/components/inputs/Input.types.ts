import type { TextInput, TextInputProps } from 'react-native';
import type { LayoutProps } from '../layouts';
import type { StateInputProps, StateInputRef } from './StateText.input';

export type BaseInputProps = {
  backgroundColor: string;
  focusedBorderColor?: string;
  blurredBorderColor?: string;
  textInputProps: TextInputProps;
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
  TextInputComponent?: (
    props: TextInputProps & {
      ref?: React.RefObject<TextInput>;
    }
  ) => React.JSX.Element;
  refTextInput?: React.MutableRefObject<TextInput | null>;
  refStateInput?: React.Ref<StateInputRef>;
  refStateInputValidator?: (text: string) => boolean;
} & LayoutProps &
  Pick<StateInputProps, 'refStateInputValidator'>;

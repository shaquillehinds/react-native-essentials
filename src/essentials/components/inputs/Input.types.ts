import type { TextInput, TextInputProps } from 'react-native';
import type { LayoutProps } from '../layouts';

export type BaseInputProps = {
  backgroundColor: string;
  textInputProps: TextInputProps;
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
  TextInputComponent?: (
    props: TextInputProps & {
      ref?: React.RefObject<TextInput>;
    }
  ) => React.JSX.Element;
  refTextInput?: React.RefObject<TextInput>;
} & LayoutProps;

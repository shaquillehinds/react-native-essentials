import type { PropsWithChildren } from 'react';
import type { BaseTextProps } from './Text.types';
import { BaseText } from './Base.text';

interface TitleTextProps extends BaseTextProps {
  fontSize?: 'titleS' | 'titleM' | 'titleL';
}

export function Title(props: PropsWithChildren<TitleTextProps>) {
  return (
    <BaseText
      {...props}
      fontSize={props.fontSize ? props.fontSize : 'titleM'}
      fontStyle={props.fontStyle ? props.fontStyle : 'Medium'}
    />
  );
}

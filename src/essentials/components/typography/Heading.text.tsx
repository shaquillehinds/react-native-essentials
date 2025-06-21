import { type PropsWithChildren } from 'react';
import { BaseText } from './Base.text';
import type { BaseTextProps } from './Text.types';

interface HeadingTextProps extends BaseTextProps {
  fontSize?: 'headingM' | 'headingL';
}

export function Heading(props: PropsWithChildren<HeadingTextProps>) {
  return (
    <BaseText
      {...props}
      fontSize={props.fontSize ? props.fontSize : 'headingS'}
      fontStyle={props.fontStyle ? props.fontStyle : 'SemiBold'}
    />
  );
}

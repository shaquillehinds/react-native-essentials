import type { PropsWithChildren } from 'react';
import { BaseText } from './Base.text';
import type { BaseTextProps } from './Text.types';

interface BodyTextProps extends BaseTextProps {
  fontSize?: 'bodyL' | 'bodyS';
}

export function Body(props: PropsWithChildren<BodyTextProps>) {
  return <BaseText {...props} />;
}

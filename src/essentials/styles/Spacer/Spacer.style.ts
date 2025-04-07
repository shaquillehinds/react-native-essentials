import { relativeX, relativeY } from '../../utils/layout';
import type { Spaces } from './Spacer.types';

export type SpaceType = 'padding' | 'margin';

export const spacerStyles =
  (spaceType: SpaceType) =>
  (s1: number, s2?: number, s3?: number, s4?: number) => {
    let top = s1,
      right = s1,
      bottom = s1,
      left = s1;

    if (s2 !== undefined && s3 === undefined) {
      right = s2;
      left = s2;
    } else if (s2 !== undefined && s3 !== undefined && s4 === undefined) {
      right = s2;
      left = s2;
      bottom = s3;
    } else if (s2 !== undefined && s3 !== undefined && s4 !== undefined) {
      right = s2;
      bottom = s3;
      left = s4;
    }

    if (spaceType === 'margin') {
      return {
        marginTop: relativeY(top),
        marginRight: relativeX(right),
        marginBottom: relativeY(bottom),
        marginLeft: relativeX(left),
      };
    } else
      return {
        paddingTop: relativeY(top),
        paddingRight: relativeX(right),
        paddingBottom: relativeY(bottom),
        paddingLeft: relativeX(left),
      };
  };

export function transformSpacing({
  margin,
  padding,
}: {
  margin?: Spaces;
  padding?: Spaces;
}) {
  const marginSpace = margin ? spacerStyles('margin')(...margin) : {};
  const paddingSpace = padding ? spacerStyles('padding')(...padding) : {};
  return { ...marginSpace, ...paddingSpace };
}

export type Spacer = ReturnType<typeof spacerStyles>;

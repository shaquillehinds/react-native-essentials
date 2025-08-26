import type { UseDeviceOrientationReturnType } from '../../hooks/useDeviceOrientation';
import { relativeX, relativeY } from '../../utils';
import type { Spaces } from './Spacer.types';

export type SpaceType = 'padding' | 'margin';

export const spacerStyles =
  (
    spaceType: SpaceType,
    options?: { orientation?: Partial<UseDeviceOrientationReturnType> }
  ) =>
  (s1: number, s2?: number, s3?: number, s4?: number) => {
    const relY = options?.orientation?.relativeY || relativeY;
    const relX = options?.orientation?.relativeX || relativeX;
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
        marginTop: relY(top),
        marginRight: relX(right),
        marginBottom: relY(bottom),
        marginLeft: relX(left),
      };
    } else
      return {
        paddingTop: relY(top),
        paddingRight: relX(right),
        paddingBottom: relY(bottom),
        paddingLeft: relX(left),
      };
  };

export function transformSpacing({
  margin,
  padding,
  orientation,
}: {
  margin?: Spaces;
  padding?: Spaces;
  orientation?: Partial<UseDeviceOrientationReturnType>;
}) {
  const marginSpace = margin
    ? spacerStyles('margin', { orientation })(...margin)
    : {};
  const paddingSpace = padding
    ? spacerStyles('padding', { orientation })(...padding)
    : {};
  return { ...marginSpace, ...paddingSpace };
}

export type Spacer = ReturnType<typeof spacerStyles>;

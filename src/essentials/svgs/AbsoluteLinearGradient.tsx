import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export type AbsoluteLinearGradientProps = {
  colors: string[];
  style?: StyleProp<ViewStyle>;
  opacities?: number[];
  start?: { x: number | string; y: number | string };
  end?: { x: number | string; y: number | string };
};

export function AbsoluteLinearGradient({
  colors,
  style,
  opacities = [1, 1],
  start = { x: '0', y: '0' },
  end = { x: '1', y: '0' },
}: PropsWithChildren<AbsoluteLinearGradientProps>) {
  return (
    <Svg height="100%" width="100%" style={[{ position: 'absolute' }, style]}>
      <Defs>
        <LinearGradient
          id="grad"
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
        >
          {colors.map((color, index) => (
            <Stop
              key={`stop-${index}`}
              offset={index / (colors.length - 1)}
              stopColor={color}
              stopOpacity={opacities[index] ?? 1}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  );
}

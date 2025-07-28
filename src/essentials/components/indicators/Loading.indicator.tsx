import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { hexOpacity } from '../../algorithms';
import { ViewDimensionsInjector } from '../injectors/ViewDimensions.injector';
import { View, type StyleProp, type ViewStyle } from 'react-native';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const DOT_COUNT = 4;
const DURATION = 800;

export type LoadingIndicatorProps = {
  width: number;
  TopComponent?: React.JSX.Element;
  BottomComponent?: React.JSX.Element;
  hexColor?: `#${string}`;
};

export function LoadingIndicator(props: Omit<LoadingIndicatorProps, 'width'>) {
  return (
    <ViewDimensionsInjector
      renderItem={(d) => (
        <LoadingIndicatorAnimation width={d.width} {...props} />
      )}
    />
  );
}

function LoadingIndicatorAnimation({
  width,
  hexColor,
  TopComponent,
  BottomComponent,
}: LoadingIndicatorProps) {
  let animationWidth = width * 0.5;
  let animationHeight = animationWidth * 0.4;
  let color = '#BBBBBB';
  if (hexColor && hexColor[0] === '#') {
    if (hexColor.length < 7) hexColor += hexColor.slice(1, 3);
    color = hexColor.slice(0, 7);
  }

  // ✅ Use separate shared values per dot
  const progressValues = Array.from({ length: DOT_COUNT }).map(() =>
    useSharedValue(0)
  );

  useEffect(() => {
    for (let i = 0; i < DOT_COUNT; i++) {
      progressValues[i]!.value = withDelay(
        i * (DURATION / 5),
        withRepeat(
          withTiming(1, {
            duration: DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        )
      );
    }

    return () => {
      for (const progress of progressValues) {
        cancelAnimation(progress);
      }
    };
  }, []);

  const DOT_SIZE = animationHeight / 3;
  const DOT_RADIUS = DOT_SIZE / 2;
  const DOT_SPACING = DOT_RADIUS * 2.3;

  const MAX_HEIGHT_MULTIPLIER = 2.9;

  const MAX_HEIGHT = DOT_SIZE * MAX_HEIGHT_MULTIPLIER;
  const MIN_HEIGHT = DOT_SIZE;

  const containerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  };

  return (
    <View style={containerStyle}>
      {TopComponent}
      <Svg width={animationWidth} height={animationHeight}>
        {progressValues.map((progress, i) => {
          const animatedProps = useAnimatedProps(() => ({
            height: MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * progress.value,
            width: MIN_HEIGHT,
            rx: DOT_RADIUS,
            ry: DOT_RADIUS,
            transform: [
              {
                translateY: -(
                  progress.value *
                  (MAX_HEIGHT * (MAX_HEIGHT_MULTIPLIER / 8.8))
                ),
              },
            ],
          }));
          return (
            <AnimatedRect
              key={i}
              animatedProps={animatedProps}
              x={i * (DOT_SPACING + MIN_HEIGHT)}
              y={MAX_HEIGHT / MAX_HEIGHT_MULTIPLIER}
              height={DOT_SIZE}
              fill={color + hexOpacity(0.9 - i * 0.15)}
            />
          );
        })}
      </Svg>
      {BottomComponent}
    </View>
  );
}

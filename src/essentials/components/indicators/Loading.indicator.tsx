import { ViewDimensionsInjector } from '../injectors/ViewDimensions.injector';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { ArcSpinnerAnimation } from '../../animations/ArcSpinner.animation';

export type LoadingIndicatorProps = {
  TopComponent?: React.JSX.Element;
  BottomComponent?: React.JSX.Element;
  opacity?: number;
  backgroundColor?: string;
  animationColor?: string;
};

export function LoadingIndicator({
  TopComponent,
  BottomComponent,
  backgroundColor,
  animationColor,
  opacity,
}: LoadingIndicatorProps) {
  const containerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    backgroundColor: backgroundColor,
    opacity,
  };
  return (
    <ViewDimensionsInjector
      renderItem={(d) => (
        <View style={containerStyle}>
          {TopComponent}
          <ArcSpinnerAnimation size={d.width / 2.5} color={animationColor} />
          {BottomComponent}
        </View>
      )}
    />
  );
}

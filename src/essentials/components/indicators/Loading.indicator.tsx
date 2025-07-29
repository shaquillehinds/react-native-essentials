import { ViewDimensionsInjector } from '../injectors/ViewDimensions.injector';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { ArcSpinnerAnimation } from '../../animations/ArcSpinner.animation';

export type LoadingIndicatorProps = {
  TopComponent?: React.JSX.Element;
  BottomComponent?: React.JSX.Element;
  color?: `#${string}`;
};

export function LoadingIndicator({
  TopComponent,
  BottomComponent,
  color,
}: LoadingIndicatorProps) {
  const containerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  };
  return (
    <ViewDimensionsInjector
      renderItem={(d) => (
        <View style={containerStyle}>
          {TopComponent}
          <ArcSpinnerAnimation size={d.width / 2} color={color} />
          {BottomComponent}
        </View>
      )}
    />
  );
}

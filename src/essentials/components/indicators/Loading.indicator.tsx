import {
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type LoadingIndicatorProps = {
  TopComponent?: React.JSX.Element;
  BottomComponent?: React.JSX.Element;
  opacity?: number;
  backgroundColor?: string;
  animationColor?: string;
  absolute?: boolean;
};

export function LoadingIndicator({
  TopComponent,
  BottomComponent,
  backgroundColor,
  animationColor,
  opacity,
  absolute,
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
  if (absolute) containerStyle.position = 'absolute';
  return (
    <View style={containerStyle}>
      {TopComponent}
      <ActivityIndicator size={'large'} color={animationColor} />
      {BottomComponent}
    </View>
  );
}

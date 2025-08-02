import {
  View,
  type FlexStyle,
  type LayoutRectangle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useViewDimensions } from '../../hooks/useViewDimensions';

export type ViewDimensionsInjectorProps = {
  absolute?: boolean;
  justifyContent?: FlexStyle['justifyContent'];
  aligntItems?: FlexStyle['alignItems'];
  renderItem: (dimensions: LayoutRectangle) => React.ReactNode;
};

export function ViewDimensionsInjector(props: ViewDimensionsInjectorProps) {
  const [viewDimensions, onLayout] = useViewDimensions();
  const containerStyle: StyleProp<ViewStyle> = {
    width: '100%',
    height: '100%',
    justifyContent: props.justifyContent || 'center',
    alignItems: props.aligntItems || 'center',
  };
  if (props.absolute) containerStyle.position = 'absolute';
  return (
    <View collapsable={false} style={containerStyle} onLayout={onLayout}>
      {viewDimensions ? props.renderItem(viewDimensions) : null}
    </View>
  );
}

import { useState } from 'react';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';

export function useViewDimensions() {
  const [viewDimensions, setViewDimensions] = useState<LayoutRectangle | null>(
    null
  );
  const onLayout = (e: LayoutChangeEvent) => {
    setViewDimensions(e.nativeEvent.layout);
  };
  return [viewDimensions, onLayout] as const;
}

import type { BorderSize } from '../buttons';
import { Layout } from '../layouts';

export function RadioIcon({
  isSelected = false,
  selectedColor = '#4A87F2',
  unSelectedColor = '#D9D9D9',
  size = 2,
  borderWidth = 'medium',
  alwaysShowCenter = false,
}: {
  isSelected?: boolean;
  selectedColor?: string;
  unSelectedColor?: string;
  size?: number;
  borderWidth?: BorderSize;
  alwaysShowCenter?: boolean;
}) {
  return (
    <Layout
      square={size}
      center
      centerX
      borderRadius="full"
      borderWidth={borderWidth}
      borderColor={isSelected ? selectedColor : unSelectedColor}
    >
      {(alwaysShowCenter || isSelected) && (
        <Layout
          square={size / 2.5}
          borderRadius="full"
          backgroundColor={isSelected ? selectedColor : unSelectedColor}
        />
      )}
    </Layout>
  );
}

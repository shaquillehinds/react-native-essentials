import Svg, { Path } from 'react-native-svg';
import { normalize } from '../utils';

export default function ArcCircle({
  size,
  color,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg
      width={normalize(size || 24)}
      height={normalize(size || 24)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 0C12.3368 0 12.6703 0.0138134 13 0.0410156C6.84047 0.549164 2 5.70933 2 12C2 18.2906 6.84051 23.4498 13 23.958C12.6702 23.9852 12.3368 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0Z"
        fill={color || 'black'}
      />
    </Svg>
  );
}

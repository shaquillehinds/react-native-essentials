import { View } from 'react-native';
import { maxZIndex } from '../../styles';
import { type PropsWithChildren } from 'react';
import { isIOS } from '@shaquillehinds/react-native-essentials';

/**
 * @description Very important your animated views are wrapped in a regular react native view
 * @Android Stops keyboard from shifting foreground content. You should animate that yourself
 * @iOS Makes the foreground component visible and not hidden behind background
 */
export function ModalForegroundWrapper({ children }: PropsWithChildren) {
  return (
    <View style={{ zIndex: isIOS ? maxZIndex : undefined }}>{children}</View>
  );
}

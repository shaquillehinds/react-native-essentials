# react-native-essentials

# API Documentation

Complete API reference for React Native Essentials.

## Table of Contents

- [Constants](#constants)
- [Components](#components)
  - [Layouts](#layouts)
  - [Typography](#typography)
  - [Buttons](#buttons)
  - [Inputs](#inputs)
  - [Providers](#providers)
  - [Wrappers](#wrappers)
  - [Indicators](#indicators)
  - [Injectors](#injectors)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Animations](#animations)
- [Gestures](#gestures)
- [Styles](#styles)
- [Algorithms](#algorithms)

---

## Constants

### Device Constants

Access device dimensions and platform information.

#### Exports

```tsx
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  initialOrientation,
  aspectRatio,
  isSmallDevice,
  isLargeDevice,
  isIOS,
  isWeb,
  isTablet,
  isIpad,
  isAndroid,
  type DeviceOrientation,
  type ScaledSizeDimensions,
} from '@shaquillehinds/react-native-essentials';
```

#### Values

- `SCREEN_WIDTH: number` - Full screen width
- `SCREEN_HEIGHT: number` - Full screen height
- `WINDOW_WIDTH: number` - Window width (excludes system UI)
- `WINDOW_HEIGHT: number` - Window height (excludes system UI)
- `initialOrientation: DeviceOrientation` - Initial device orientation ('portrait' | 'landscape')
- `aspectRatio: number` - Screen aspect ratio
- `isSmallDevice: boolean` - True if screen is smaller than 375x750
- `isLargeDevice: boolean` - True if screen width > 1100
- `isIOS: boolean | undefined` - True if iOS platform
- `isWeb: boolean | undefined` - True if web platform
- `isTablet: boolean` - True if aspect ratio <= 1.6
- `isIpad: boolean` - True if iOS tablet
- `isAndroid: boolean | undefined` - True if Android platform

---

## Components

### Layouts

Flexible layout components with responsive spacing and styling.

#### Layout

Versatile container component with extensive layout options.

> **💡 Important**: When passing numbers to `width` and `height` props, they are automatically treated as percentages of screen dimensions. `width={80}` means 80% of screen width, `height={50}` means 50% of screen height. The component internally applies `relativeX()` and `relativeY()` conversions. You can also pass string values like `'100%'` or `'50px'` for standard React Native sizing.

```tsx
import { Layout } from '@shaquillehinds/react-native-essentials';

<Layout
  center
  padding={[5]}
  backgroundColor="#ffffff"
  width={90} // 90% of screen width (converted internally)
  height={50} // 50% of screen height (converted internally)
>
  {children}
</Layout>;
```

**Props:**

```tsx
interface LayoutProps<Scrollable extends boolean | undefined = undefined> {
  // Spacing
  margin?: Spacing;
  padding?: Spacing;

  // Dimensions (percentages of screen or DimensionValue)
  // IMPORTANT: Numbers are automatically converted to percentages
  // width={80} → 80% of screen width (relativeX applied internally)
  // height={50} → 50% of screen height (relativeY applied internally)
  width?: DimensionValue;
  height?: DimensionValue;

  // Flex
  flex?: [number] | [number, number] | [number, number, DimensionValue];
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: boolean;

  // Alignment
  center?: boolean; // Center both axes
  centerX?: boolean; // Center horizontally
  alignSelf?: FlexAlignType;
  spaceEnd?: boolean;
  spaceStart?: boolean;
  spaceEven?: boolean;
  spaceCenter?: boolean;
  spaceBetween?: boolean;

  // Position
  absolute?: boolean;
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;

  // Appearance
  backgroundColor?: string;

  // States
  loading?: LoadingIndicatorProps | boolean;
  skeleton?: { colors?: string[] } | boolean;

  // Scrolling
  scrollable?: Scrollable;

  // Standard props
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
```

**Spacing Type:**

```tsx
type Spaces = [number, number?, number?, number?];

type Spacing = {
  /**
   * This padding/margin shorthand follows the classic CSS shorthand.
   * Numbers are used as percentages of screen width or height.
   * - [10] = {top: 10%, right: 10%, bottom: 10%, left: 10%}
   * - [10, 20] = {top: 10%, right: 20%, bottom: 10%, left: 20%}
   * - [10, 20, 30] = {top: 10%, right: 20%, bottom: 30%, left: 20%}
   * - [10, 20, 30, 40] = {top: 10%, right: 20%, bottom: 30%, left: 40%}
   */
  padding?: Spaces;
  margin?: Spaces;
};
```

#### RowLayout

Horizontal layout component (shorthand for flexDirection='row').

```tsx
import { RowLayout } from '@shaquillehinds/react-native-essentials';

<RowLayout spaceBetween padding={[0, 4]}>
  <Text>Left</Text>
  <Text>Right</Text>
</RowLayout>;
```

#### ScreenLayout

Full-screen container with safe area support.

```tsx
import { ScreenLayout } from '@shaquillehinds/react-native-essentials';

<ScreenLayout backgroundColor="#f5f5f5">{children}</ScreenLayout>;
```

**Props:**

```tsx
interface ScreenLayoutProps extends LayoutProps {
  // Inherits all Layout props
}
```

#### AnimatedLayout

Layout component using Reanimated's Animated.View and Animated.ScrollView instead of standard React Native views. Identical props to Layout, but renders with Reanimated components for better animation performance.

```tsx
import { AnimatedLayout } from '@shaquillehinds/react-native-essentials';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function Component() {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedLayout center padding={[5]} style={animatedStyle}>
      {children}
    </AnimatedLayout>
  );
}
```

**Props:**

```tsx
interface AnimatedLayoutProps extends LayoutProps {
  // Identical to LayoutProps - uses Reanimated components internally
}
```

---

### Typography

Text components with consistent styling.

#### BaseText

Foundation text component with font management.

```tsx
import { BaseText } from '@shaquillehinds/react-native-essentials';

<BaseText fontSize="large" fontStyle="Bold" customColor="#000000">
  Text Content
</BaseText>;
```

**Props:**

```tsx
interface BaseTextProps extends TextProps {
  fontSize?: FontSize;
  fontStyle?: FontStyle;
  customColor?: string;
  animate?: boolean;
  animatedStyle?: AnimatedStyleProp<TextStyle>;
  children?: ReactNode;
}

type FontSize =
  | 'headingL'
  | 'headingM'
  | 'headingS'
  | 'titleL'
  | 'titleM'
  | 'titleS'
  | 'bodyL'
  | 'bodyM'
  | 'bodyS';

type FontStyle =
  | 'Thin'
  | 'Extra Light'
  | 'Light'
  | 'Regular'
  | 'Medium'
  | 'SemiBold'
  | 'Bold'
  | 'ExtraBold'
  | 'Black';
```

#### Title

Large title text component.

```tsx
import { Title } from '@shaquillehinds/react-native-essentials';

<Title>Page Title</Title>;
```

#### Heading

Section heading component.

```tsx
import { Heading } from '@shaquillehinds/react-native-essentials';

<Heading>Section Heading</Heading>;
```

#### Body

Body text component.

```tsx
import { Body } from '@shaquillehinds/react-native-essentials';

<Body>Body text content</Body>;
```

#### Translate

Auto-translating text component (requires LocalizationProvider).

```tsx
import { Translate } from '@shaquillehinds/react-native-essentials';

<Translate>Hello World</Translate>;
```

---

### Buttons

#### BaseButton

Customizable button component with loading states and animations.

```tsx
import { BaseButton } from '@shaquillehinds/react-native-essentials';

<BaseButton
  buttonSize="large"
  backgroundColor="#007AFF"
  borderRadius="curvy"
  loading={false}
  disabled={false}
  onPress={() => console.log('Pressed')}
  leftComponent={<Icon />}
  rightComponent={<Icon />}
>
  Button Text
</BaseButton>;
```

**Props:**

```tsx
interface ButtonProps extends Omit<BaseTextProps, 'children'> {
  // Size
  buttonSize?: 'small' | 'medium' | 'large' | 'auto' | 'wide';

  // Spacing (uses Spacing type with array syntax)
  margin?: Spaces; // e.g., [5], [5, 10], [5, 10, 5, 10]
  padding?: Spaces; // e.g., [5], [5, 10], [5, 10, 5, 10]

  // Border
  borderColor?: string;
  borderWidth?: 'razor' | 'thin' | 'medium' | 'large';
  borderRadius?: 'edgy' | 'sharp' | 'medium' | 'soft' | 'curvy' | 'round';

  // Appearance
  backgroundColor?: string;
  customFontColor?: string;
  alignSelf?: FlexAlignType;

  // Behavior
  onPress?: () => void;
  disabled?: boolean;
  loading?: LoadingIndicatorProps | boolean;
  activeOpacity?: number;

  // Components
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;

  // Animation
  animate?: boolean;

  // Style
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  textStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  fontStyle?: FontStyle;

  children?: ReactNode;
}
```

---

### Inputs

#### BaseInput

Foundation input component with flexible rendering options and ref management.

```tsx
import { BaseInput } from '@shaquillehinds/react-native-essentials';
import { useRef } from 'react';

function Component() {
  // Option 1: Use standard TextInput ref
  const inputRef = useRef<TextInput>(null);

  return (
    <BaseInput
      backgroundColor="#ffffff"
      focusedBorderColor="#007AFF"
      blurredBorderColor="#cccccc"
      textInputProps={{
        placeholder: 'Enter text',
        onChangeText: (text) => console.log(text),
      }}
      refTextInput={inputRef}
      LeftComponent={<Icon name="search" />}
      RightComponent={<Icon name="clear" />}
      padding={[3]}
    />
  );
}
```

**Props:**

```tsx
interface BaseInputProps extends LayoutProps {
  backgroundColor: string;
  focusedBorderColor?: string;
  blurredBorderColor?: string;
  textInputProps: TextInputProps;
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
  TextInputComponent?: (
    props: TextInputProps & {
      ref?: React.RefObject<TextInput>;
    }
  ) => React.JSX.Element;
  refTextInput?: React.MutableRefObject<TextInput | null>;
  refStateInput?: React.Ref<StateInputRef>;
  refStateInputValidator?: (text: string) => boolean;
  // Inherits all LayoutProps including margin and padding
}
```

#### StateTextInput

Input component with isolated state management. Changes to the input don't trigger parent re-renders. The special `refStateInput` ref allows you to read and update the value imperatively from the parent without causing re-renders.

```tsx
import {
  BaseInput,
  StateTextInput,
} from '@shaquillehinds/react-native-essentials';
import { useRef } from 'react';

function OptimizedForm() {
  // StateInputRef provides access to value without re-rendering parent
  const emailRef = useRef<StateInputRef>(null);
  const passwordRef = useRef<StateInputRef>(null);

  const handleSubmit = () => {
    // Access values without triggering re-renders during typing
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    console.log({ email, password });
  };

  const handleReset = () => {
    // Imperatively set values without parent re-render
    emailRef.current?.setValue('');
    passwordRef.current?.setValue('');
  };

  return (
    <>
      <BaseInput
        backgroundColor="#ffffff"
        textInputProps={{
          placeholder: 'Email',
          keyboardType: 'email-address',
        }}
        refStateInput={emailRef}
        refStateInputValidator={(text) => text.length <= 100}
        padding={[3]}
      />

      <BaseInput
        backgroundColor="#ffffff"
        textInputProps={{
          placeholder: 'Password',
          secureTextEntry: true,
        }}
        refStateInput={passwordRef}
        padding={[3]}
      />

      <Button onPress={handleSubmit}>Submit</Button>
      <Button onPress={handleReset}>Reset</Button>
    </>
  );
}

// Or use StateTextInput directly
function DirectUsage() {
  const inputRef = useRef<StateInputRef>(null);

  return (
    <StateTextInput
      placeholder="Direct usage"
      refStateInput={inputRef}
      refStateInputValidator={(text) => /^[a-zA-Z]*$/.test(text)}
      onChangeText={(text) => console.log('Valid text:', text)}
    />
  );
}
```

**StateInputRef Type:**

```tsx
type StateInputRef = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};
```

**Benefits:**

- **Performance**: Parent component doesn't re-render on every keystroke
- **Imperative Access**: Read/write input value without state updates
- **Validation**: Built-in validator prevents invalid input from being set
- **Form Optimization**: Perfect for forms with many inputs

---

### Providers

#### PortalProvider

Manages portal/overlay content.

```tsx
import {
  PortalProvider,
  usePortal,
} from '@shaquillehinds/react-native-essentials';

function App() {
  return (
    <PortalProvider unMountBufferTimeMS={100} updateBufferTimeMS={50}>
      <YourApp />
    </PortalProvider>
  );
}

function Component() {
  const portal = usePortal();

  const showModal = () => {
    const key = portal.mount(
      'modal-key',
      <Modal onClose={() => portal.unmount('modal-key')} />
    );
  };

  return <Button onPress={showModal}>Show Modal</Button>;
}
```

**Context Value:**

```tsx
interface PortalContextValue {
  mount: (
    key: PortalKey,
    element: ReactNode,
    onMount?: (key: PortalKey) => void
  ) => PortalKey;
  update: (key: PortalKey, element: ReactNode) => void;
  unmount: (key: PortalKey, onUnmount?: (key: PortalKey) => void) => void;
}
```

#### LocalizationProvider

Provides app-wide translation support.

```tsx
import {
  LocalizationProvider,
  useLocalization,
} from '@shaquillehinds/react-native-essentials';

<LocalizationProvider
  sourceLanguage="en-US"
  targetLanguage="es-ES"
  translation={async ({ sourceLanguage, targetLanguage, text }) => {
    // Your translation API call
    return translatedText;
  }}
  initialLanguagesRecord={{
    'es-ES': {
      base64hash: 'translated text',
    },
  }}
  initialLanguagesRecordRetriever={async ({
    sourceLanguage,
    targetLanguage,
  }) => {
    // Fetch saved translations
    return [{ original: 'Hello', translated: 'Hola' }];
  }}
>
  <YourApp />
</LocalizationProvider>;
```

**Props:**

```tsx
interface LocalizationProviderProps {
  children: ReactNode;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  translation: (props: {
    sourceLanguage: LanguageCode;
    targetLanguage: LanguageCode;
    text: string;
  }) => Promise<string>;
  initialLanguagesRecord?: LanguagesRecord;
  initialLanguagesRecordRetriever?: (props: {
    sourceLanguage: LanguageCode;
    targetLanguage: LanguageCode;
  }) => Promise<{ original: string; translated: string }[]>;
}
```

#### EventTrackersProvider

Centralized event tracking system.

```tsx
import {
  EventTrackersProvider,
  useEventTrackers,
} from '@shaquillehinds/react-native-essentials';

<EventTrackersProvider
  eventTrackers={[
    {
      name: 'Analytics',
      trackEvent: (eventName, properties) => {
        analytics.track(eventName, properties);
      },
    },
  ]}
>
  <YourApp />
</EventTrackersProvider>;
```

#### DataCollectionProvider

Manages centralized data collection.

```tsx
import {
  DataCollectionProvider,
  useDataCollection,
} from '@shaquillehinds/react-native-essentials';

<DataCollectionProvider>
  <YourApp />
</DataCollectionProvider>;
```

---

### Wrappers

#### Press

Enhanced pressable component.

```tsx
import { Press } from '@shaquillehinds/react-native-essentials';

<Press
  onPress={() => console.log('Pressed')}
  activeOpacity={0.7}
  disabled={false}
>
  {children}
</Press>;
```

#### PressableLayout

Combines Layout and Press functionality - a pressable Layout component with all Layout props.

```tsx
import { PressableLayout } from '@shaquillehinds/react-native-essentials';

<PressableLayout
  onPress={() => console.log('Pressed')}
  center
  padding={[5]}
  backgroundColor="#f0f0f0"
  activeOpacity={0.7}
>
  {children}
</PressableLayout>;
```

**Props:**

```tsx
interface PressableLayoutProps extends LayoutProps {
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
  // Inherits all Layout props
}
```

#### TextStream

Animated text streaming component.

```tsx
import { TextStream } from '@shaquillehinds/react-native-essentials';

<TextStream
  text="Text to stream"
  speed={50}
  onComplete={() => console.log('Done')}
/>;
```

---

### Indicators

#### LoadingIndicator

Displays loading state with spinner.

```tsx
import { LoadingIndicator } from '@shaquillehinds/react-native-essentials';

<LoadingIndicator size="large" color="#007AFF" />;
```

#### SkeletonViewIndicator

Skeleton loading placeholder.

```tsx
import { SkeletonViewIndicator } from '@shaquillehinds/react-native-essentials';

<SkeletonViewIndicator colors={['#E1E9EE', '#F2F8FC', '#E1E9EE']} />;
```

---

### Injectors

#### ViewDimensionsInjector

Injects view dimensions into children.

```tsx
import { ViewDimensionsInjector } from '@shaquillehinds/react-native-essentials';

<ViewDimensionsInjector>
  {({ width, height }) => (
    <Layout width={width} height={height}>
      {/* Content */}
    </Layout>
  )}
</ViewDimensionsInjector>;
```

---

## Hooks

### useDeviceOrientation

Hook for responsive device orientation and dimensions.

```tsx
import { useDeviceOrientation } from '@shaquillehinds/react-native-essentials';

function Component() {
  const orientation = useDeviceOrientation();

  return (
    <Layout width={80} height={40}>
      <Text>
        Orientation: {orientation.isPortrait ? 'Portrait' : 'Landscape'}
      </Text>
    </Layout>
  );
}
```

**Returns:**

```tsx
{
  orientation: 'portrait' | 'landscape';
  isPortrait: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  relativeX: (percentage: number) => number;
  relativeY: (percentage: number) => number;
  relativeShort: (percentage: number) => number;
  relativeLong: (percentage: number) => number;
}
```

### useImageSize

Calculate responsive image dimensions.

```tsx
import { useImageSize } from '@shaquillehinds/react-native-essentials';

function ImageComponent() {
  const { imageSize } = useImageSize({
    image: 'https://example.com/image.jpg',
    maxWidth: 300,
    maxHeight: 400,
  });

  return (
    <Image
      source={{ uri: 'https://example.com/image.jpg' }}
      style={imageSize}
    />
  );
}
```

**Props:**

```tsx
interface UseImageSizeProps {
  image?: string;
  maxWidth: number;
  maxHeight: number;
}
```

**Returns:**

```tsx
{
  imageSize: {
    width: number;
    height: number;
  }
  calculateSize: (props: {
    imageWidth: number;
    imageHeight: number;
    maxWidth: number;
    maxHeight: number;
  }) => {
    displayWidth: number;
    displayHeight: number;
  };
}
```

### useImageSizes

Calculate dimensions for multiple images.

```tsx
import { useImageSizes } from '@shaquillehinds/react-native-essentials';

const { imageSizes } = useImageSizes({
  images: ['url1', 'url2', 'url3'],
  maxWidth: 300,
  maxHeight: 400,
});
```

### useTimer

Countdown timer hook.

```tsx
import { useTimer } from '@shaquillehinds/react-native-essentials';

function Timer() {
  const { seconds, minutes } = useTimer({
    seconds: 120,
    start: true,
    onTimerEnds: () => console.log('Timer ended'),
  });

  return (
    <Text>
      {minutes}:{seconds}
    </Text>
  );
}
```

**Props:**

```tsx
interface UseTimerProps {
  seconds: number;
  onTimerEnds: () => void;
  start: boolean;
}
```

### useDebounce

Debounce function calls with optional per-call overrides.

```tsx
import { useDebounce } from '@shaquillehinds/react-native-essentials';

function SearchInput() {
  const [query, setQuery] = useState('');

  const { debounce, cancelDebounce } = useDebounce({
    delayInMilliSecs: 500,
    onTrigger: async () => {
      // Perform search with current query
      const results = await searchAPI(query);
      setResults(results);
    },
    onPreTrigger: () => console.log('About to search'),
    onPostTrigger: () => console.log('Search complete'),
    onDebounceInvocation: () => console.log('User is typing'),
  });

  return (
    <TextInput
      value={query}
      onChangeText={(text) => {
        setQuery(text);
        debounce(); // Uses props from hook initialization
      }}
    />
  );
}

// Override behavior per call
function AdvancedSearch() {
  const [query, setQuery] = useState('');

  const { debounce } = useDebounce({
    delayInMilliSecs: 500,
    onTrigger: async () => {
      console.log('Default search');
    },
  });

  const handleQuickSearch = () => {
    // Override delay for this specific call
    debounce({
      delayInMilliSecs: 100,
      onTrigger: async () => {
        console.log('Quick search!');
      },
    });
  };

  return (
    <>
      <TextInput onChangeText={(text) => debounce()} />
      <Button onPress={handleQuickSearch}>Quick Search</Button>
    </>
  );
}
```

**Props:**

```tsx
interface UseDebounceProps {
  delayInMilliSecs: number;
  onTrigger: () => void | Promise<void>;
  onPreTrigger?: () => void | Promise<void>;
  onPostTrigger?: () => void | Promise<void>;
  onDebounceInvocation?: () => void | Promise<void>;
}

// Debounce function accepts optional overrides
type DebounceFunction = (
  prop?: Partial<Omit<UseDebounceProps, 'onDebounceInvocation'>>
) => void;
```

**Returns:**

```tsx
{
  debounce: DebounceFunction;
  cancelDebounce: () => void;
}
```

**Note**: The hook stores props in a ref, so they won't update when the component re-renders. To use updated values from component state, either pass them as parameters to `debounce()` or access them via closure in the callback functions.

### useInterval

Interval timer hook.

```tsx
import { useInterval } from '@shaquillehinds/react-native-essentials';

function Component() {
  useInterval({
    callback: () => console.log('Tick'),
    delay: 1000,
    start: true,
  });
}
```

### useTranslation

Translate text using LocalizationProvider.

```tsx
import { useTranslation } from '@shaquillehinds/react-native-essentials';

function Component() {
  const translated = useTranslation({ text: 'Hello World' });
  return <Text>{translated}</Text>;
}
```

### useScrollableItems

Infinite scroll/pagination hook.

```tsx
import { useScrollableItems } from '@shaquillehinds/react-native-essentials';

function InfiniteList() {
  const {
    items,
    loading,
    onLayout,
    onItemsEndReached,
    onRefreshItems,
    refreshingItems,
    updateListItem,
    removeListItem,
  } = useScrollableItems({
    limit: 20,
    minFetchDuration: 300,
    fetchCooldown: 500,
    itemsFetchingFunction: async ({ limit, skip }) => {
      const response = await fetch(`/api/items?limit=${limit}&skip=${skip}`);
      return response.json();
    },
  });

  return (
    <FlatList
      data={items}
      onLayout={onLayout}
      onEndReached={onItemsEndReached}
      onRefresh={onRefreshItems}
      refreshing={refreshingItems}
      ListFooterComponent={loading ? <LoadingIndicator /> : null}
    />
  );
}
```

**Props:**

```tsx
interface UseScrollableItemsProps<ListItem, FetchingFunctionArgs> {
  limit?: number;
  minFetchDuration?: number;
  fetchCooldown?: number;
  itemsFetchingFunction: ItemsFetchingFunction<ListItem>;
  itemsFetchingFunctionArgs?: FetchingFunctionArgs;
}

type ItemsFetchingFunction<ListItem> = (props: {
  limit: number;
  skip: number;
}) => Promise<ListItem[]>;
```

**Returns:**

```tsx
{
  items: ListItem[];
  setItems: (items: ListItem[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  allItemsFetched: boolean;
  refreshingItems: boolean;
  onLayout: () => void;
  onItemsEndReached: () => void;
  onRefreshItems: () => Promise<void>;
  fetchItems: (props?: { refresh: boolean }) => Promise<void>;
  updateListItem: (id: string, key: keyof ListItem, updatedItem: ListItem) => void;
  removeListItem: (id: string, key: keyof ListItem) => void;
}
```

### useFontSizes

Access font size scale.

```tsx
import { useFontSizes } from '@shaquillehinds/react-native-essentials';

function Component() {
  const fontSizes = useFontSizes();
  return <Text style={{ fontSize: fontSizes.large }}>Text</Text>;
}
```

### useViewDimensions

Measure view dimensions.

```tsx
import { useViewDimensions } from '@shaquillehinds/react-native-essentials';

function Component() {
  const { onLayout, width, height } = useViewDimensions();

  return (
    <Layout onLayout={onLayout}>
      <Text>
        Width: {width}, Height: {height}
      </Text>
    </Layout>
  );
}
```

### useInputRef

Manage TextInput refs.

```tsx
import { useInputRef } from '@shaquillehinds/react-native-essentials';

function Form() {
  const { ref, focus, blur } = useInputRef();

  return (
    <>
      <TextInput ref={ref} />
      <Button onPress={focus}>Focus</Button>
    </>
  );
}
```

### useKeyboardListeners

Listen to keyboard events.

```tsx
import { useKeyboardListeners } from '@shaquillehinds/react-native-essentials';

function Component() {
  useKeyboardListeners({
    onShow: (e) => console.log('Keyboard shown', e.endCoordinates.height),
    onHide: () => console.log('Keyboard hidden'),
  });
}
```

---

## Utilities

### Storage Accessors

Create typed MMKV storage accessors.

```tsx
import { createStorageAccessors } from '@shaquillehinds/react-native-essentials';

interface UserData {
  name: string;
  age: number;
}

const userStorage = createStorageAccessors<UserData>('user-key');

// Store data
userStorage.store({ name: 'John', age: 30 });

// Retrieve data
const user = userStorage.retrieve(); // UserData | undefined

// Remove data
const removedUser = userStorage.remove();

// Use hooks
function Component() {
  const [user, setUser] = userStorage.useObject();
  return <Text>{user?.name}</Text>;
}
```

### Layout Utilities

```tsx
import {
  relativeX,
  relativeY,
  relativeShort,
  relativeLong,
  normalize,
} from '@shaquillehinds/react-native-essentials';

const width = relativeX(50); // 50% of screen width
const height = relativeY(25); // 25% of screen height
const size = relativeShort(10); // 10% of shorter dimension
const fontSize = normalize(16); // Normalized font size
```

### Array Utilities

```tsx
import {
  filterMap,
  advancedMap,
  keepArrayUnique,
} from '@shaquillehinds/react-native-essentials';

// Filter and map in one operation
const result = filterMap(array, (item) => {
  if (item.active) return item.name;
  return null; // Filtered out
});

// Keep array unique
const unique = keepArrayUnique({
  prevItems: existingItems,
  newItems: newItems,
  comparatorExtractor: (item) => item.id,
});
```

### Measurement Utilities

```tsx
import { measureAsync } from '@shaquillehinds/react-native-essentials';

const measurements = await measureAsync(viewRef);
// Returns: { x, y, width, height, pageX, pageY }
```

### Snapshot Utilities

```tsx
import { snapShotGestureResponderEvent } from '@shaquillehinds/react-native-essentials';

const snapshot = snapShotGestureResponderEvent(event);
```

### Wait Utility

```tsx
import { wait } from '@shaquillehinds/react-native-essentials';

await wait(1000); // Wait 1 second
```

### Scheduler

```tsx
import { Scheduler } from '@shaquillehinds/react-native-essentials';

// Timer (runs once after delay)
const timer = new Scheduler.Timer(() => {
  console.log('Timer fired');
}, 1000);
timer.start();
timer.stop();

// Schedule (runs repeatedly)
const schedule = new Scheduler.Schedule(() => {
  console.log('Tick');
}, 1000);
schedule.start();
schedule.stop();
```

### Language Utilities

```tsx
import {
  mergeStringRecords,
  mergeLanguagesRecords,
  type LanguageCode,
  type LanguagesRecord,
} from '@shaquillehinds/react-native-essentials';

const merged = mergeLanguagesRecords({
  obj1: languageRecords1,
  obj2: languageRecords2,
});
```

### ID Generation

```tsx
import { getSequantialRandomId } from '@shaquillehinds/react-native-essentials';

const id = getSequantialRandomId(); // Returns unique ID
```

---

## Animations

### AnimateComponent

Generic animation component wrapper using React Native's Animated API.

```tsx
import { AnimateComponent } from '@shaquillehinds/react-native-essentials';
import { Animated } from 'react-native';

// Number-based animation
<AnimateComponent
  initialPosition={0}
  toPosition={{
    type: 'timing',
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }}
  style={(value) => ({
    opacity: value,
  })}
  autoStart
>
  {children}
</AnimateComponent>

// XY position animation
<AnimateComponent
  initialPosition={{ x: 0, y: 0 }}
  toPosition={[
    {
      type: 'timing',
      toValue: { x: 100, y: 100 },
      duration: 500,
      useNativeDriver: true,
    }
  ]}
  style={(value) => ({
    transform: [{ translateX: value.x }, { translateY: value.y }],
  })}
  autoStart
  loop={3}
>
  {children}
</AnimateComponent>
```

**Props:**

```tsx
type AnimateComponentProps<T extends InitialValue> = {
  initialPosition: T; // number | XYNumber ({ x: number, y: number })
  toPosition:
    | AnimateComponentAnimationConfig
    | AnimateComponentAnimationConfig[];
  style: (
    value: T extends XY ? Animated.AnimatedValueXY : Animated.Value
  ) => ViewStyle;
  autoStart?: boolean;
  returnToStart?: boolean;
  loop?: number;
  ref?: React.RefObject<AnimateComponentRef<T>>;
  children?: ReactNode;
};

type AnimateComponentAnimationConfig =
  | (Animated.TimingAnimationConfig & { type: 'timing' })
  | (Animated.SpringAnimationConfig & { type: 'spring' })
  | (Animated.DecayAnimationConfig & { type: 'decay' });

type AnimateComponentRef<T extends InitialValue> = {
  stop: () => void;
  start: () => void;
  reset: () => void;
  setValue: (value: T) => void;
  value: T extends XY ? Animated.AnimatedValueXY : Animated.Value;
};
```

### AnimateValueComponent

Animate using a shared Animated value.

```tsx
import { AnimateValueComponent } from '@shaquillehinds/react-native-essentials';
import { Animated } from 'react-native';
import { useRef } from 'react';

function Component() {
  const opacity = useRef(new Animated.Value(0)).current;

  // Trigger animation
  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();

  return (
    <AnimateValueComponent
      initialPosition={0}
      toPosition={{
        type: 'timing',
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }}
      style={(value) => ({
        opacity: value,
      })}
    >
      {children}
    </AnimateValueComponent>
  );
}
```

### AnimateXYValueComponent

Animate X and Y coordinates using Animated.ValueXY.

```tsx
import { AnimateXYValueComponent } from '@shaquillehinds/react-native-essentials';

<AnimateXYValueComponent
  initialPosition={{ x: 0, y: 0 }}
  toPosition={{
    type: 'spring',
    toValue: { x: 100, y: 100 },
    useNativeDriver: true,
  }}
  style={(value) => ({
    transform: [{ translateX: value.x }, { translateY: value.y }],
  })}
  autoStart
>
  {children}
</AnimateXYValueComponent>;
```

### ArcSpinnerAnimation

Spinning arc loader animation.

```tsx
import { ArcSpinnerAnimation } from '@shaquillehinds/react-native-essentials';

<ArcSpinnerAnimation size={40} color="#007AFF" strokeWidth={4} />;
```

### useDragAnimation

Hook for drag animations.

```tsx
import { useDragAnimation } from '@shaquillehinds/react-native-essentials';

function DraggableBox() {
  const { translateX, translateY, gesture } = useDragAnimation();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          { width: 100, height: 100 },
          { transform: [{ translateX }, { translateY }] },
        ]}
      />
    </GestureDetector>
  );
}
```

---

## Gestures

### Drag

Drag gesture component.

```tsx
import { Drag } from '@shaquillehinds/react-native-essentials';

<Drag
  onDragStart={() => console.log('Drag started')}
  onDragEnd={() => console.log('Drag ended')}
  onDrag={(x, y) => console.log('Dragging', x, y)}
>
  {children}
</Drag>;
```

### Swipe

Swipe gesture detection.

```tsx
import { Swipe } from '@shaquillehinds/react-native-essentials';

<Swipe
  onSwipeLeft={() => console.log('Swiped left')}
  onSwipeRight={() => console.log('Swiped right')}
  onSwipeUp={() => console.log('Swiped up')}
  onSwipeDown={() => console.log('Swiped down')}
>
  {children}
</Swipe>;
```

### TwoFingerLongPress

Two-finger long press gesture.

```tsx
import { TwoFingerLongPress } from '@shaquillehinds/react-native-essentials';

<TwoFingerLongPress
  onLongPress={() => console.log('Two finger long press')}
  duration={500}
>
  {children}
</TwoFingerLongPress>;
```

---

## Styles

### Shadow

Platform-agnostic shadow styling.

```tsx
import { shadow } from '@shaquillehinds/react-native-essentials';

<Layout style={shadow({ elevation: 5 })}>{children}</Layout>;
```

### Spacer

Spacing utility type and transformer.

```tsx
import {
  type Spacing,
  transformSpacing,
} from '@shaquillehinds/react-native-essentials';

const spacing: Spacing = {
  all: 10,
  horizontal: 15,
  vertical: 20,
  top: 5,
};

const style = transformSpacing({
  margin: spacing,
  orientation: deviceOrientation,
});
```

---

## Algorithms

String, number, and data manipulation utilities.

### String Utilities

```tsx
import {
  firstLetterCap,
  titleCase,
  camelCase,
  snakeToCamelCase,
  dashToCamelCase,
  toCamelCase,
  snakeToTitleCase,
  dashToTitleCase,
  toTitleCase,
  camelToUpperSnake,
} from '@shaquillehinds/react-native-essentials';

firstLetterCap('hello'); // "Hello"
titleCase('hello world'); // "Hello World"
camelCase('hello world'); // "helloWorld"
snakeToCamelCase('hello_world'); // "helloWorld"
toTitleCase('hello-world'); // "Hello World"
camelToUpperSnake('helloWorld'); // "HELLO_WORLD"
```

### Number Utilities

```tsx
import {
  kFormatter,
  centsToDollars,
  hexOpacity,
  secondsToTime,
  getTodayInSeconds,
} from '@shaquillehinds/react-native-essentials';

kFormatter(1500); // "1.5k"
kFormatter(500); // 500

centsToDollars({
  cents: 1999,
  dollarSign: true,
  currency: 'USD',
}); // "$19.99 USD"

hexOpacity(50); // "80" (50% opacity in hex)
hexOpacity(0.5); // "80" (also accepts decimals)

secondsToTime(3665); // "01:01:05"
secondsToTime(3665, { hideHours: true }); // "61:05"

getTodayInSeconds(); // Current time in seconds since midnight
```

### Encoding Utilities

```tsx
import { toBase64, fromBase64 } from '@shaquillehinds/react-native-essentials';

const encoded = toBase64('Hello World');
const decoded = fromBase64(encoded);
```

### Date Utilities

```tsx
import { _24hrsToDate } from '@shaquillehinds/react-native-essentials';

const date = _24hrsToDate('1430'); // Date object for 14:30 (2:30 PM)
```

### Object Utilities

```tsx
import {
  objToQueryStr,
  deepCopy,
} from '@shaquillehinds/react-native-essentials';

objToQueryStr({ page: 1, limit: 20 }); // "page=1&limit=20"

const copy = deepCopy(originalObject); // Deep clone
```

---

## Type Definitions

### Common Types

```tsx
// Font Types
type FontSize =
  | 'headingL'
  | 'headingM'
  | 'headingS'
  | 'titleL'
  | 'titleM'
  | 'titleS'
  | 'bodyL'
  | 'bodyM'
  | 'bodyS';

type FontStyle =
  | 'Thin'
  | 'Extra Light'
  | 'Light'
  | 'Regular'
  | 'Medium'
  | 'SemiBold'
  | 'Bold'
  | 'ExtraBold'
  | 'Black';

type LineHeight = 'short' | 'tall';
type LetterSpacing = 'wide' | 'extraWide';

// Button Types
type ButtonSize = 'small' | 'medium' | 'large' | 'auto' | 'wide';
type BorderSize = 'razor' | 'thin' | 'medium' | 'large';
type RadiusSize = 'edgy' | 'sharp' | 'medium' | 'soft' | 'curvy' | 'round';

// Device Types
type DeviceOrientation = 'portrait' | 'landscape';

// Spacing Types
type Spaces = [number, number?, number?, number?];

interface Spacing {
  /**
   * CSS-style padding/margin shorthand using percentages:
   * - [10] = all sides 10%
   * - [10, 20] = vertical 10%, horizontal 20%
   * - [10, 20, 30] = top 10%, horizontal 20%, bottom 30%
   * - [10, 20, 30, 40] = top 10%, right 20%, bottom 30%, left 40%
   */
  padding?: Spaces;
  margin?: Spaces;
}
```

---

## Best Practices

### Performance

1. Use `useDeviceOrientation` for responsive layouts instead of recalculating dimensions
2. Leverage `useScrollableItems` for efficient pagination
3. Use `useDebounce` for expensive operations
4. Memoize callbacks and values when using hooks

### Type Safety

1. Always provide type parameters for generic utilities:

   ```tsx
   createStorageAccessors<UserData>('user')
   useScrollableItems<Item, Args>(...)
   ```

2. Use provided types for consistent styling:
   ```tsx
   const spacing: Spacing = { all: 10 };
   ```

### Layout

1. Use `Layout` component for consistent spacing:

   ```tsx
   <Layout padding={[5]} margin={[2, 4]}>
   ```

2. Prefer percentage-based dimensions with `relativeX`/`relativeY`
3. Use `normalize()` for font sizes to ensure consistency across devices

**Spacing Examples:**

```tsx
// All sides
padding={[5]}  // 5% on all sides

// Vertical and horizontal
padding={[5, 10]}  // 5% top/bottom, 10% left/right

// Top, horizontal, bottom
padding={[5, 10, 3]}  // 5% top, 10% left/right, 3% bottom

// Individual sides
padding={[5, 10, 3, 8]}  // 5% top, 10% right, 3% bottom, 8% left
```

### Localization

1. Wrap app in `LocalizationProvider` for translation support
2. Use `Translate` component or `useTranslation` hook
3. Provide `initialLanguagesRecord` for offline support

---

## Migration Guide

### From v1.6 to v1.7

- Updated peer dependencies to latest versions
- Added new animation components
- Improved TypeScript definitions
- Enhanced gesture system

---

## Troubleshooting

### Common Issues

**Issue:** Components not rendering

- Ensure all peer dependencies are installed
- Check that providers wrap your app correctly

**Issue:** Animations not working

- Verify `react-native-reanimated` is properly configured
- Check Reanimated plugin in `babel.config.js`

**Issue:** Storage not persisting

- Ensure `react-native-mmkv` is properly linked
- Check storage permissions on Android

---

## Support

For issues, questions, or contributions:

- [GitHub Issues](https://github.com/shaquillehinds/react-native-essentials/issues)
- [GitHub Repository](https://github.com/shaquillehinds/react-native-essentials)

## License

MIT © Shaquille Hinds

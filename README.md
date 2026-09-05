# @shaquillehinds/react-native-essentials

A batteries‑included toolkit for React Native and Expo apps: screen‑relative layouts, a typography scale, buttons, press wrappers with spring feedback, providers for localization / portals / long‑running event tracking, gestures, animation helpers, MMKV storage accessors, and a bag of hooks and pure utilities.

The design goal is that you almost never write `View`, `Text`, `TouchableOpacity`, or pixel values by hand. Layouts are described with percentage‑based props that scale with the device, typography is a fixed scale of named sizes, and everything composes.

---

## Table of contents

- [AI agent rules](#ai-agent-rules)
- [Installation](#installation)
- [App setup](#app-setup)
  - [Fonts](#fonts)
  - [Globals](#globals)
  - [Providers](#providers-at-the-root)
- [Sizing model](#sizing-model)
  - [Relative functions](#relative-functions)
  - [Spacing tuples](#spacing-tuples)
  - [Tokens](#tokens)
  - [Device constants](#device-constants)
- [Layouts](#layouts)
  - [Layout](#layout)
  - [RowLayout](#rowlayout)
  - [ScreenLayout](#screenlayout)
  - [AnimatedLayout](#animatedlayout)
  - [TouchableLayout](#touchablelayout)
  - [SeparatorLayout](#separatorlayout)
- [Typography](#typography)
- [Buttons](#buttons)
- [Press wrappers](#press-wrappers)
- [Inputs](#inputs)
- [Indicators, injectors, utilities, icons](#indicators-injectors-utilities-icons)
- [Modal building blocks](#modal-building-blocks)
- [TextStream](#textstream)
- [Providers](#providers)
  - [LocalizationProvider](#localizationprovider)
  - [PortalProvider](#portalprovider)
  - [EventTrackerProvider](#eventtrackerprovider)
  - [Data collection](#data-collection)
- [Render isolation](#render-isolation)
- [Gestures](#gestures)
- [Animations](#animations)
- [SVG](#svg)
- [Hooks](#hooks)
- [Storage (MMKV)](#storage-mmkv)
- [Scheduler](#scheduler)
- [Styles](#styles)
- [Utilities](#utilities)
- [Algorithms](#algorithms)
- [Full export index](#full-export-index)
- [Known caveats](#known-caveats)

---

## AI agent rules

The package ships a rules file written for AI coding agents (Claude Code, Cursor, Codex, Copilot, etc.) at `rules/AGENT_RULES.md`. It tells an agent to use this package for layouts, text, buttons, spacing, and sizing instead of raw React Native primitives, and lists every export so it cannot invent APIs. Point your agent at it with any of the following.

**Copy it into your project (recommended)**

```sh
npx rne-rules            # writes ./AGENTS.md
npx rne-rules cursor     # writes ./.cursor/rules/react-native-essentials.mdc (alwaysApply)
npx rne-rules claude     # writes ./.claude/rules/react-native-essentials.md
npx rne-rules docs/ai/rn-essentials.md   # custom path
```

Add `--force` to overwrite an existing file. Re-run after upgrading the package to pick up rule changes.

**Reference it without copying (Claude Code)**

`CLAUDE.md` supports `@path` imports, so a single line keeps the rules in sync with the installed version:

```md
# CLAUDE.md

@node_modules/@shaquillehinds/react-native-essentials/rules/AGENT_RULES.md
```

**Reference it from a generic `AGENTS.md`**

```md
Before writing any React Native UI, read and follow
node_modules/@shaquillehinds/react-native-essentials/rules/AGENT_RULES.md.
```

---

## Installation

```sh
npm install @shaquillehinds/react-native-essentials
# or
yarn add @shaquillehinds/react-native-essentials
```

Peer dependencies (checked at runtime by `checkRequiredDependencies()`):

```sh
npx expo install react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-mmkv react-native-svg
```

The package also imports `eventemitter3` and `buffer`.

You can fail fast during development:

```ts
import { checkRequiredDependencies } from '@shaquillehinds/react-native-essentials';
if (__DEV__) checkRequiredDependencies();
```

`checkRequiredDependencies({ dependencies })` accepts a custom list of `{ name, packageName, required }` if you want to extend the check. `checkDependency(packageName)` returns a boolean, and `createDependencyError(featureName, packageName)` builds a consistent error for optional features.

---

## App setup

### Fonts

Text components set `fontFamily` to the literal `fontStyle` value. The `FontStyle` union is:

```
'Thin' | 'Extra Light' | 'Light' | 'Regular' | 'Medium' | 'SemiBold' | 'Bold' | 'ExtraBold' | 'Black'
```

Register your fonts under those exact names (only the ones you use):

```ts
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  Regular: require('./assets/fonts/Sen-Regular.ttf'),
  Medium: require('./assets/fonts/Sen-Medium.ttf'),
  SemiBold: require('./assets/fonts/Sen-SemiBold.ttf'),
  Bold: require('./assets/fonts/Sen-Bold.ttf'),
  ExtraBold: require('./assets/fonts/Sen-ExtraBold.ttf'),
});
```

Because `fontStyle` is passed straight through, you can also register additional custom names (e.g. a handwriting face) and pass them as `fontStyle`, casting past the union if you use TypeScript.

### Globals

Importing the package executes `essentials/utils/global`, which installs:

| Global                          | Behaviour                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `is(value)`                     | Returns `value` if truthy, otherwise `undefined`. Handy for conditional JSX: `{is(cond) && <X />}`. |
| `isDef(value)`                  | `value !== undefined`                                                                               |
| `errMsg(error)`                 | `Error → message`, `string → itself`, anything else → `JSON.stringify`                              |
| `Array.prototype.filterMap(fn)` | Map that skips falsy source items and drops `null`/`undefined` results                              |

Add a declaration file so TypeScript knows about them:

```ts
// @types/globals.d.ts
type NonFalsy<T> = Exclude<T, 0 | '' | false | null>;
declare module globalThis {
  var is: <T>(value: T) => NonFalsy<T> | undefined;
  var isDef: (value: unknown) => boolean;
  var errMsg: (error: unknown) => string;
}
```

### Providers at the root

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  LocalizationProvider,
  PortalProvider,
} from '@shaquillehinds/react-native-essentials';

export function AppProviders({ children }) {
  return (
    <GestureHandlerRootView>
      <LocalizationProvider
        sourceLanguage="en"
        targetLanguage="en"
        translation={async ({ sourceLanguage, targetLanguage, text }) => {
          // call your translation backend; must resolve to a string
          return text;
        }}
      >
        <PortalProvider>{children}</PortalProvider>
      </LocalizationProvider>
    </GestureHandlerRootView>
  );
}
```

Only add the providers you use. `LocalizationProvider` is required for `translate` / `useTranslation`; `PortalProvider` for `usePortal` / `usePortalComponent`; `EventTrackerProvider` for event tracking.

---

## Sizing model

All sizing is derived from `Dimensions.get('screen')` so that the same numbers produce proportionally identical layouts on every device.

### Relative functions

Static versions (computed once at import):

| Function                               | Returns                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------- |
| `relativeX(n)`                         | `n%` of screen width                                                                   |
| `relativeY(n)`                         | `n%` of screen height (adjusted by half the screen/window height difference)           |
| `relativeShort(n)`                     | `n%` of `MIN_DIMENSION`                                                                |
| `relativeLong(n)`                      | `n%` of `MAX_DIMENSION`                                                                |
| `normalize(n)`                         | `relativeLong(n * scale)` rounded to the nearest pixel (`scale = 0.11519078473722104`) |
| `normalizeShort(n)`                    | `relativeShort(n * scale)` rounded to the nearest pixel                                |
| `relativeXWorklet`, `relativeYWorklet` | Worklet‑marked equivalents for Reanimated                                              |

Reactive versions come from `useDeviceOrientation()` (see [Hooks](#hooks)) and update when the device rotates. `Layout` and friends use the reactive versions internally.

`normalize` is what makes the font scale and radius tokens feel like "design points": on a device whose longer dimension is ~868pt, `normalize(16) ≈ 16`.

### Spacing tuples

`padding` and `margin` accept a `Spaces` tuple — `[number, number?, number?, number?]` — following CSS shorthand order, where **every value is a percentage**:

| Tuple          | top | right | bottom | left |
| -------------- | --- | ----- | ------ | ---- |
| `[a]`          | a   | a     | a      | a    |
| `[v, h]`       | v   | h     | v      | h    |
| `[t, h, b]`    | t   | h     | b      | h    |
| `[t, r, b, l]` | t   | r     | b      | l    |

Top/bottom values are resolved with `relativeY` (percent of screen **height**); left/right values with `relativeX` (percent of screen **width**). `transformSpacing({ margin, padding, orientation? })` and `spacerStyles(type, { orientation? })(...values)` are exported if you need the same resolution in your own code.

### Tokens

```ts
type BorderSize = 'razor' | 'thin' | 'medium' | 'large';
// borderSizes: razor 0.1%, thin 0.25%, medium 0.5%, large 0.75%  (of MIN_DIMENSION)

type RadiusSize =
  | 'edgy'
  | 'sharp'
  | 'medium'
  | 'soft'
  | 'curvy'
  | 'round'
  | 'full';
// radiusSizes: normalize(5 | 10 | 15 | 20 | 25 | 30), full = relativeLong(100)

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
// fontSizes: normalize(26 | 24 | 22 | 20 | 18 | 16 | 14 | 12 | 10)

type ButtonSize = 'small' | 'medium' | 'large' | 'wide' | 'auto';
```

`borderSizes`, `radiusSizes`, `fontSizes`, and `buttonSizes` are exported as plain objects for use inside `StyleSheet.create`.

`buttonSizes` (padding via `normalizeShort`):

| size   | paddingHorizontal | paddingVertical | fontSize | borderRadius | width               |
| ------ | ----------------- | --------------- | -------- | ------------ | ------------------- |
| small  | 30                | 15              | bodyS    | edgy         | —                   |
| medium | 60                | 20              | bodyL    | sharp        | —                   |
| large  | 120               | 25              | titleS   | sharp        | —                   |
| wide   | 120               | 25              | titleM   | sharp        | `relativeShort(88)` |
| auto   | 60                | 25              | titleM   | sharp        | `'100%'`            |

### Device constants

`SCREEN_WIDTH`, `SCREEN_HEIGHT`, `WINDOW_WIDTH`, `WINDOW_HEIGHT`, `MAX_DIMENSION`, `MIN_DIMENSION`, `aspectRatio`, `initialOrientation` (`'portrait' | 'landscape'`), `isSmallDevice` (width < 375 or height < 750), `isLargeDevice` (width > 1100), `isTablet` (aspect ratio ≤ 1.6), `isIpad`, `isIOS`, `isAndroid`, `isWeb`.

Note: `isIOS`, `isAndroid`, `isWeb` are `true | undefined` (not `false`), so they can be spread into conditional style arrays.

---

## Layouts

### Layout

The foundation. Renders a `View`, or a `ScrollView` when `scrollable`, or an animated equivalent when `animated`.

```tsx
import { Layout } from '@shaquillehinds/react-native-essentials';

<Layout
  width={90} // number → % of screen width; string → passed through ('100%')
  height={20} // number → % of screen height; string → passed through
  square={8} // sets width AND height to n% of the longer screen dimension
  flex={[1, 0, 'auto']} // [flex] | [flex, flexShrink] | [flex, flexShrink, flexBasis]
  center // alignItems: 'center'
  centerX // justifyContent: 'center'
  spaceBetween // justifyContent: 'space-between'
  padding={[1, 3]}
  margin={[2, 0, 0, 0]}
  backgroundColor="#111"
  borderColor="#333"
  borderWidth="thin"
  borderRadius="soft"
  absolute
  top={0}
  left={0}
>
  ...
</Layout>;
```

#### Props (`LayoutProps<Scrollable>`)

| Prop                                                  | Type                                                               | Notes                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `width`, `height`                                     | `DimensionValue`                                                   | Numbers are percentages of the screen (`relativeX` / `relativeY`); strings and other values pass through.                    |
| `square`                                              | `number`                                                           | Percentage of the **longer** screen dimension applied to both width and height (used when `width`/`height` are not numbers). |
| `flex`                                                | `[number] \| [number, number] \| [number, number, DimensionValue]` | `flex`, `flexShrink`, `flexBasis`.                                                                                           |
| `center`                                              | `boolean`                                                          | `alignItems: 'center'` — the **cross** axis.                                                                                 |
| `centerX`, `spaceCenter`                              | `boolean`                                                          | `justifyContent: 'center'` — the **main** axis.                                                                              |
| `spaceBetween`, `spaceEven`, `spaceStart`, `spaceEnd` | `boolean`                                                          | `justifyContent` variants. Precedence: `spaceEven` > `spaceBetween` > `centerX`/`spaceCenter` > `spaceStart` > `spaceEnd`.   |
| `wrap`                                                | `boolean`                                                          | `flexWrap: 'wrap'` (default `'nowrap'`).                                                                                     |
| `flexDirection`                                       | `FlexStyle['flexDirection']`                                       | Prefer `RowLayout`.                                                                                                          |
| `alignSelf`                                           | `FlexAlignType`                                                    |                                                                                                                              |
| `absolute`                                            | `boolean`                                                          | `position: 'absolute'`                                                                                                       |
| `top`, `bottom`, `left`, `right`                      | `DimensionValue`                                                   | Passed through as‑is.                                                                                                        |
| `padding`, `margin`                                   | `Spaces`                                                           | Percentage tuples (see above).                                                                                               |
| `backgroundColor`                                     | `string`                                                           | Applied to both the container and the content style.                                                                         |
| `borderColor`                                         | `string`                                                           |                                                                                                                              |
| `borderWidth`                                         | `BorderSize`                                                       | Token, not a number.                                                                                                         |
| `borderRadius`                                        | `RadiusSize`                                                       | Token, not a number.                                                                                                         |
| `loading`                                             | `boolean \| LoadingIndicatorProps`                                 | **Replaces the whole layout** with a `LoadingIndicator`. Only `backgroundColor` and the object's props are used.             |
| `skeleton`                                            | `boolean \| { colors?: [string, string] }`                         | Renders a `SkeletonViewIndicator` with the layout's computed styles (same size, spacing, radius).                            |
| `scrollable`                                          | `boolean`                                                          | Renders a `ScrollView`. When `true`, the remaining props are typed as `ScrollViewProps`; otherwise `ViewProps`.              |
| `animated`                                            | `boolean`                                                          | Use an animated wrapper.                                                                                                     |
| `animatedType`                                        | `'reanimated' \| 'react-native'`                                   | Default `'reanimated'`.                                                                                                      |
| `animatedStyle`                                       | `StyleProp<AnimatedStyle<ViewStyle>>`                              | Used **instead of** `style` when `animated && animatedType === 'reanimated'`.                                                |
| `style`                                               | `StyleProp<ViewStyle>`                                             | Applied last. Ignored when using Reanimated animation (use `animatedStyle`).                                                 |

Everything else is forwarded to the underlying `View` / `ScrollView` (`onLayout`, `onTouchStart`, `pointerEvents`, `collapsable`, `contentContainerStyle`, ...).

#### The centring rule

`center` is `alignItems`, `centerX` is `justifyContent`. That means:

- In a column `Layout`, `center` centres **horizontally** and `centerX` centres **vertically**.
- In a `RowLayout`, `center` centres **vertically** and `centerX` centres **horizontally**.
- `center centerX` centres on both axes in either case.

#### Style composition

- Plain view: `style={[contentStyle, viewStyle, style]}`
- Scroll view: `style={[viewStyle, style]}`, `contentContainerStyle={[contentStyle, yourContentContainerStyle]}` and `overflow: 'visible'` is forced.

`contentStyle` holds padding, `alignItems`, `flexDirection`, `flexWrap`, `justifyContent`, and `backgroundColor`. `viewStyle` holds margin, width/height, `alignSelf`, position, flex, offsets, border, and `backgroundColor`.

### RowLayout

`Layout` with `flexDirection: 'row'` appended after your `style`, so it always renders as a row. Same generic `Scrollable` parameter and props.

```tsx
<RowLayout center spaceBetween margin={[2, 0, 0, 0]}>
  <Title>Journals</Title>
  <Press onPress={onImport}>
    <ImportIcon />
  </Press>
</RowLayout>
```

### ScreenLayout

`Layout` with `{ display: 'flex', flex: 1 }` prepended, plus:

| Prop         | Notes                                                                                                                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `safe`       | Wraps the layout in `SafeAreaProvider` → `SafeAreaView` with `edges={['top', 'bottom']}`. The safe view gets `flex: 1`, `overflow: 'visible'`, and a `backgroundColor` copied from the `backgroundColor` prop or from `style.backgroundColor`. |
| `scrollable` | As in `Layout`.                                                                                                                                                                                                                                |

```tsx
<ScreenLayout safe backgroundColor={theme.background} padding={[0, 3]}>
  ...
</ScreenLayout>

// centred splash / empty state
<ScreenLayout center centerX backgroundColor={theme.background}>
  <Logo />
  <Heading margin={[5, 0]}>Welcome</Heading>
</ScreenLayout>
```

### AnimatedLayout

```tsx
const rStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
<AnimatedLayout animatedStyle={rStyle} center padding={[2]}>
  ...
</AnimatedLayout>;
```

`Layout` with `animated` fixed to `true` (Reanimated). Props: `Omit<LayoutProps, 'animated'> & { animatedStyle? }`. Remember that `style` is not applied in this mode.

### TouchableLayout

A `TouchableOpacity` that accepts the same sizing/alignment/spacing/border/`loading`/`skeleton` props as `Layout` (no `scrollable`, no `animated`). All `TouchableOpacityProps` are forwarded.

### SeparatorLayout

```tsx
<SeparatorLayout lineColor="#444" margin={[3, 0]}>
  <Body customColor="#888">OR</Body>
</SeparatorLayout>
```

| Prop                | Default                               |
| ------------------- | ------------------------------------- |
| `lineColor`         | `'#222222'`                           |
| `lineWidth`         | `0.5`                                 |
| `lineOpacity`       | `0.8`                                 |
| + all `LayoutProps` | defaults: `center`, `margin={[2, 0]}` |

Renders `RowLayout` → line, children, line.

---

## Typography

| Component  | Default `fontSize` | Default `fontStyle` | `fontSize` accepted                    |
| ---------- | ------------------ | ------------------- | -------------------------------------- |
| `BaseText` | `bodyM`            | `Regular`           | any `FontSize`                         |
| `Body`     | `bodyM`            | `Regular`           | `bodyS` \| `bodyM` \| `bodyL`          |
| `Title`    | `titleM`           | `Medium`            | `titleS` \| `titleM` \| `titleL`       |
| `Heading`  | `headingS`         | `SemiBold`          | `headingS` \| `headingM` \| `headingL` |

`BaseTextProps` (extends React Native `TextProps` and `Spacing`):

| Prop                | Type                                  | Notes                                                                                         |
| ------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `fontSize`          | `FontSize`                            | Resolved via `useFontSizes()`.                                                                |
| `fontStyle`         | `FontStyle`                           | Written to `fontFamily`.                                                                      |
| `customColor`       | `string`                              | `color`.                                                                                      |
| `center`            | `boolean`                             | `textAlign: 'center'` (otherwise `'left'`).                                                   |
| `lineHeight`        | `'short' \| 'tall'`                   | `1.05×` / `1.35×` the font size.                                                              |
| `letterSpacing`     | `'wide' \| 'extraWide'`               | `0.7` / `1.2`.                                                                                |
| `numberOfLines`     | `number`                              |                                                                                               |
| `onPress`           | `(e) => void`                         |                                                                                               |
| `animate`           | `boolean`                             | Renders Reanimated `Animated.Text`.                                                           |
| `animatedStyle`     | `StyleProp<AnimatedStyle<TextStyle>>` | Applied between the computed style and `style`.                                               |
| `translate`         | `boolean`                             | Wraps string children in `TranslateText` (see [LocalizationProvider](#localizationprovider)). |
| `padding`, `margin` | `Spaces`                              | Percent tuples (static `relativeX`/`relativeY`).                                              |
| `style`             | `StyleProp<TextStyle>`                | Applied last.                                                                                 |

```tsx
<Heading fontSize="headingL" customColor="white" margin={[5, 0]}>Welcome</Heading>
<Title fontSize="titleS">Entries</Title>
<Body numberOfLines={1} customColor={theme.typeface.secondary} margin={[0, 1]}>
  {entry.journalName}
</Body>
<Body translate center fontSize="bodyL">{description}</Body>
```

Recommended pattern: wrap `BaseText` once per role in your project so colours come from your theme, then use those wrappers everywhere.

```tsx
export function Title(props: PropsWithChildren<TitleTextProps>) {
  return (
    <BaseText
      {...props}
      customColor={theme.typeface.primary}
      fontSize={props.fontSize ?? 'titleM'}
      fontStyle={props.fontStyle ?? 'SemiBold'}
    />
  );
}
```

`TranslateText`, `LocalizationComponent`, and `TranslationComponent` are also exported; they are the internals behind `translate` and can be used directly.

---

## Buttons

### BaseButton

```tsx
<BaseButton
  buttonSize="wide"
  backgroundColor={['#4A87F2', '#7B4AF2']} // string or gradient array
  customFontColor="#fff"
  borderRadius="round" // RadiusSize or number
  leftComponent={<Icon />}
  leftComponentGap={8}
  loading={saving}
  onPress={save}
>
  Save
</BaseButton>
```

`ButtonProps` extends `Omit<BaseTextProps, 'style'>` (so `translate`, `fontSize`, `fontStyle`, `numberOfLines`, `margin`, `padding` all apply to the label) and adds:

| Prop                                                | Type                                  | Default / notes                                                                 |
| --------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| `buttonSize`                                        | `ButtonSize`                          | `'medium'`. Drives padding, font size, radius, width (see [Tokens](#tokens)).   |
| `backgroundColor`                                   | `string \| string[]`                  | An array renders an `AbsoluteLinearGradient` behind the label.                  |
| `gradientStart`, `gradientEnd`, `gradientOpacities` |                                       | Forwarded to the gradient.                                                      |
| `customFontColor`                                   | `string`                              | Label and spinner colour.                                                       |
| `fontStyle`                                         | `FontStyle`                           | `'Medium'`                                                                      |
| `fontSize`                                          | `FontSize`                            | From `buttonSize`. Line height is `1.3×`.                                       |
| `textStyle`                                         | `StyleProp<AnimatedStyle<TextStyle>>` | Merged into the label's `animatedStyle`.                                        |
| `borderColor`                                       | `string`                              | `'transparent'`                                                                 |
| `borderWidth`                                       | `BorderSize`                          | `'thin'`                                                                        |
| `borderRadius`                                      | `RadiusSize \| number`                | From `buttonSize`. Inner view uses `radius - 1` with `overflow: 'hidden'`.      |
| `alignSelf`                                         | `FlexAlignType`                       | `'center'`                                                                      |
| `shadow`                                            | `ShadowStylesProps`                   | Applied via `shadowStyles`.                                                     |
| `leftComponent`, `rightComponent`                   | `JSX.Element`                         | Rendered inside the row around the label.                                       |
| `leftComponentGap`, `rightComponentGap`             | `number`                              | Label `marginLeft` / `marginRight`.                                             |
| `loading`                                           | `boolean \| LoadingIndicatorProps`    | Hides the label (opacity 0), shows a small `ActivityIndicator`, disables press. |
| `disabled`                                          | `boolean`                             | Sets `activeOpacity` 0.5 and disables.                                          |
| `activeOpacity`                                     | `number`                              | `0.8`                                                                           |
| `enableRapidPress`                                  | `boolean`                             | Forwarded to `Press` (plain `TouchableOpacity`, no double‑tap protection).      |
| `animate`                                           | `boolean`                             | Inner view becomes Reanimated `Animated.View`.                                  |
| `style`                                             | `StyleProp<AnimatedStyle<ViewStyle>>` | Applied to the inner view.                                                      |
| `onPress`                                           |                                       |                                                                                 |

Children default to the string `'Submit'`.

Structure: `Press` (margin, shadow, border, width, alignSelf) → inner view (radius, background/gradient) → row (padding, `leftComponent`, `BaseText`, `rightComponent`) + optional absolute spinner.

Project wrapper pattern:

```tsx
export function PrimaryButton({
  customFontColor,
  backgroundColor,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <BaseButton
      {...props}
      customFontColor={customFontColor ?? theme.typeface.primary}
      backgroundColor={backgroundColor ?? theme.lightBackground}
    />
  );
}
```

---

## Press wrappers

Four components share the same press model. They listen to `onTouchStart` / `onTouchMove` / `onTouchEnd` on an animated view rather than using `Pressable`.

| Component           | Renders                                                           | Animation                                      |
| ------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| `Press`             | Reanimated `Animated.View`                                        | spring scale → 0.95, opacity → `activeOpacity` |
| `RNPress`           | RN `Animated.View`                                                | 200ms timing, native driver                    |
| `PressableLayout`   | `AnimatedLayout` (all `LayoutProps`)                              | Reanimated                                     |
| `RNPressableLayout` | `Layout animated animatedType="react-native"` (all `LayoutProps`) | RN Animated                                    |

Shared props:

| Prop                                           | Default  | Notes                                                                                                                                                                       |
| ---------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onPress(e: GestureResponderEvent)`            |          | Fires on touch end after `activationDelay`.                                                                                                                                 |
| `onLongPress(snapshot)`                        |          | Receives a `GestureResponderNativeEventSnapshot` (`pageX`, `pageY`, `locationX`, `locationY`, `timestamp`, `identifier`, `target`, `force`), not the synthetic event.       |
| `longPressDuration`                            | `800` ms |                                                                                                                                                                             |
| `activationDelay`                              | `50` ms  | Wait before firing `onPress` so a move‑cancel can win.                                                                                                                      |
| `activeOpacity`                                | `0.9`    |                                                                                                                                                                             |
| `disabled`                                     |          | Renders at opacity 0.5 and ignores touches.                                                                                                                                 |
| `disableAnimation`                             |          | Skip the scale/opacity feedback.                                                                                                                                            |
| `disableDoubleTapProtection`                   |          | By default a second activation within `minDoubleTapProtectionDuration` is ignored.                                                                                          |
| `minDoubleTapProtectionDuration`               | `750` ms |                                                                                                                                                                             |
| `stopPropagation`, `preventDefault`, `persist` |          | Applied to the touch events.                                                                                                                                                |
| `style`                                        |          | For `Press`/`RNPress` this is the animated view's style. For `PressableLayout` it is combined with the press animation and passed as `animatedStyle`‑equivalent internally. |

`Press` only: `enableRapidPress` renders a plain `TouchableOpacity` with `onPress`/`onLongPress`/`activeOpacity` and no protection.

A touch that moves more than 10px from its start point cancels the press.

```tsx
<Press onPress={onImport}><ImportIcon size={22} /></Press>

<PressableLayout
  center spaceBetween padding={[1, 3]} borderRadius="soft" backgroundColor="#1a1a1a"
  onPress={() => open(item)}
  onLongPress={() => showOptions(item)}
>
  ...
</PressableLayout>
```

---

## Inputs

### BaseInput

A `RowLayout` wrapper around a `TextInput` with focus/error border colours and slots on either side.

```tsx
<BaseInput
  backgroundColor={theme.lightBackground}
  textInputProps={{
    placeholder: 'Enter password',
    autoCapitalize: 'none',
    onChangeText,
  }}
  focusedBorderColor="#4A87F2"
  blurredBorderColor="transparent"
  erroredBorderColor="#E55774"
  hasError={!!error}
  LeftComponent={<LockIcon />}
  refTextInput={inputRef}
  margin={[2, 0]}
/>
```

`BaseInputProps` = the following + `LayoutProps`:

| Prop                                                               | Notes                                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `backgroundColor`                                                  | **required**                                                                                  |
| `textInputProps`                                                   | **required** `TextInputProps`; `placeholder` defaults to `'Type here...'`.                    |
| `hasError`                                                         | Switches to `erroredBorderColor`.                                                             |
| `focusedBorderColor` / `blurredBorderColor` / `erroredBorderColor` | Defaults `#4A87F2` / `transparent` / `#E55774`. Border width is `1`.                          |
| `LeftComponent`, `RightComponent`                                  | Each reduces the input's width by 10% (`100% → 90% → 80%`).                                   |
| `TextInputComponent`                                               | Custom input renderer receiving `TextInputProps & { ref }`.                                   |
| `refTextInput`                                                     | `MutableRefObject<TextInput \| null>` — receives the inner ref.                               |
| `refStateInput`                                                    | `Ref<StateInputRef>` — when provided (and no `TextInputComponent`), renders `StateTextInput`. |
| `refStateInputValidator`                                           | `(text) => boolean` — gate for `StateTextInput` updates.                                      |

Default padding is `[1.5, 4]` on iOS and `[0.4, 4]` on Android; tapping the row focuses the input.

### StateTextInput

A `TextInput` that owns its `value` in state and exposes it through `refStateInput`:

```tsx
const stateRef = useRef<StateInputRef>(null);
<StateTextInput
  refStateInput={stateRef}
  refStateInputValidator={(t) => t.length <= 10}
  placeholder="Name"
/>;
// later
stateRef.current?.value;
stateRef.current?.setValue('');
```

`StateInputRef = { value: string; setValue: Dispatch<SetStateAction<string>> }`. If the validator returns `false`, the value is not updated and `onChangeText` is not called.

---

## Indicators, injectors, utilities, icons

### LoadingIndicator

Full‑size (`100% × 100%`) centred `ActivityIndicator size="large"`.

| Prop                                           | Notes                             |
| ---------------------------------------------- | --------------------------------- |
| `TopComponent`, `BottomComponent`              | Rendered above/below the spinner. |
| `backgroundColor`, `opacity`, `animationColor` |                                   |
| `absolute`                                     | `position: 'absolute'`            |

Used by `Layout loading`. Example of a full‑screen overlay:

```tsx
<Layout
  loading={{
    absolute: true,
    opacity: 0.9,
    backgroundColor: theme.background,
    animationColor: theme.accent,
    BottomComponent: (
      <Layout margin={[2, 0, 0, 0]}>
        <Title fontSize="titleL">{message}</Title>
      </Layout>
    ),
  }}
/>
```

### SkeletonViewIndicator

Shimmering gradient block (Reanimated + `react-native-svg`). Props: `colors?: [string, string]` (default `['#ECECEC', '#FBFAFE']`), `disableAnimation?`, plus `ViewProps`. Used by `Layout skeleton`.

### ViewDimensionsInjector

Measures itself with `onLayout` and renders `renderItem(layoutRectangle)` once dimensions are known. Props: `renderItem`, `absolute?`, `justifyContent?` (default `'center'`), `aligntItems?` (default `'center'`; note the prop spelling).

### ComponentMounter

Delayed mount/unmount of a component, driven either by props or by an imperative controller.

```tsx
const mounter = useRef<ComponentMounterController>(null);
<ComponentMounter
  ref={mounter}
  component={<Toast />}
  unMountDelayInMilliSeconds={200}
/>;
mounter.current?.mountComponent({ onOpen });
mounter.current?.unMountComponent({ duration: 300, onClose });
mounter.current?.hardUnMountComponent();
```

Props: `component` (required), `showComponent?`, `setShowComponent?`, `onComponentShow?`, `onComponentClose?`, `mountDelayInMilliSeconds?`, `unMountDelayInMilliSeconds?`, `mountDefault?`. When `showComponent` is toggled from `true` while already mounted, the mounter flips `setShowComponent(false)` and hard‑unmounts on the next change.

### RadioIcon

```tsx
<RadioIcon
  isSelected={selected}
  selectedColor="#4A87F2"
  unSelectedColor="#D9D9D9"
  size={2}
  borderWidth="medium"
  alwaysShowCenter
/>
```

Built from two `Layout square={...} borderRadius="full"` views. `size` is a percentage of the longer screen dimension (default `2`).

---

## Modal building blocks

These are low‑level pieces for composing your own modals.

| Component                 | Purpose                                                                                                                                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ModalWrapper`            | Absolute‑fill view with `zIndex: maxZIndex`. Props: `enableBackgroundContentPress` (`pointerEvents="box-none"`), `useNativeModal` (renders RN `Modal visible transparent statusBarTranslucent` wrapping a `GestureHandlerRootView`), `disableAndroidBackButton`, `onRequestClose`. |
| `ModalBackgroundAnimated` | `TouchableWithoutFeedback` → Reanimated absolute‑fill view. Props: `onPress`, `style`, `animatedStyle`, `avoidStatusBar` (adds `marginTop: StatusBar.currentHeight`), children (default: `rgba(0,0,0,.2)` scrim).                                                                  |
| `ModalForegroundWrapper`  | Plain view with `zIndex: maxZIndex` on iOS. Wrap your animated foreground in it so it sits above the background on iOS and so the keyboard doesn't shift it on Android.                                                                                                            |

`maxZIndex` (`999999999`) is exported from styles.

---

## TextStream

Types out a string character by character.

```tsx
const ref = useRef<TextStreamRef>(null);
<TextStream
  ref={ref}
  autoStream
  streamCharacterDelay={15}
  CustomTextComponent={Body}
  onStreamFinish={done}
>
  {message}
</TextStream>;
ref.current?.stopStream();
```

Props (`TextStreamProps<T extends TextProps>`): `autoStream`, `startStreamDelay`, `streamCharacterDelay` (default 15ms), `skipCharacterDelayInterval` / `skipCharacterDelayAmount` (every N characters, skip the delay for M characters), `CustomTextComponent`, `onStreamFinish`, `ref: { startStream, stopStream }`, plus the wrapped text component's props. String children (or arrays of strings) are streamed; when the text grows the stream continues from the last index, when it shrinks it finishes immediately.

---

## Providers

### LocalizationProvider

```tsx
<LocalizationProvider
  sourceLanguage="en"
  targetLanguage={userLanguage}
  translation={({ sourceLanguage, targetLanguage, text }) => api.translate(...)}
  initialLanguagesRecord={bundledTranslations}
  initialLanguagesRecordRetriever={({ sourceLanguage, targetLanguage }) => api.bulk(...)}
>
```

| Prop                               | Type                                                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sourceLanguage`, `targetLanguage` | `LanguageCode` (keys of `LanguageCodesEnglishMappings`, e.g. `'en'`, `'en-US'`, `'fr'`)                                                                        |
| `translation`                      | `({ sourceLanguage, targetLanguage, text }) => Promise<string>`                                                                                                |
| `initialLanguagesRecord?`          | `LanguagesRecord` = `Partial<Record<LanguageCode, Record<hash, string>>>`                                                                                      |
| `initialLanguagesRecordRetriever?` | `({ sourceLanguage, targetLanguage }) => Promise<{ original: string; translated: string }[]>` — fetched once per target language when nothing is cached for it |

Behaviour:

- If `sourceLanguage` and `targetLanguage` share the same first two letters, `translate` returns the input unchanged.
- Cache key is `sha256(text.trim(), 'base64')`; the record is persisted in MMKV under `essentials-localization-<sourceLanguage>` via `createStorageAccessors`.
- Concurrent requests for the same text share one in‑flight promise.
- Non‑string results are treated as errors; on error the trimmed input is returned.
- Context value: `{ translate(text): Promise<string>, clearLocalCache() }`. `useLocalization()` returns it or `null`.

Consumers: any text component / `BaseButton` with `translate`, `useTranslation({ text })`, or `TranslateText` directly.

### PortalProvider

```tsx
<PortalProvider unMountBufferTimeMS={100} updateBufferTimeMS={0}>
```

Renders children, then an absolute‑fill `pointerEvents="box-none"` host containing every mounted portal item.

- `usePortal(CustomPortalContext?)` → `{ mount(key, element, onMount?), update(key, element), unmount(key, onUnMount?) }` or `null`.
- `usePortalComponent({ name, Component, disable?, CustomPortalContext? })` mounts `Component` on first render, updates it when it changes, and unmounts on cleanup; returns the portal context.
- `unMountBufferTimeMS` (default 100) delays removal so a late `update` can cancel it; `updateBufferTimeMS` throttles updates per item.
- Pass `CustomPortalContext` (a context created from `PortalContext`'s type) to run several independent portal hosts.

### EventTrackerProvider

Persists "events" (uploads, exports, background jobs) in MMKV and polls their status while `in_progress`.

```tsx
<EventTrackerProvider
  statusCheckFnRegistry={{
    upload: async (event, trigger) => ({ ...event, status: await checkUpload(event.id) }),
  }}
>
```

| Prop                                                                                  | Notes                                                                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `statusCheckFnRegistry`                                                               | `Record<string, StatusCheckFn>`; `StatusCheckFn = (event, triggerType?) => Promise<EventTracker>` |
| `maxStoredEventTrackers?`, `defaultMaxInProgressTime?`, `defaultStatusCheckInterval?` | Declared props.                                                                                   |

`EventTracker` fields: `id`, `name`, `status: 'in_progress' | 'done' | 'failed' | 'cancelled'`, `description`, `createdAt`, `updatedAt`, `statusCheckFnId`, and optional `extraData`, `image`, `extra`, `type`, `url`, `expires`, `statusCheckInterval` (default 30000ms), `maxTimeInProgress`, `triggerStatusCheckFnOn?: ('expired' | 'maxTimeInProgress')[]`.

Behaviour: on mount, expired events are deleted and in‑progress ones start a `Scheduler.Schedule`. Each tick calls the registered function; a status change is stored and, if no longer in progress, polling stops. Exceeding `maxTimeInProgress` marks the event `failed` (optionally calling the check function with `'maxTimeInProgress'`); passing `expires` deletes it (optionally calling with `'expired'`). Missing registry entries delete the event.

Hooks: `useEventTracker()` → `{ addEventTracker(event), removeEventTracker(id), deleteEvent(event), clearEvents(), markEventsAsSeen() }`; `useTrackerEvents()` → `{ events, seen }`. Storage accessors `eventsStorage`, `seenEventsStorage`, `unSeenEventsStorage` are exported.

### Data collection

Typed, context‑based accumulation of partial data (multi‑step forms):

```tsx
type Signup = { email: string; name: string };
const CollectedDataContext =
  createContext<CollectedDataContextValue<Partial<Signup>>>(undefined);
const DataCollectionContext =
  createContext<DataCollectionContextValue<Partial<Signup>>>(undefined);
export const signup = createDataCollector<Signup>({
  CollectedDataContext,
  DataCollectionContext,
});

// <signup.Provider> ... </signup.Provider>
const { collectData, collectedDataRef } = signup.useDataCollection()!;
collectData({ key: 'email', value }); // or collectData(prev => ({ ...prev, name }))
const { collected } = signup.useCollectedData()!;
```

`DataCollectionProvider`, `useDataCollection(ctx)`, `useCollectedData(ctx)` are also exported individually.

---

## Render isolation

Lets a subtree subscribe to a parent's fast‑changing values without re‑rendering the parent's other children.

```tsx
type Obs = { scrollY: number; isDragging: boolean };

function Owner() {
  const isolateRef = useIsolateRef<Obs>();
  const { startObserving, stopObserving } = useIsolateObservables({
    ref: isolateRef,
    observables: { scrollY, isDragging },
    isObserving: true,
  });
  return (
    <IsolateRefDependant ref={isolateRef}>
      <Header isolateRef={isolateRef} />
    </IsolateRefDependant>
  );
}

function Header({ isolateRef }: { isolateRef: IsolateRef<Obs> }) {
  const { observables, stopObservation } = isolateRef.current!.useObservation({
    scrollY: (y) => y > 100, // predicate: re-render only when it returns true
    isDragging: true, // re-render on any change
  });
  return <Title>{observables.scrollY}</Title>;
}
```

- `useIsolateObservables({ ref, observables, isObserving? })` emits an update through an `EventEmitter` whenever `observables` changes while observing, tracking which keys changed. Returns `{ startObserving, stopObserving }`.
- The ref exposes `useObservation(subscribeTo?)` → `{ observables, stopObservation }` and `get(key)` (read the latest snapshot without subscribing).
- `IsolateRefDependant` renders its children only once `ref.current` is populated (retries up to 5 times with increasing delay).

Types: `IsolateObservables`, `IsolateRef<T>`, `IsolateRefObject<T>`, `IsolateRefData<T>`, `IsolateObserve<T>`, `UpdatedIsolateObservables`, `ChangedIsolateObservables`.

---

## Gestures

All three wrap children in a `GestureDetector` from `react-native-gesture-handler`.

| Component                   | Props                                                                                                                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DragGesture`               | `onDragStart(e)`, `onDrag(e)`, `onDragEnd?(e)` (pan gesture, worklet callbacks), `minDistance?` (default 1), `disable?`, `enableContentScroll?` (runs simultaneously with a `Gesture.Native()` so scroll views inside still scroll) |
| `SwipeGesture`              | `direction: 'UP' \| 'DOWN' \| 'LEFT' \| 'RIGHT'`, `onActivation(e)` (fling, `runOnJS`)                                                                                                                                              |
| `TwoFingerLongPressGesture` | `onActivation(e)` (two pointers, 1000ms)                                                                                                                                                                                            |

```tsx
<SwipeGesture direction="UP" onActivation={onSwipeUp}>
  <SwipeGesture direction="DOWN" onActivation={onSwipeDown}>
    <Layout width={90} height={10} />
  </SwipeGesture>
</SwipeGesture>
```

---

## Animations

### useDragAnimation

```tsx
const { onDragStart, onDrag, dragAnimatedStyle, translationX, translationY } =
  useDragAnimation();
<DragGesture
  onDragStart={onDragStart}
  onDrag={(e) => onDrag({ posX: e.translationX, posY: e.translationY })}
>
  <AnimatedLayout animatedStyle={dragAnimatedStyle} square={10} />
</DragGesture>;
```

`onDrag({ posX, posY, minPosX?, maxPosX?, minPosY?, maxPosY? })` clamps to ± half the screen by default. Also returns `prevTranslationX/Y`.

### ArcSpinnerAnimation

`<ArcSpinnerAnimation size={24} color="#999" />` — a rotating arc (1s linear loop).

### AnimateComponent (React Native `Animated`)

Declarative wrapper that creates an `Animated.Value`, `Animated.ValueXY`, or a string‑interpolated value depending on `initialPosition`, builds the composition, and renders `Animated.View` with the style you derive.

```tsx
const ref = useRef<AnimateComponentRef<number>>(null);
<AnimateComponent
  ref={ref}
  initialPosition={0}
  toPosition={[{ type: 'timing', toValue: 1, duration: 300, useNativeDriver: true }]}
  autoStart
  returnToStart
  loop={3}
  style={(value, { inputRange }) => ({ opacity: value })}
  onAnimationEnd={...}
>
  {children}
</AnimateComponent>
ref.current?.reverse();
```

- `initialPosition`: `number` → `AnimateValueComponent`; `string` → `AnimateStringValueComponent` (uses `useAnimatedStringValue`, `type` limited to `timing | spring`); `{ x, y }` → `AnimateXYValueComponent`.
- `toPosition`: one config or an array (sequence). Config = RN `TimingAnimationConfig | SpringAnimationConfig | DecayAnimationConfig` with a `type` discriminator.
- `autoStart`, `returnToStart`, `loop` (iterations), `onAnimationEnd`.
- Ref: `{ start, stop, reset, reverse, setValue, value }` (`setValue` is `undefined` for the string variant).

### SVG path animations

`AnimateSVGPathValueComponent` (`mode: 'InterpolatePathProps'`) animates a single 0→1 value and lets you interpolate any `PathProps`:

```tsx
<AnimateSVGPathValueComponent
  mode="InterpolatePathProps"
  animationConfig={{ type: 'timing', duration: 800, useNativeDriver: true }}
  autoStart
  pathProps={(value, { inputRange }) => ({
    d: PATH,
    strokeDashoffset: value.interpolate({ inputRange, outputRange: [100, 0] }),
  })}
/>
```

`AnimateSVGPathValuesComponent` (`mode: 'AnimatedPathProps'`) animates several path props from `from` to a list of `to` values, in parallel or sequence:

```tsx
<AnimateSVGPathValuesComponent
  mode="AnimatedPathProps"
  config={{ type: 'spring', useNativeDriver: true }}
  pathProps={{ d: PATH, stroke: '#fff' }}
  animatedPathProps={[
    { name: 'strokeWidth', from: 1, to: [4, 2] },
    {
      name: 'fillOpacity',
      from: 0,
      to: [1],
      config: { type: 'timing', duration: 300, useNativeDriver: true },
    },
  ]}
  isSequence
  autoStart
/>
```

Both render `AnimatedPath` (`Animated.createAnimatedComponent(Path)`, also exported) and expose `{ start, stop, reset, reverse }` plus `value` / `values` through `ref`.

---

## SVG

- `AbsoluteLinearGradient` — absolutely positioned full‑size SVG gradient. Props: `colors: string[]`, `opacities?` (default `[1, 1]`), `start?` (default `{x:'0',y:'0'}`), `end?` (default `{x:'1',y:'0'}`), `style?`. Stops are evenly spaced.
- `LinearGradient` — a `View` with `position: 'relative'` containing `AbsoluteLinearGradient` and your children. Same props plus `style`.

---

## Hooks

### useDeviceOrientation

Subscribes to `Dimensions` changes and returns `{ screenWidth, screenHeight, orientation, relativeX, relativeY, relativeShort, relativeLong, relativeXWorklet, relativeYWorklet, relativeShortWorklet, relativeLongWorklet, normalize, normalizeShort }`. Use this (not the static functions) when values must react to rotation or inside Reanimated worklets.

### useFontSizes(fontScale = 1)

Returns the `FontSize → number` map computed with the reactive `normalize`.

### useViewDimensions()

`const [layout, onLayout] = useViewDimensions();` — `layout` is `LayoutRectangle | null`.

### useImageSize / useImageSizes / calculateSize

Fit remote images into `maxWidth × maxHeight` preserving aspect ratio.

- `useImageSize({ image, maxWidth, maxHeight })` → `{ imageSize: { width, height }, calculateSize }`
- `useImageSizes({ images, maxWidth, maxHeight })` → `{ imageSizes, calculateSize }` (sequential `Image.getSize`)
- `calculateSize({ imageWidth, imageHeight, maxWidth, maxHeight })` → `{ displayWidth, displayHeight }`

### useInputRef({ inputValidationFunction? })

Returns `[inputRef, onChangeText, inputValue, defaultInputValue]`. Keeps the current text on `inputRef.current.value` without re‑rendering; when a validator rejects input, the hook switches the field to controlled mode so the rejected text is reverted. Wire all four returned values when using a validator.

### useKeyboardListeners({ listeners, keyboardHeightRef?, subscribeCondition? })

Registers the given `Keyboard` listeners (`keyboardDidShow`, `keyboardWillHide`, ...) and tracks the keyboard height in a ref. Returns `{ keyboardHeightRef }`.

### useScrollableItems({ itemsFetchingFunction, limit?, minFetchDuration?, fetchCooldown?, itemsFetchingFunctionArgs? })

Pagination state for `FlatList`‑style lists.

```tsx
const list = useScrollableItems<Post, { userId: string }>({
  limit: 20,
  itemsFetchingFunction: ({ limit, skip, userId }) =>
    api.posts({ limit, skip, userId }),
  itemsFetchingFunctionArgs: { userId },
});
<FlatList
  data={list.items}
  onLayout={list.onLayout}
  onEndReached={list.onItemsEndReached}
  refreshing={list.refreshingItems}
  onRefresh={list.onRefreshItems}
/>;
```

Returns `{ items, setItems, onLayout, onItemsEndReached, onRefreshItems, refreshingItems, loading, setLoading, updateListItem(id, key, item), removeListItem(id, key), fetchItems({ refresh? }) }`. Fetching stops once a page returns fewer than `limit` items.

### useDebounce({ delayInMilliSecs, onTrigger, onPreTrigger?, onPostTrigger?, onDebounceInvocation? })

Returns `{ debounce(overrides?), cancelDebounce }`. Each `debounce()` call restarts a `Scheduler.Timer`; overrides can replace the delay and callbacks for that invocation. Default delay 5000ms if `0`/falsy.

### useInterval({ intervalInMilliSecs, onTrigger, autoStart?, onPreTrigger?, onPostTrigger?, onIntervalInvocation? })

Returns `{ startInterval(overrides?), stopInterval }`. Cleans up on unmount.

### useTimeout({ cb, ms }, deps)

`setTimeout` that resets whenever `deps` change and clears on unmount.

### useTimer({ seconds, onTimerEnds, start })

Countdown; returns `{ minutes, seconds }` and calls `onTimerEnds` at zero.

### useTranslation({ text })

Returns the translated string (initially `text`) using `LocalizationProvider`. Logs an error if the provider is missing.

### useAnimatedStringValue(inputRange, outputRange, config?)

Creates a stable RN `Animated.Value` and returns `{ value, interpolatedValue }` where `interpolatedValue` maps numbers to strings (colours, degrees, ...).

### useIsolateObservables / useIsolateRef

See [Render isolation](#render-isolation).

---

## Storage (MMKV)

All accessors share one MMKV instance (`storageAccessorsInstance`, id `'rne-csa'`).

### createStorageAccessors<T>(key)

```ts
const settings = createStorageAccessors<{ theme: 'dark' | 'light' }>(
  'settings'
);
settings.store({ theme: 'dark' });
settings.retrieve(); // { theme: 'dark' } | undefined
settings.remove(); // returns the removed value

// in components
const [value, setValue] = settings.use(); // re-renders when the key changes; setValue accepts a value or updater
settings.useObject();
settings.useString();
settings.useNumber();
settings.useBoolean();
settings.useBuffer();
```

Numbers, booleans, and strings are stored natively; anything else is `JSON.stringify`ed. `retrieve` infers the type on first read.

### createStorageAccessorsDynamic<T>(baseKey)

Same API but every method takes a `keySuffix` first (`store('123', item)`, `retrieve('123')`, `use('123')`, ...) and the set of suffixes is tracked so you can `retrieveAll()` and `removeAll()`.

---

## Scheduler

Exported as a namespace: `import { Scheduler } from '@shaquillehinds/react-native-essentials'`.

| Class                            | Behaviour                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `Scheduler.Timer(action, ms)`    | One‑shot `setTimeout`; `start()`, `stop()`.                                          |
| `Scheduler.Schedule(action, ms)` | Repeating `setInterval`; `action` receives the schedule; `start()`, `stop()`.        |
| `Scheduler.SequentialTimer(ms)`  | Queue of actions run one per `ms`; `start(action \| action[])`, `stop()`, `clear()`. |

All extend `EventEmitter` (`'timeout'` / `'interval'` events).

---

## Styles

- `shadowStyles({ shadowColor?, shadowOpacity?, shadowRadius?, shadowOffset? })` → `{ shadowColor: 'black', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 20 }` with your overrides (`elevation` mirrors `shadowRadius`).
- `transformSpacing({ margin?, padding?, orientation? })` and `spacerStyles(type, { orientation? })(...values)` — resolve percentage tuples to `margin*`/`padding*` styles.
- `maxZIndex = 999999999`.
- Types: `Spaces`, `Spacing`, `Spacer`, `SpaceType`, `ShadowStylesProps`.

---

## Utilities

| Export                                                                  | Description                                                                                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `wait(ms?)`                                                             | Promise that resolves after `ms`.                                                                                                          |
| `getSequantialRandomId(prefix = 'id')`                                  | `prefix-<random base36>-<timestamp base36>`.                                                                                               |
| `filterMap(arr, fn)`                                                    | Skips falsy items; drops `null`/`undefined` results.                                                                                       |
| `advancedMap(arr, fn, { omit?, insertNotFound? })`                      | Map with type‑based omission (`omit: { string: true, nullable: true, ... }`) and an optional fallback insertion when `find` never matches. |
| `measureAsync(refOrEvent)`                                              | Promise of `{ transX, transY, width, height, pageX, pageY }` (or `null` if the ref is empty).                                              |
| `snapShotGestureResponderEvent(e)`                                      | Copies `pageX/pageY/locationX/locationY/timestamp/identifier/target/force` out of a synthetic event.                                       |
| `strToNumPercentage('40%')` / `strToNumPercentageWorklet`               | Parses a percentage string to a number; throws on invalid input.                                                                           |
| `mergeStringRecords({ obj1, obj2, overwrite = true })`                  | Shallow merge of `Record<string, string>`.                                                                                                 |
| `mergeLanguagesRecords({ obj1, obj2, overwrite = true })`               | Merge of `LanguagesRecord` per language.                                                                                                   |
| `LanguageCodes`                                                         | Readonly array of supported BCP‑47‑style codes.                                                                                            |
| `LanguageCodesEnglishMappings`                                          | `code → English name` map; `LanguageCode = keyof typeof LanguageCodesEnglishMappings`.                                                     |
| `checkDependency`, `checkRequiredDependencies`, `createDependencyError` | See [Installation](#installation).                                                                                                         |

---

## Algorithms

| Function                                                             | Example                                                                                  |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `kFormatter(1500)`                                                   | `'1.5k'` (numbers ≤ 999 returned as numbers)                                             |
| `firstLetterCap('hello')`                                            | `'Hello'`                                                                                |
| `titleCase('hello world')`                                           | `'Hello World'`                                                                          |
| `camelCase('hello world')`                                           | `'helloWorld'`                                                                           |
| `snakeToTitleCase`, `dashToTitleCase`, `toTitleCase`                 | `_` / `-` / `-_/` → Title Case                                                           |
| `snakeToCamelCase`, `dashToCamelCase`, `toCamelCase`                 | → camelCase                                                                              |
| `camelToUpperSnake('welcomeToJamrock')`                              | `'WELCOME_TO_JAMROCK'`                                                                   |
| `centsToDollars({ cents: 1999, dollarSign: true, currency: 'USD' })` | `'$19.99 USD'`                                                                           |
| `_24hrsToDate('1330')`                                               | `Date` at 13:30 (fixed date)                                                             |
| `getTodayInSeconds()`                                                | Seconds elapsed since local midnight                                                     |
| `secondsToTime(3725, { hideHours?, hideSeconds? })`                  | `'01:02:05'`                                                                             |
| `toBase64`, `fromBase64`                                             | UTF‑8 ⇄ base64 via `buffer`                                                              |
| `objToQueryStr({ a: 1, b: undefined })`                              | `'a=1'`                                                                                  |
| `keepArrayUnique({ prevItems, newItems, comparatorExtractor })`      | Appends only unseen items                                                                |
| `deepCopy(obj)`                                                      | `JSON.parse(JSON.stringify(obj))`                                                        |
| `hexOpacity(30)`                                                     | `'4c'` — append to a hex colour (`'#000000' + hexOpacity(30)`); accepts `0–1` or `0–100` |
| `normalizeNumberArray([1, 2, 3])`                                    | `[0, 0.5, 1]`                                                                            |
| `stringArrayToNormalizedNumberArray(['1', 'x', '3'])`                | Parses floats (falling back to the index) then normalizes                                |

---

## Full export index

**Layouts** — `Layout`, `RowLayout`, `ScreenLayout`, `AnimatedLayout`, `TouchableLayout`, `SeparatorLayout`; types `LayoutProps`, `ScreenLayoutProps`, `AnimatedLayoutProps`, `TouchableLayoutProps`, `SeparatorLayoutProps`.

**Typography** — `BaseText`, `Title`, `Body`, `Heading`, `TranslateText`, `LocalizationComponent`, `TranslationComponent`; types `BaseTextProps`, `FontStyle`, `FontSize`, `LineHeight`, `LetterSpacing`, `TranslateTextProps`, `LocalizationComponentProps`, `TranslationComponentProps`.

**Buttons** — `BaseButton`; types `ButtonProps`, `ButtonSize`, `BorderSize`, `RadiusSize`.

**Wrappers** — `Press`, `RNPress`, `PressableLayout`, `RNPressableLayout`, `TextStream`, `ModalWrapper`, `ModalBackgroundAnimated`, `ModalForegroundWrapper`, `IsolateRefDependant`; types `PressProps`, `RNPressProps`, `PressableLayoutProps`, `RNPressableLayoutProps`, `TextStreamProps`, `TextStreamRef`, `ModalWrapperProps`, `ModalBackgroundAnimatedProps`.

**Inputs** — `BaseInput`, `StateTextInput`; types `BaseInputProps`, `StateInputProps`, `StateInputRef`.

**Indicators / injectors / utilities / icons** — `LoadingIndicator`, `SkeletonViewIndicator`, `ViewDimensionsInjector`, `ComponentMounter`, `RadioIcon`; types `LoadingIndicatorProps`, `SkeletonLoadingIndicatorProps`, `ViewDimensionsInjectorProps`, `ComponentMounterProps`, `ComponentMounterController`, `ComponentMounterRef`, `MountComponentProps`, `UnMountComponentProps`.

**Providers** — `LocalizationProvider`, `LocalizationContext`, `useLocalization`; `PortalProvider`, `PortalContext`, `usePortal`, `usePortalComponent`; `EventTrackerProvider`, `EventTrackersContext`, `TrackerEventsContext`, `useEventTracker`, `useTrackerEvents`, `eventsStorage`, `seenEventsStorage`, `unSeenEventsStorage`; `DataCollectionProvider`, `createDataCollector`, `useDataCollection`, `useCollectedData`; and their types (`LocalizationProviderProps`, `LocalizationContextValue`, `PortalContextValue`, `PortalItem`, `PortalKey`, `UsePortalComponentProps`, `EventTracker`, `EventData`, `EvenStatus`, `StatusCheckFn`, `EventTrackersProviderProps`, `EventTrackersContextValue`, `TrackerEventsContextValue`, `DataCollectionProviderProps`, `CollectDataProps`, `CollectedDataContextValue`, `DataCollectionContextValue`, ...).

**Hooks** — `useDeviceOrientation`, `useFontSizes`, `useViewDimensions`, `useImageSize`, `useImageSizes`, `calculateSize`, `useInputRef`, `useKeyboardListeners`, `useScrollableItems`, `useTimer`, `useDebounce`, `useInterval`, `useTimeout`, `useTranslation`, `useAnimatedStringValue`, `useIsolateObservables`, `useIsolateRef`.

**Gestures** — `DragGesture`, `SwipeGesture`, `TwoFingerLongPressGesture`; types `DragGestureProps`, `SwipeProps`, `TwoFingerLongPressProps`.

**Animations** — `useDragAnimation`, `ArcSpinnerAnimation`, `AnimateComponent`, `AnimateValueComponent`, `AnimateXYValueComponent`, `AnimateStringValueComponent`, `AnimateSVGPathValueComponent`, `AnimateSVGPathValuesComponent`, `AnimatedPath`; types `AnimateComponentProps`, `AnimateComponentRef`, `AnimateComponentAnimationConfig`, `InitialValue`, `XY`, `XYNumber`, `XYValue`, `AnimateSVGPathComponentValueProps`, `AnimateSVGPathComponentValuesProps`, `AnimateSVGComponentAnimationConfig`, `AnimatedSVGPathProp`, `OnMoveAnimationProps`, ...

**SVG** — `AbsoluteLinearGradient`, `LinearGradient`; types `AbsoluteLinearGradientProps`, `LinearGradientProps`.

**Styles** — `shadowStyles`, `spacerStyles`, `transformSpacing`, `maxZIndex`; types `ShadowStylesProps`, `Spaces`, `Spacing`, `Spacer`, `SpaceType`.

**Utils** — `relativeX`, `relativeY`, `relativeShort`, `relativeLong`, `normalize`, `normalizeShort`, `scale`, `relativeXWorklet`, `relativeYWorklet`, `relativeShortWorklet`, `relativeLongWorklet`, `fontSizes`, `borderSizes`, `radiusSizes`, `buttonSizes`, `filterMap`, `advancedMap`, `measureAsync`, `getSequantialRandomId`, `Scheduler`, `wait`, `snapShotGestureResponderEvent`, `createStorageAccessors`, `createStorageAccessorsDynamic`, `storageAccessorsInstance`, `storageAccessorsInstanceID`, `LanguageCodes`, `LanguageCodesEnglishMappings`, `mergeStringRecords`, `mergeLanguagesRecords`, `checkDependency`, `checkRequiredDependencies`, `createDependencyError`, `strToNumPercentage`, `strToNumPercentageWorklet`; types `FilterMapFunc`, `AdvancedMapFunc`, `AdvancedMapOptions`, `OmitTypes`, `MeasureInputAsyncResponse`, `GestureResponderNativeEventSnapshot`, `LanguageCode`, `LanguagesRecord`, `CheckRequiredDependenciesOptions`, ...

**Algorithms** — `kFormatter`, `firstLetterCap`, `titleCase`, `camelCase`, `snakeToTitleCase`, `dashToTitleCase`, `toTitleCase`, `snakeToCamelCase`, `dashToCamelCase`, `toCamelCase`, `camelToUpperSnake`, `centsToDollars`, `_24hrsToDate`, `getTodayInSeconds`, `toBase64`, `fromBase64`, `objToQueryStr`, `keepArrayUnique`, `deepCopy`, `hexOpacity`, `normalizeNumberArray`, `stringArrayToNormalizedNumberArray`, `secondsToTime`.

**Device constants** — `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `WINDOW_WIDTH`, `WINDOW_HEIGHT`, `MAX_DIMENSION`, `MIN_DIMENSION`, `initialOrientation`, `aspectRatio`, `isSmallDevice`, `isLargeDevice`, `isIOS`, `isWeb`, `isTablet`, `isIpad`, `isAndroid`; types `DeviceOrientation`, `ScaledSizeDimensions`.

**Globals** (side effect of import) — `is`, `isDef`, `errMsg`, `Array.prototype.filterMap`.

---

## Known caveats

- `centerX` means `justifyContent: 'center'` (main axis), `center` means `alignItems: 'center'` (cross axis). In a column layout `centerX` therefore centres vertically.
- `Layout loading` discards the layout's own dimensions; use `skeleton` when you need a placeholder of the same size.
- With `animated` + `animatedType="reanimated"` (including `AnimatedLayout` and `PressableLayout`) the `style` prop is not applied; pass `animatedStyle`.
- `Layout` / `TouchableLayout` accept only `BorderSize` / `RadiusSize` tokens for `borderWidth` / `borderRadius`; `BaseButton` additionally accepts a numeric `borderRadius`.
- `relativeShortWorklet` and `relativeLongWorklet` from the static utils do not return a value. Use `useDeviceOrientation().relativeShortWorklet` / `relativeLongWorklet` inside worklets.
- `Array.prototype.advancedMap` is declared in the global types but its installation is guarded by a condition that is false once `filterMap` has been installed, so it may be absent at runtime. Use the exported `advancedMap(arr, fn, opts)` function.
- `ArcCircle`, `useAnimatedValues`, and `sha256` are internal and not exported from the package entry.
- `ViewDimensionsInjector`'s alignment prop is spelled `aligntItems`.
- `BaseInput` requires `backgroundColor` and `textInputProps`.
- Text components resolve `padding`/`margin` with the static (non‑reactive) `relativeX`/`relativeY`; layouts use the reactive versions from `useDeviceOrientation`.

# Rules: building apps with `@shaquillehinds/react-native-essentials`

These rules apply to every React Native / Expo screen, component, hook, and utility you write in this project. The package is the default toolkit. Reach for it first; reach for raw `react-native` primitives only when the package has no equivalent.

Everything below is derived from the package source. Do not assume props, components, or behaviours that are not listed here.

---

## 0. Non‑negotiables

1. **Import from the package root.** `import { Layout, RowLayout, ScreenLayout, BaseText, ... } from '@shaquillehinds/react-native-essentials'`. Never deep‑import from `dist/` or `src/`.
2. **Every screen root is `ScreenLayout`.** Never `View style={{flex:1}}` or `SafeAreaView` by hand.
3. **Every container is `Layout` or `RowLayout`.** Never write `<View style={{ flexDirection: 'row', alignItems: 'center' }}>` — that is `<RowLayout center>`.
4. **Every piece of text is `BaseText` / `Title` / `Heading` / `Body`.** Never a bare `<Text>`.
5. **Every button is `BaseButton`** (or a thin project wrapper around it). Never `TouchableOpacity` + `Text` by hand.
6. **Every tappable non‑button surface is `Press` or `PressableLayout`.** Prefer these over `Pressable` / `TouchableOpacity`.
7. **Spacing and size are percentages, not pixels.** Use `padding={[...]}` / `margin={[...]}` tuples and `width` / `height` numbers on layouts, or `relativeX` / `relativeY` / `normalize` in `StyleSheet.create`. Never hard‑code `16`, `24`, `320` as dp values.
8. **Border radius and border width are tokens.** `borderRadius="soft"`, `borderWidth="thin"`. In `StyleSheet.create` use `radiusSizes.soft` / `borderSizes.thin`.
9. **Fonts are loaded under the `FontStyle` names.** The package sets `fontFamily` to the literal `fontStyle` string (`'Regular'`, `'Medium'`, `'SemiBold'`, `'Bold'`, ...). The app must register fonts under exactly those names (see §9).
10. **Never invent an export.** If you are unsure something exists, check §12 (full export list).

---

## 1. Peer dependencies (must exist in the app)

Required by `checkRequiredDependencies()` and by direct imports:

- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-safe-area-context`
- `react-native-mmkv`
- `react-native-svg`

Also imported by the package: `eventemitter3`, `buffer`.

When scaffolding, install with `npx expo install react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-mmkv react-native-svg`. Wrap the app root in `GestureHandlerRootView` (the example app does this in its providers component).

---

## 2. The sizing model — read this before writing any style

The package sizes everything relative to the **screen** (`Dimensions.get('screen')`), so layouts scale across devices.

| Function            | Meaning                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `relativeX(n)`      | `n%` of screen **width**                                                                                                           |
| `relativeY(n)`      | `n%` of screen **height**                                                                                                          |
| `relativeShort(n)`  | `n%` of the **shorter** screen dimension                                                                                           |
| `relativeLong(n)`   | `n%` of the **longer** screen dimension                                                                                            |
| `normalize(n)`      | `n` scaled by the longer dimension × `0.1152` (≈ design‑pt on a ~868pt‑tall device), pixel‑rounded. Used for font sizes and radii. |
| `normalizeShort(n)` | Same, against the shorter dimension. Used for button padding.                                                                      |

`*Worklet` variants exist for `relativeX`, `relativeY`, `strToNumPercentage`. (`relativeShortWorklet` / `relativeLongWorklet` in the static utils are missing a `return` — use the versions from `useDeviceOrientation()` inside worklets instead.)

Rules of thumb for agents:

- Horizontal gutters: `padding={[0, 3]}` (0% vertical, 3% horizontal) — this is the standard screen gutter in the example app.
- Vertical rhythm between blocks: `margin={[2, 0, 0, 0]}` (2% of screen height on top).
- Small inline gaps: `margin={[0, 1]}` or `margin={[0, 0, 0, 2]}`.
- Full width row inside a padded screen: `width={90}` or `width={'100%'}`.
- Icon / avatar squares: `square={n}` (n% of the longer screen dimension).
- Inside `StyleSheet.create`, import `relativeX`, `relativeY`, `radiusSizes`, `normalize` from the package and compute at module scope.

Static constants also available: `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `WINDOW_WIDTH`, `WINDOW_HEIGHT`, `MAX_DIMENSION`, `MIN_DIMENSION`, `isIOS`, `isAndroid`, `isWeb`, `isTablet`, `isIpad`, `isSmallDevice`, `isLargeDevice`, `aspectRatio`, `initialOrientation`.

---

## 3. Spacing tuples (`padding` / `margin`)

Type: `[number, number?, number?, number?]` — classic CSS shorthand, **values are percentages**:

| Tuple          | Result                              |
| -------------- | ----------------------------------- |
| `[a]`          | all sides `a`                       |
| `[v, h]`       | top/bottom `v`, left/right `h`      |
| `[t, h, b]`    | top `t`, left/right `h`, bottom `b` |
| `[t, r, b, l]` | each side                           |

Vertical values (top/bottom) are `relativeY` (% of screen **height**). Horizontal values (left/right) are `relativeX` (% of screen **width**). So `[2, 2]` is _not_ square.

`padding` / `margin` tuples are accepted by: `Layout`, `RowLayout`, `ScreenLayout`, `AnimatedLayout`, `TouchableLayout`, `SeparatorLayout`, `PressableLayout`, `RNPressableLayout`, `BaseInput`, all text components, `BaseButton` (margin + padding).

---

## 4. Layouts — the core of every screen

### `Layout` (column by default)

```tsx
<Layout
  // sizing (numbers are % of screen; strings pass through e.g. '100%')
  width={90} height={'100%'} square={10}
  flex={[1]}              // [flex] | [flex, flexShrink] | [flex, flexShrink, flexBasis]
  // alignment
  center                   // alignItems: 'center'  (CROSS axis)
  centerX                  // justifyContent: 'center' (MAIN axis)
  spaceBetween spaceEven spaceStart spaceEnd spaceCenter   // justifyContent variants
  wrap                     // flexWrap: 'wrap'
  flexDirection="row"      // prefer <RowLayout> instead
  alignSelf="flex-end"
  // positioning
  absolute top={0} bottom={0} left={0} right={0}
  // decoration
  backgroundColor="#111"
  borderColor="#333" borderWidth="thin" borderRadius="soft"
  // spacing
  padding={[1, 3]} margin={[2, 0]}
  // states
  loading                  // or loading={{ ...LoadingIndicatorProps }}
  skeleton                 // or skeleton={{ colors: ['#eee', '#fff'] }}
  // behaviour
  scrollable               // renders ScrollView; ScrollViewProps become valid
  animated animatedType="reanimated" animatedStyle={rStyle}
  style={...}              // extra ViewStyle, applied last
/>
```

**Critical naming quirk (memorise this):**

- `center` → `alignItems: 'center'` (cross axis).
- `centerX` / `spaceCenter` → `justifyContent: 'center'` (main axis).

Therefore:

- In a **column** `Layout`: `center` = horizontal centring, `centerX` = vertical centring.
- In a **`RowLayout`**: `center` = vertical centring, `centerX` = horizontal centring.
- To centre both ways: `center centerX`.

**`loading` replaces the entire layout** with a `LoadingIndicator` (only `backgroundColor` and the `loading` object props are used). `skeleton` renders a shimmering `SkeletonViewIndicator` **with the same dimensions/spacing** as the layout would have had.

**`scrollable`**: `padding`/alignment props go to `contentContainerStyle`; `margin`/size/position props go to the outer `style`; `overflow` is forced to `'visible'`. Any `contentContainerStyle` you pass is merged after the package's.

**`animated`**: with `animatedType="reanimated"` (default) the wrapper is `Animated.View`/`Animated.ScrollView` from Reanimated and **`style` is ignored — use `animatedStyle`**. With `animatedType="react-native"` the wrapper is RN `Animated.View` and `style` is used.

### `RowLayout`

`Layout` with `flexDirection: 'row'` forced (it is applied _after_ your `style`, so it always wins). Identical props.

### `ScreenLayout`

`Layout` with `flex: 1` + `display: 'flex'` and an optional `safe` prop.

- `safe` wraps content in `SafeAreaProvider` → `SafeAreaView edges={['top','bottom']}` and copies `backgroundColor` (from prop or `style`) onto the safe view so notches match.
- Accepts `scrollable` like `Layout`.

Canonical screen:

```tsx
<ScreenLayout safe backgroundColor={theme.background} padding={[0, 3]}>
  <RowLayout center spaceBetween margin={[2, 0, 0, 0]}>
    <Title>Journals</Title>
    <Press onPress={onImport}>
      <ImportIcon />
    </Press>
  </RowLayout>
  ...
</ScreenLayout>
```

Fully centred screen (splash/empty state):

```tsx
<ScreenLayout center centerX backgroundColor={theme.background}>
```

### `AnimatedLayout`

`Layout` with `animated` pre‑set (Reanimated). Props: `LayoutProps` minus `animated`, plus `animatedStyle`.

### `TouchableLayout`

Same styling props as `Layout` (no `scrollable`/`animated`) rendered as `TouchableOpacity`. Use when you want a plain opacity‑fade tappable container. Prefer `PressableLayout` for the package's scale‑spring feel.

### `SeparatorLayout`

A horizontal rule with optional centred children (e.g. "OR"). Props: `lineColor` (default `#222222`), `lineWidth` (default `0.5`), `lineOpacity` (default `0.8`) + all `LayoutProps`. Defaults to `center margin={[2, 0]}`.

---

## 5. Typography

| Component  | Default `fontSize` | Default `fontStyle` | Allowed `fontSize`                     |
| ---------- | ------------------ | ------------------- | -------------------------------------- |
| `BaseText` | `bodyM`            | `Regular`           | any `FontSize`                         |
| `Body`     | `bodyM`            | `Regular`           | `bodyS` \| `bodyM` \| `bodyL`          |
| `Title`    | `titleM`           | `Medium`            | `titleS` \| `titleM` \| `titleL`       |
| `Heading`  | `headingS`         | `SemiBold`          | `headingS` \| `headingM` \| `headingL` |

`FontSize` scale (design pts before `normalize`): `headingL 26`, `headingM 24`, `headingS 22`, `titleL 20`, `titleM 18`, `titleS 16`, `bodyL 14`, `bodyM 12`, `bodyS 10`.

`FontStyle` union: `'Thin' | 'Extra Light' | 'Light' | 'Regular' | 'Medium' | 'SemiBold' | 'Bold' | 'ExtraBold' | 'Black'`. **`fontStyle` is written straight to `fontFamily`.**

Shared text props (`BaseTextProps` extends `TextProps` + `Spacing`): `customColor`, `center` (textAlign), `lineHeight: 'short' | 'tall'` (×1.05 / ×1.35), `letterSpacing: 'wide' | 'extraWide'` (0.7 / 1.2), `numberOfLines`, `onPress`, `animate` (Reanimated `Animated.Text`) + `animatedStyle`, `translate` (see §8), `padding`, `margin`, `style`.

**Project pattern (from the example app):** create thin wrappers `components/typography/{Body,Title,Heading}.tsx` that call `BaseText` with `customColor={theme.typeface.primary}` and the defaults above, then use those wrappers everywhere. Do the same for buttons (`PrimaryButton`, `SecondaryButton` around `BaseButton`).

Use `useFontSizes()` when you need the numeric font size (e.g. to size an icon to match text).

---

## 6. Buttons

`BaseButton` (`ButtonProps` extends `BaseTextProps` minus `style`):

- `buttonSize`: `'small' | 'medium' | 'large' | 'wide' | 'auto'` (default `medium`). `wide` = 88% of the shorter dimension; `auto` = `100%` of container.
- `backgroundColor`: `string` **or `string[]`** → array renders an `AbsoluteLinearGradient` (`gradientStart`, `gradientEnd`, `gradientOpacities` apply).
- `customFontColor`, `fontSize`, `fontStyle` (default `Medium`), `textStyle`, `translate`.
- `borderColor` (default transparent), `borderWidth` (`BorderSize`, default `thin`), `borderRadius` (`RadiusSize` **or number**).
- `leftComponent` / `rightComponent` + `leftComponentGap` / `rightComponentGap`.
- `loading` → hides label, shows `ActivityIndicator`, disables press.
- `disabled`, `activeOpacity`, `alignSelf` (default `center`), `margin`, `padding`, `shadow` (`ShadowStylesProps`), `enableRapidPress` (bypass double‑tap protection), `onPress`.
- Children default to the string `'Submit'`.

Rules: always pass `children` text; use `buttonSize="wide"` for primary CTAs in modals; use `leftComponent`/`rightComponent` for icons instead of composing your own row.

---

## 7. Press surfaces

| Component           | Base                                 | Animation lib                | Use when                                           |
| ------------------- | ------------------------------------ | ---------------------------- | -------------------------------------------------- |
| `Press`             | `Animated.View` (Reanimated)         | Reanimated spring scale 0.95 | Wrapping icons, cards, any tappable                |
| `RNPress`           | RN `Animated.View`                   | RN `Animated.timing`         | Same, when Reanimated must be avoided in that tree |
| `PressableLayout`   | `AnimatedLayout`                     | Reanimated                   | Tappable **layout** — gets all `LayoutProps`       |
| `RNPressableLayout` | `Layout animatedType="react-native"` | RN Animated                  | Same, RN Animated                                  |

Shared press props: `onPress(e)`, `onLongPress(snapshot)` (receives a `GestureResponderNativeEventSnapshot`, **not** the event), `longPressDuration` (800ms), `activationDelay` (50ms), `activeOpacity` (0.9), `disabled` (opacity 0.5), `disableAnimation`, `disableDoubleTapProtection`, `minDoubleTapProtectionDuration` (750ms), `stopPropagation`, `preventDefault`, `persist`. `Press` additionally has `enableRapidPress` → swaps to a plain `TouchableOpacity`.

Behaviour to remember: a press is cancelled if the finger moves >10px; a second tap within 750ms is ignored unless `disableDoubleTapProtection`/`enableRapidPress`.

`TwoFingerLongPressGesture`, `SwipeGesture` (`direction: 'UP'|'DOWN'|'LEFT'|'RIGHT'`, `onActivation`), and `DragGesture` (`onDragStart`, `onDrag`, `onDragEnd`, `minDistance`, `enableContentScroll`, `disable`) wrap children in a `GestureDetector` from gesture‑handler. Pair `DragGesture` with `useDragAnimation()` (`onDragStart`, `onDrag({posX, posY, min/max})`, `dragAnimatedStyle`).

---

## 8. Providers — mount once at the app root

Order used by the example app: `GestureHandlerRootView` → `LocalizationProvider` → (your other providers) → children.

- **`LocalizationProvider`** `{ sourceLanguage, targetLanguage, translation({sourceLanguage,targetLanguage,text}) => Promise<string>, initialLanguagesRecord?, initialLanguagesRecordRetriever? }`. Enables `translate` on any text/button and `useTranslation({ text })`. Translations are cached in MMKV under `essentials-localization-<sourceLanguage>` keyed by SHA‑256 of the trimmed text; identical in‑flight requests are de‑duplicated; when source and target share the same 2‑letter prefix, text is returned untouched. `useLocalization()` returns the context or `null`.
- **`PortalProvider`** `{ unMountBufferTimeMS? (100), updateBufferTimeMS?, CustomPortalContext? }` renders portal items in an absolute‑fill `pointerEvents="box-none"` view after children. Use `usePortalComponent({ name, Component, disable?, CustomPortalContext? })` to mount/update/unmount an element automatically, or `usePortal()` for manual `mount(key, element)`, `update`, `unmount`.
- **`EventTrackerProvider`** `{ statusCheckFnRegistry, maxStoredEventTrackers?, defaultMaxInProgressTime?, defaultStatusCheckInterval? }` persists long‑running "events" in MMKV and polls a registered `StatusCheckFn` while `status === 'in_progress'`. `useEventTracker()` → `addEventTracker`, `removeEventTracker`, `deleteEvent`, `clearEvents`, `markEventsAsSeen`; `useTrackerEvents()` → `{ events, seen }`.
- **`createDataCollector({ DataCollectionContext, CollectedDataContext })`** → `{ Provider, useDataCollection, useCollectedData }` for multi‑step form/wizard data. `collectData({ key, value })` or `collectData(prev => next)`.

---

## 9. App setup checklist (do this when scaffolding)

1. Install peer deps (§1).
2. Load fonts under the `FontStyle` names the app will use:
   ```ts
   useFonts({
     Regular: require('./assets/fonts/X-Regular.ttf'),
     Medium: require('./assets/fonts/X-Medium.ttf'),
     SemiBold: require('./assets/fonts/X-SemiBold.ttf'),
     Bold: require('./assets/fonts/X-Bold.ttf'),
   });
   ```
   Only `fontStyle` values that are registered will render; unregistered names fall back to the system font.
3. Add a global type file so the injected globals type‑check:
   ```ts
   // @types/globals.d.ts
   type NonFalsy<T> = Exclude<T, 0 | '' | false | null>;
   declare module globalThis {
     var is: <T>(value: T) => NonFalsy<T> | undefined;
     var isDef: (value: unknown) => boolean;
     var errMsg: (error: unknown) => string;
   }
   ```
   Importing the package installs `globalThis.is`, `isDef`, `errMsg` and `Array.prototype.filterMap`. `is(x)` returns `x` if truthy else `undefined` — the example app uses `{is(cond) && <X/>}` for conditional JSX.
4. Create project wrappers: `components/typography/*` around `BaseText`, `components/buttons/Primary.button.tsx` / `Secondary.button.tsx` around `BaseButton`, and a `theme` object with `background`, `lightBackground`, `accent`, `typeface.{primary,secondary,tertiary}` (shape used by the example app; adapt as needed).
5. Root providers component: `GestureHandlerRootView` → `LocalizationProvider` → `StatusBar` → app.
6. Optionally call `checkRequiredDependencies()` at startup in dev to fail fast.

---

## 10. Hooks & utilities — prefer these over hand‑rolled versions

| Need                                          | Use                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Responsive dimensions that update on rotation | `useDeviceOrientation()` → `{ screenWidth, screenHeight, orientation, relativeX/Y/Short/Long, *Worklet, normalize, normalizeShort }`                                                                                                                                                                   |
| Numeric font sizes                            | `useFontSizes(fontScale?)`                                                                                                                                                                                                                                                                             |
| Measure a view                                | `useViewDimensions()` → `[layout, onLayout]`, or `ViewDimensionsInjector renderItem={(d) => ...}`                                                                                                                                                                                                      |
| Measure via ref/event                         | `await measureAsync(refOrEvent)`                                                                                                                                                                                                                                                                       |
| Paginated / infinite list                     | `useScrollableItems({ itemsFetchingFunction({limit, skip}), limit?, minFetchDuration?, fetchCooldown?, itemsFetchingFunctionArgs? })` → wire `onLayout`, `onItemsEndReached` → `onEndReached`, `onRefreshItems`, `items`, `loading`, `refreshingItems`, `updateListItem`, `removeListItem`, `setItems` |
| Debounce                                      | `useDebounce({ delayInMilliSecs, onTrigger, onPreTrigger?, onPostTrigger?, onDebounceInvocation? })` → `{ debounce, cancelDebounce }`                                                                                                                                                                  |
| Interval                                      | `useInterval({ intervalInMilliSecs, onTrigger, autoStart?, ... })` → `{ startInterval, stopInterval }`                                                                                                                                                                                                 |
| Timeout tied to deps                          | `useTimeout({ cb, ms }, deps)`                                                                                                                                                                                                                                                                         |
| Countdown                                     | `useTimer({ seconds, onTimerEnds, start })` → `{ minutes, seconds }`                                                                                                                                                                                                                                   |
| Keyboard events                               | `useKeyboardListeners({ listeners: { keyboardDidShow: e => ... }, keyboardHeightRef?, subscribeCondition? })`                                                                                                                                                                                          |
| Uncontrolled input value in a ref             | `useInputRef({ inputValidationFunction? })` → `[inputRef, onChangeText, inputValue, defaultInputValue]`                                                                                                                                                                                                |
| Fit image into bounds                         | `useImageSize({ image, maxWidth, maxHeight })`, `useImageSizes({ images, ... })`, `calculateSize(...)`                                                                                                                                                                                                 |
| Persisted value (MMKV)                        | `createStorageAccessors<T>(key)` → `{ store, retrieve, remove, use, useString, useNumber, useBoolean, useObject, useBuffer }`; keyed collections → `createStorageAccessorsDynamic<T>(baseKey)` (adds `retrieveAll`, `removeAll`, suffix args)                                                          |
| Timers as objects                             | `Scheduler.Timer(action, ms)`, `Scheduler.Schedule(action, ms)` (interval), `Scheduler.SequentialTimer(ms)` — all with `start()`/`stop()`                                                                                                                                                              |
| Async sleep                                   | `await wait(ms)`                                                                                                                                                                                                                                                                                       |
| Unique id                                     | `getSequantialRandomId(prefix?)`                                                                                                                                                                                                                                                                       |
| Map + drop falsy/nullish                      | `filterMap(arr, fn)` or `arr.filterMap(fn)`                                                                                                                                                                                                                                                            |
| String case                                   | `firstLetterCap`, `titleCase`, `camelCase`, `toTitleCase`, `toCamelCase`, `snakeToTitleCase`, `dashToTitleCase`, `snakeToCamelCase`, `dashToCamelCase`, `camelToUpperSnake`                                                                                                                            |
| Numbers / money / time                        | `kFormatter`, `centsToDollars`, `secondsToTime`, `getTodayInSeconds`, `_24hrsToDate`, `normalizeNumberArray`                                                                                                                                                                                           |
| Colour alpha suffix                           | `hexOpacity(30)` → `'4c'` (append to a hex colour)                                                                                                                                                                                                                                                     |
| Misc                                          | `toBase64`, `fromBase64`, `objToQueryStr`, `keepArrayUnique`, `deepCopy`, `strToNumPercentage`, `mergeStringRecords`, `mergeLanguagesRecords`, `LanguageCodes`, `LanguageCodesEnglishMappings`                                                                                                         |
| Shadows                                       | `shadowStyles({ shadowOpacity?, shadowRadius?, shadowColor?, shadowOffset? })` → spread into a style (includes Android `elevation`)                                                                                                                                                                    |
| Top z‑index                                   | `maxZIndex`                                                                                                                                                                                                                                                                                            |

---

## 11. Isolation / performance pattern ("Render Isolate")

When a parent holds fast‑changing state (scroll offset, gesture values, live data) and only a few descendants need it:

```tsx
// Owner
const isolateRef = useIsolateRef<{ offset: number; active: boolean }>();
useIsolateObservables({
  ref: isolateRef,
  observables: { offset, active },
  isObserving: true,
});

// Consumer (wrap so it only renders once the ref is populated)
<IsolateRefDependant ref={isolateRef}>
  <Consumer isolateRef={isolateRef} />
</IsolateRefDependant>;

// inside Consumer
const { observables } = isolateRef.current!.useObservation({
  offset: true,
  active: (v) => v === true,
});
```

`useObservation(subscribeTo?)` re‑renders the consumer only when a subscribed key changed (and, if a predicate is given, when the predicate returns true). `isolateRef.current.get(key)` reads without subscribing. Use this instead of prop‑drilling or context for hot values.

Related: `ComponentMounter` (mount/unmount with delays via `showComponent`/`setShowComponent` or a `ComponentMounterController` ref: `mountComponent`, `unMountComponent({duration?, onClose?})`, `hardUnMountComponent`), and the modal trio `ModalWrapper` (`useNativeModal`, `enableBackgroundContentPress`, `disableAndroidBackButton`, `onRequestClose`), `ModalBackgroundAnimated` (`onPress`, `animatedStyle`, `avoidStatusBar`), `ModalForegroundWrapper`.

---

## 12. Complete export list (only these exist)

**Layouts:** `Layout`, `RowLayout`, `ScreenLayout`, `AnimatedLayout`, `TouchableLayout`, `SeparatorLayout` (+ types `LayoutProps`, `ScreenLayoutProps`, `AnimatedLayoutProps`, `TouchableLayoutProps`, `SeparatorLayoutProps`).

**Typography:** `BaseText`, `Title`, `Body`, `Heading`, `TranslateText`, `LocalizationComponent`, `TranslationComponent` (+ `BaseTextProps`, `FontStyle`, `FontSize`, `LineHeight`, `LetterSpacing`, `TranslateTextProps`, `LocalizationComponentProps`, `TranslationComponentProps`).

**Buttons:** `BaseButton` (+ `ButtonProps`, `ButtonSize`, `BorderSize`, `RadiusSize`).

**Wrappers:** `Press`, `RNPress`, `PressableLayout`, `RNPressableLayout`, `TextStream`, `ModalWrapper`, `ModalBackgroundAnimated`, `ModalForegroundWrapper`, `IsolateRefDependant` (+ `PressProps`, `RNPressProps`, `PressableLayoutProps`, `RNPressableLayoutProps`, `TextStreamProps`, `TextStreamRef`, `ModalWrapperProps`, `ModalBackgroundAnimatedProps`).

**Inputs:** `BaseInput`, `StateTextInput` (+ `BaseInputProps`, `StateInputProps`, `StateInputRef`).

**Indicators / injectors / utilities / icons:** `LoadingIndicator`, `SkeletonViewIndicator`, `ViewDimensionsInjector`, `ComponentMounter`, `RadioIcon` (+ `LoadingIndicatorProps`, `SkeletonLoadingIndicatorProps`, `ViewDimensionsInjectorProps`, `ComponentMounterProps`, `ComponentMounterController`, `ComponentMounterRef`, `MountComponentProps`, `UnMountComponentProps`).

**Providers:** `LocalizationProvider`, `LocalizationContext`, `useLocalization`, `PortalProvider`, `PortalContext`, `usePortal`, `usePortalComponent`, `EventTrackerProvider`, `EventTrackersContext`, `TrackerEventsContext`, `useEventTracker`, `useTrackerEvents`, `eventsStorage`, `seenEventsStorage`, `unSeenEventsStorage`, `DataCollectionProvider`, `createDataCollector`, `useDataCollection`, `useCollectedData` (+ their prop/context types).

**Hooks:** `useDeviceOrientation`, `useFontSizes`, `useViewDimensions`, `useImageSize`, `useImageSizes`, `calculateSize`, `useInputRef`, `useKeyboardListeners`, `useScrollableItems`, `useTimer`, `useDebounce`, `useInterval`, `useTimeout`, `useTranslation`, `useAnimatedStringValue`, `useIsolateObservables`, `useIsolateRef`.

**Gestures:** `DragGesture`, `SwipeGesture`, `TwoFingerLongPressGesture`.

**Animations:** `useDragAnimation`, `ArcSpinnerAnimation`, `AnimateComponent`, `AnimateValueComponent`, `AnimateXYValueComponent`, `AnimateStringValueComponent`, `AnimateSVGPathValueComponent`, `AnimateSVGPathValuesComponent`, `AnimatedPath` (+ types).

**SVGs:** `AbsoluteLinearGradient`, `LinearGradient`.

**Styles:** `shadowStyles`, `spacerStyles`, `transformSpacing`, `maxZIndex` (+ `ShadowStylesProps`, `Spaces`, `Spacing`, `Spacer`, `SpaceType`).

**Utils:** `relativeX`, `relativeY`, `relativeShort`, `relativeLong`, `normalize`, `normalizeShort`, `scale`, `relativeXWorklet`, `relativeYWorklet`, `relativeShortWorklet`, `relativeLongWorklet`, `fontSizes`, `borderSizes`, `radiusSizes`, `buttonSizes`, `filterMap`, `advancedMap`, `measureAsync`, `getSequantialRandomId`, `Scheduler` (namespace: `Schedule`, `Timer`, `SequentialTimer`), `wait`, `snapShotGestureResponderEvent`, `createStorageAccessors`, `createStorageAccessorsDynamic`, `storageAccessorsInstance`, `storageAccessorsInstanceID`, `LanguageCodes`, `LanguageCodesEnglishMappings`, `mergeStringRecords`, `mergeLanguagesRecords`, `checkDependency`, `checkRequiredDependencies`, `createDependencyError`, `strToNumPercentage`, `strToNumPercentageWorklet`.

**Algorithms:** `kFormatter`, `firstLetterCap`, `titleCase`, `camelCase`, `snakeToTitleCase`, `dashToTitleCase`, `toTitleCase`, `snakeToCamelCase`, `dashToCamelCase`, `toCamelCase`, `camelToUpperSnake`, `centsToDollars`, `_24hrsToDate`, `getTodayInSeconds`, `toBase64`, `fromBase64`, `objToQueryStr`, `keepArrayUnique`, `deepCopy`, `hexOpacity`, `normalizeNumberArray`, `stringArrayToNormalizedNumberArray`, `secondsToTime`.

**Device constants:** `SCREEN_WIDTH`, `SCREEN_HEIGHT`, `WINDOW_WIDTH`, `WINDOW_HEIGHT`, `MAX_DIMENSION`, `MIN_DIMENSION`, `initialOrientation`, `aspectRatio`, `isSmallDevice`, `isLargeDevice`, `isIOS`, `isWeb`, `isTablet`, `isIpad`, `isAndroid`.

**Globals installed on import:** `is`, `isDef`, `errMsg`, `Array.prototype.filterMap`.

**Not exported (do not use):** `ArcCircle` (default export, not re‑exported — use `ArcSpinnerAnimation`), `useAnimatedValues`, `sha256`, `Array.prototype.advancedMap` (declared in types but not reliably installed — use the `advancedMap()` function).

---

## 13. Anti‑patterns (reject these in review)

```tsx
// ❌ raw primitives
<View style={{ flex: 1, backgroundColor: '#000' }}>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
<Text style={{ fontSize: 18, fontWeight: '600' }}>Hi</Text>
<TouchableOpacity style={{ padding: 12, borderRadius: 8 }}><Text>Save</Text></TouchableOpacity>

// ✅ package equivalents
<ScreenLayout safe backgroundColor="#000">
<RowLayout center spaceBetween margin={[2, 0, 0, 0]}>
<Title>Hi</Title>
<BaseButton buttonSize="medium" onPress={save}>Save</BaseButton>
```

```tsx
// ❌ pixel values
style={{ width: 300, height: 48, borderRadius: 12, paddingHorizontal: 16 }}
// ✅
width={80} height={6} borderRadius="medium" padding={[0, 4]}
// or in StyleSheet.create:
{ width: relativeX(80), height: relativeY(6), borderRadius: radiusSizes.medium, paddingHorizontal: relativeX(4) }
```

```tsx
// ❌ wrong centring assumption
<Layout centerX>  // this centres VERTICALLY in a column
// ✅ horizontal centring in a column
<Layout center>
// ✅ both
<Layout center centerX>
```

```tsx
// ❌ passing style to a Reanimated animated layout
<AnimatedLayout style={rStyle}>
// ✅
<AnimatedLayout animatedStyle={rStyle}>
```

```tsx
// ❌ numeric borderRadius on Layout (only tokens are accepted there)
<Layout borderRadius={12}>
// ✅
<Layout borderRadius="medium">   // BaseButton is the exception: it accepts a number
```

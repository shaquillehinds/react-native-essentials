# Changelog

## 1.15.0 (2026-09-18)

### Features

- **ComponentMounter:** new `keepMountedOnReopen` prop (default `false`). When `showComponent` turns `true` while the component is still mounted, for example a reopen inside the unmount delay, the pending unmount is cancelled and the component stays mounted. Without the prop the 1.14.0 behaviour is unchanged: `setShowComponent(false)` is called and the component hard-unmounts on the next change.

### Bug Fixes

- **ComponentMounter:** `onComponentShow` / `onComponentClose` and `mountDelayInMilliSeconds` / `unMountDelayInMilliSeconds` were captured at first render, so callbacks ran with stale closures and later delay changes were ignored. Timers and the imperative controller now read the latest props through refs, and callbacks run after the state update instead of inside a state updater. Controller signatures are unchanged and `hardUnMountComponent` still skips `onComponentClose`.
- **getSequantialRandomId:** ids generated in the same millisecond could collide, which made `PortalProvider.mount` skip the second component. A monotonic counter is appended to every id.
- **usePortalComponent:** `disable` turning `true` after mount now unmounts the portal item and clears the stored id, so a later re-enable mounts a fresh item. Previously the item stayed in the portal until the host unmounted.
- **bin/install-rules.js:** removed Log Location Injector `$lf(...)` artifacts from the installer output.
- **Press:** a flick that crossed the 10 px move threshold and ended inside a descendant that calls `stopPropagation()` on touch end left the move-cancelled flag set, so the next tap on the `Press` was dropped. The flag is now cleared when a new (single-finger) touch starts.

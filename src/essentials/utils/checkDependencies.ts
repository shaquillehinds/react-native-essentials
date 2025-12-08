// src/essentials/utils/checkDependencies.ts
type DependencyCheck = {
  name: string;
  packageName: string;
  required: boolean;
};

const DEPENDENCIES: DependencyCheck[] = [
  {
    name: 'Reanimated',
    packageName: 'react-native-reanimated',
    required: true,
  },
  {
    name: 'Gesture Handler',
    packageName: 'react-native-gesture-handler',
    required: true,
  },
  {
    name: 'Safe Area Context',
    packageName: 'react-native-safe-area-context',
    required: true,
  },
  { name: 'MMKV', packageName: 'react-native-mmkv', required: false },
  { name: 'SVG', packageName: 'react-native-svg', required: true },
];

export function checkDependency(packageName: string): boolean {
  try {
    require(packageName);
    return true;
  } catch {
    return false;
  }
}

export type CheckRequiredDependenciesOptions = {
  dependencies?: DependencyCheck[];
};
export function checkRequiredDependencies(
  options?: CheckRequiredDependenciesOptions
): void {
  const missing = (options?.dependencies || DEPENDENCIES).filter(
    (dep) => dep.required && !checkDependency(dep.packageName)
  );

  if (missing.length > 0) {
    const packages = missing.map((d) => d.packageName).join(', ');
    const installCmd = `npx expo install ${packages}`;

    throw new Error(
      `@shaquillehinds/react-native-essentials is missing required peer dependencies:\n\n` +
        `Missing: ${missing.map((d) => d.name).join(', ')}\n\n` +
        `Please install them by running:\n${installCmd}\n\n` +
        `Or if not using Expo:\nnpm install ${packages}`
    );
  }
}

export function createDependencyError(
  featureName: string,
  packageName: string
): Error {
  return new Error(
    `${featureName} requires '${packageName}' to be installed.\n\n` +
      `Install it with:\nnpx expo install ${packageName}`
  );
}

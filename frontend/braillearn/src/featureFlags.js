export const featureFlags = {
    usingHardware: true,
};

export function isFeatureEnabled(flagName) {
    return !!featureFlags[flagName];
}
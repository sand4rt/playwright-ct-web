import { resolve } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { diff } from 'semver';

export async function analyzeCommits(pluginConfig, { cwd, lastRelease, logger }) {

    const { dependencyToMirror, pathToPackageJson } = pluginConfig;
    const absolutePathToPackageJson = resolve(cwd, pathToPackageJson);
    const packageJson = JSON.parse(readFileSync(absolutePathToPackageJson));
    const dependencyToMirrorVersion = packageJson.dependencies?.[dependencyToMirror];

    if (! dependencyToMirrorVersion) {
        throw new Error(`dependencyToMirror ${ dependencyToMirror } not found in ${ absolutePathToPackageJson }`);
    }

    const releaseType = diff(lastRelease.version, dependencyToMirrorVersion);

    const message = releaseType
        ? `${ dependencyToMirror } version changed from ${ lastRelease.version } to ${ dependencyToMirrorVersion } (${ releaseType })`
        : `${ dependencyToMirror } version did not change (${ dependencyToMirrorVersion })`;

    logger.log(message);

    return releaseType;
}

export async function prepare(pluginConfig, { cwd, nextRelease, logger }) {
    const { pathToPackageJson } = pluginConfig;
    const absolutePathToPackageJson = resolve(cwd, pathToPackageJson);
    const packageJson = JSON.parse(readFileSync(absolutePathToPackageJson));

    packageJson.version = nextRelease.version;
    writeFileSync(absolutePathToPackageJson, JSON.stringify(packageJson, null, 2));

    logger.log(`Updated ${ pathToPackageJson } version to ${ nextRelease.version }`);
}

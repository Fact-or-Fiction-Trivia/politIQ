// Runs the production build with any Node.js version.
// webpack 4 uses an OpenSSL hash (md4) that Node 17+ disables by default,
// so the legacy OpenSSL provider is enabled only when it is needed.
const { spawnSync } = require('child_process');

const major = Number(process.versions.node.split('.')[0]);
const env = { ...process.env };
// Create React App fails the build on lint warnings when CI=true; keep them as warnings.
env.CI = 'false';
if (major >= 17 && !/--openssl-legacy-provider/.test(env.NODE_OPTIONS || '')) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --openssl-legacy-provider`.trim();
}

const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env, shell: process.platform === 'win32' });
process.exit(result.status === null ? 1 : result.status);

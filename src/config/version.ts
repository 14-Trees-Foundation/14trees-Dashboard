import packageJson from '../../package.json';

export const VERSION = packageJson.version;

export const getVersionInfo = () => {
  return {
    version: VERSION,
    buildDate: new Date().toLocaleDateString(),
  };
};
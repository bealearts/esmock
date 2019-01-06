import { dirname, resolve as resolvePath } from 'path';
import callsites from 'callsites';

const mocks = new Map();

let resolver;

export default async function esmock(specifier) {
  if (!resolver) {
    throw new Error('Must be run using the esmock command');
  }
  const url = resolveMockUrl(specifier);
  const mockUrl = url.includes('?') ? `${url}&esmock` : `${url}?esmock`;
  const mod = await import(mockUrl);

  const mock = {};
  Object.keys(mod).forEach(
    key => mock[key] = mod[key]
  );
  mocks.set(url, mock);
  return mock;
}


export async function resolve(specifier, parentModuleUrl, defaultResolver) {
  console.log('Loader:', 'resolve');
  resolver = defaultResolver;
  const { url, format } = await defaultResolver(specifier, parentModuleUrl);

  return {
    url,
    format: (mocks.has(url) || specifier === '../src/esmock') && format === 'esm' ? 'dynamic' : format
  };
}


export async function dynamicInstantiate(url) {
  console.log('Loader:', 'dynamicInstantiate');
  if (url === 'file:///Users/david/Projects/esmock/src/esmock.mjs') {
    return {
      exports: ['default'],
      execute: (exports) => {
        exports.default.set(esmock);
      }
    }
  }

  const mod = mocks.get(url);

  return {
    exports: Object.keys(mod),
    execute: (exports) => {
      Object.keys(exports).forEach(
        key => exports[key].set(mod[key])
      )
    }
  };
}


function resolveMockUrl(specifier) {
  const sites = callsites();
  const filename = sites[2].getFileName();
  const folder = dirname(filename.replace('file://', ''));
  const path = resolvePath(folder, specifier);
  const { url } = resolver(path);

  return url;
}

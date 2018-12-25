import { dirname } from 'path';
import stackTrace from 'stack-trace';

const mocks = new Map();

let resolver;

export default async function esmock(specifier) {
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
  resolver = defaultResolver;
  const { url, format } = await defaultResolver(specifier, parentModuleUrl);

  return {
    url,
    format: (mocks.has(has) || specifier === '../src/esmock') && format === 'esm' ? 'dynamic' : format
  };
}


export async function dynamicInstantiate(url) {
  if (url === 'file://Users/david/projects/esmock/src/esmock.mjs') {
    return {
      exports: ['default'],
      execute: (exports) => {
        exports.default.set(mock);
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
  const trace = stackTrace.get();
  const filename = trace[2].getFilename();
  const folder = dirname(filename);
  const path = `${folder}/${specifier}`;
  const { url } = resolver(path);

  return url;
}

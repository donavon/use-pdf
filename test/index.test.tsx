import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import * as reactPDFModule from '@react-pdf/renderer';

import { usePDF } from '../src';

// ------------------
// setup mocking
jest.mock('@react-pdf/renderer');

let count = 0;
let savedCreateObjectURL: any;
let savedRevokeObjectURL: any;
beforeEach(() => {
  count = 0;
  (reactPDFModule.pdf as any).mockClear();
  savedCreateObjectURL = global.URL.createObjectURL;
  global.URL.createObjectURL = jest.fn(() => {
    count = count + 1;
    return `blob:${count}`;
  });

  savedRevokeObjectURL = global.URL.revokeObjectURL;
  global.URL.revokeObjectURL = jest.fn(() => {});
});

afterEach(() => {
  global.URL.createObjectURL = savedCreateObjectURL;
  global.URL.revokeObjectURL = savedRevokeObjectURL;
  jest.restoreAllMocks();
});

const mockReactPDF = (fn: any = () => null) => {
  (reactPDFModule.pdf as any).mockImplementation(jest.fn(fn));
};
// end mocking setup
// ------------------

const document = <reactPDFModule.Document title="doc1" />;

const testSuccess = async () => {
  let resolve: (reason: any) => void;
  const promise = new Promise<any>((_resolve, _reject) => {
    resolve = _resolve;
  });
  const blob = new Blob();
  const mockPDF = (_doc: any) => ({
    toBlob: () => promise,
  });
  mockReactPDF(mockPDF);
  const { result, rerender, unmount } = renderHook(doc => usePDF(doc), {
    initialProps: document,
  });
  expect(result.current.loading).toBe(true);
  resolve!(blob);
  await act(() => promise);
  rerender(document);
  expect(result.current.loading).toBe(false);
  expect(result.current.blob).toBe(blob);
  expect(result.current.url).toBe('blob:1');
  return { result, unmount, rerender };
};

test('returns loading=true by default', async () => {
  const promise = Promise.resolve();
  const handleToBlob = jest.fn(() => promise);
  const mockPDF = (_doc: any) => ({
    toBlob: handleToBlob,
  });
  mockReactPDF(mockPDF);
  const { result } = renderHook(() => usePDF(document));
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(null);
  expect(result.current.blob).toBe(null);
  expect(result.current.url).toBe(null);
  expect(handleToBlob).toHaveBeenCalledTimes(1);
  await act(() => promise);
});

test('returns error if error', async () => {
  let reject: (reason: any) => void;
  const promise = new Promise<any>((_resolve, _reject) => {
    reject = _reject;
  });
  const handleToBlob = jest.fn(() => promise);
  const myError = new Error('boo');
  const mockPDF = (_doc: any) => ({
    toBlob: handleToBlob,
  });
  act(() => mockReactPDF(mockPDF));
  const { result, rerender } = renderHook(() => usePDF(document));
  reject!(myError);
  try {
    await act(() => promise);
  } catch {}
  rerender(document);
  expect(result.current.error).toBe(myError);
});

test('returns blob and url if success', async () => {
  await testSuccess();
});

test('revokes url on unmount', async () => {
  const { unmount } = await testSuccess();
  unmount();
  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:1');
});

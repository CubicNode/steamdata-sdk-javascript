import { afterAll, expect, test, vi } from 'vitest';
import { ImageModeration } from '~/enums/service-routes/index.js';
import { ServiceApiConfig } from '~/ServiceApiConfig.js';
import { ServiceCore } from '~/services/core.js';
import { sign } from '~/utils.js';

const mockedFetch = vi.fn(() => Promise.resolve({}));

vi.stubGlobal('fetch', mockedFetch);
afterAll(() => {
  vi.unstubAllGlobals();
});
vi.mock(import('~/utils.js'), async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    sign: vi.fn(() => 'authorization'),
  };
});

test('ServiceCore fetch', async () => {
  const config = new ServiceApiConfig({
    accessKeyId: 'accessKeyId',
    apiVersion: 'v1',
    gatewayUrl: 'https://example.com',
    instanceId: 'instanceId',
    region: 'ap-east-1',
    secretAccessKey: 'secretAccessKey',
    signatureVersion: 'sd1',
  });
  const service = new ServiceCore(config);
  expect(service['config']).toBe(config);
  const request = new Request(`https://example.com${ImageModeration.GET_IMAGE_SCORE}`);
  mockedFetch.mockClear();
  await service.fetch('service', request);
  expect(sign).toBeCalledTimes(1);
  expect(sign).toBeCalledWith(config, 'service', request.url, request.method, Array.from(request.headers.entries()), expect.any(Buffer));
  expect(mockedFetch).toBeCalledTimes(1);
  expect(mockedFetch).toBeCalledWith(expect.any(Request), { headers: [
    ...Array.from(request.headers.entries()),
    ['Authorization', 'authorization'],
  ] });
});

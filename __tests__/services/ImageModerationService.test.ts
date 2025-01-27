import { expect, expectTypeOf, test, vi } from 'vitest';
import { ServiceName } from '~/enums/index.js';
import { ServiceApiConfig } from '~/ServiceApiConfig.js';
import type { ServiceResponse } from '~/services/core.js';
import { ImageModerationService } from '~/services/ImageModerationService.js';

const config = new ServiceApiConfig({
  accessKeyId: 'accessKeyId',
  apiVersion: 'v1',
  gatewayUrl: 'https://example.com',
  instanceId: 'instanceId',
  region: 'ap-east-1',
  secretAccessKey: 'secretAccessKey',
  signatureVersion: 'sd1',
});

test('ImageModerationService getImageScore', async () => {
  const service = new ImageModerationService(config);
  const result: ServiceResponse<{ safe_score: number; unsafe_score: number }> = {
    message: 'success',
    code: 200,
    data: { safe_score: 0, unsafe_score: 0 },
  };
  const spy = vi.spyOn(service, 'fetch').mockResolvedValue({ json: () => Promise.resolve(result) } as Response);
  const response = await service.getImageScore(new File([], 'image.jpg'));
  await expect(response.json()).resolves.toBe(result);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(ServiceName.IMAGE_MODERATION, expect.any(Request));
  const request = spy.mock.calls[0][1] as Request;
  expect(request.method).toBe('POST');
  expect(request.headers.get('host')).toBe('example.com');
  expect(request.headers.get('accept')).toBe('application/json');
  expect(request.headers.get('x-sd-instance-id')).toBe(config.getInstanceId());
  expect(request.headers.get('x-sd-api-version')).toBe(config.getApiVersion());
  expect((await request.formData()).get('image')).toBeInstanceOf(File);
  expectTypeOf(response.json()).resolves.toEqualTypeOf(result);
});

test('ImageModerationService getImageScoreAsync', async () => {
  const service = new ImageModerationService(config);
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const result: ServiceResponse<{}> = { message: 'success', code: 200, data: {} };
  const spy = vi.spyOn(service, 'fetch').mockResolvedValue({ json: () => Promise.resolve(result) } as Response);
  const response = await service.getImageScoreAsync(new File([], 'image.jpg'), 'callbackUrl', 'markerId');
  await expect(response.json()).resolves.toBe(result);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(ServiceName.IMAGE_MODERATION, expect.any(Request));
  const request = spy.mock.calls[0][1] as Request;
  expect(request.method).toBe('POST');
  expect(request.headers.get('host')).toBe('example.com');
  expect(request.headers.get('accept')).toBe('application/json');
  expect(request.headers.get('x-sd-instance-id')).toBe(config.getInstanceId());
  expect(request.headers.get('x-sd-api-version')).toBe(config.getApiVersion());
  const formData = await request.formData();
  expect(formData.get('image')).toBeInstanceOf(File);
  expect(formData.get('marker_id')).toBe('markerId');
  expect(formData.get('callback_url')).toBe('callbackUrl');
  expectTypeOf(response.json()).resolves.toEqualTypeOf(result);
});

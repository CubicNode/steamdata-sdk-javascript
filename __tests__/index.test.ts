import { expect, test } from 'vitest';

test('import ServiceApiConfig', async () => {
  const { ServiceApiConfig } = await import('~/index.js');
  expect(ServiceApiConfig).toBeDefined();
  expect(ServiceApiConfig).toBe((await import('~/ServiceApiConfig.js')).ServiceApiConfig);
});

test('import InvalidArgumentError', async () => {
  const { InvalidArgumentError } = await import('~/index.js');
  expect(InvalidArgumentError).toBeDefined();
  expect(InvalidArgumentError).toBe((await import('~/errors/InvalidArgumentError.js')).InvalidArgumentError);
});

test('import ServiceCore', async () => {
  const { ServiceCore } = await import('~/index.js');
  expect(ServiceCore).toBeDefined();
  expect(ServiceCore).toBe((await import('~/services/core.js')).ServiceCore);
});

test('import ImageModerationService', async () => {
  const { ImageModerationService } = await import('~/index.js');
  expect(ImageModerationService).toBeDefined();
  expect(ImageModerationService).toBe((await import('~/services/ImageModerationService.js')).ImageModerationService);
});

test('import IpInfoService', async () => {
  const { IpInfoService } = await import('~/index.js');
  expect(IpInfoService).toBeDefined();
  expect(IpInfoService).toBe((await import('~/services/IpInfoService.js')).IpInfoService);
});

test('import createSigningKey', async () => {
  const { createSigningKey } = await import('~/index.js');
  expect(createSigningKey).toBeDefined();
  expect(createSigningKey).toBe((await import('~/utils.js')).createSigningKey);
});

test('import sign', async () => {
  const { sign } = await import('~/index.js');
  expect(sign).toBeDefined();
  expect(sign).toBe((await import('~/utils.js')).sign);
});

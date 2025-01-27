import { expect, test } from 'vitest';

test('import enums', async () => {
  const enums = await import('~/enums/index.js');
  expect(enums.Algorithm).toBeDefined();
  expect(enums.ApiVersion).toBeDefined();
  expect(enums.HttpMethod).toBeDefined();
  expect(enums.Region).toBeDefined();
  expect(enums.ServiceName).toBeDefined();
  expect(enums.ServiceType).toBeDefined();
  expect(enums.SignatureVersion).toBeDefined();
});

test('import enums/service-routes', async () => {
  const enums = await import('~/enums/service-routes/index.js');
  expect(enums.ImageModeration).toBeDefined();
  expect(enums.IpInfo).toBeDefined();
});

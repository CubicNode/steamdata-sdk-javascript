import { expect, test } from 'vitest';
import { ApiVersion, Region, SignatureVersion } from '~/enums/index.js';
import { ServiceApiConfig, type ServiceApiConfigOptions } from '~/ServiceApiConfig.js';
import { faker } from '@faker-js/faker';

test.each([
  new ServiceApiConfig(),
  new ServiceApiConfig({}),
])('Create config void', (config) => {
  expect(config.getAccessKeyId()).toBe(null);
  expect(config.getApiVersion()).toBe(null);
  expect(config.getGatewayUrl()).toBe(null);
  expect(config.getInstanceId()).toBe(null);
  expect(config.getRegion()).toBe(null);
  expect(config.getSecretAccessKey()).toBe(null);
  expect(config.getSignatureVersion()).toBe(null);
});

test('Create config use options', () => {
  const testOptions: ServiceApiConfigOptions = {
    accessKeyId: faker.string.uuid(),
    apiVersion: ApiVersion.V1_0,
    gatewayUrl: faker.internet.url(),
    instanceId: faker.string.uuid(),
    region: Region.AP_EAST_1,
    secretAccessKey: faker.string.alphanumeric(64),
    signatureVersion: SignatureVersion.SD1,
  };

  expect(new ServiceApiConfig({ accessKeyId: testOptions.accessKeyId }).getAccessKeyId()).toBe(testOptions.accessKeyId);
  expect(new ServiceApiConfig({ apiVersion: testOptions.apiVersion }).getApiVersion()).toBe(testOptions.apiVersion);
  expect(new ServiceApiConfig({ gatewayUrl: testOptions.gatewayUrl }).getGatewayUrl()).toBe(testOptions.gatewayUrl);
  expect(new ServiceApiConfig({ instanceId: testOptions.instanceId }).getInstanceId()).toBe(testOptions.instanceId);
  expect(new ServiceApiConfig({ region: testOptions.region }).getRegion()).toBe(testOptions.region);
  expect(new ServiceApiConfig({ secretAccessKey: testOptions.secretAccessKey }).getSecretAccessKey()).toBe(testOptions.secretAccessKey);
  expect(new ServiceApiConfig({ signatureVersion: testOptions.signatureVersion }).getSignatureVersion()).toBe(testOptions.signatureVersion);
});

test('Set config', () => {
  const config = new ServiceApiConfig();
  const testOptions: ServiceApiConfigOptions = {
    accessKeyId: faker.string.uuid(),
    apiVersion: ApiVersion.V1_0,
    gatewayUrl: faker.internet.url(),
    instanceId: faker.string.uuid(),
    region: Region.AP_EAST_1,
    secretAccessKey: faker.string.alphanumeric(64),
    signatureVersion: SignatureVersion.SD1,
  };

  expect(config.setAccessKeyId(testOptions.accessKeyId)).toBe(config);
  expect(config.getAccessKeyId()).toBe(testOptions.accessKeyId);
  expect(config.setApiVersion(testOptions.apiVersion)).toBe(config);
  expect(config.getApiVersion()).toBe(testOptions.apiVersion);
  expect(config.setGatewayUrl(testOptions.gatewayUrl)).toBe(config);
  expect(config.getGatewayUrl()).toBe(testOptions.gatewayUrl);
  expect(config.setInstanceId(testOptions.instanceId)).toBe(config);
  expect(config.getInstanceId()).toBe(testOptions.instanceId);
  expect(config.setRegion(testOptions.region)).toBe(config);
  expect(config.getRegion()).toBe(testOptions.region);
  expect(config.setSecretAccessKey(testOptions.secretAccessKey)).toBe(config);
  expect(config.getSecretAccessKey()).toBe(testOptions.secretAccessKey);
  expect(config.setSignatureVersion(testOptions.signatureVersion)).toBe(config);
  expect(config.getSignatureVersion()).toBe(testOptions.signatureVersion);
});

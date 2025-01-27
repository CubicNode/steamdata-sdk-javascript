import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { ServiceName } from '~/enums/index.js';
import { ImageModeration, IpInfo } from '~/enums/service-routes/index.js';
import { InvalidArgumentError, ServiceApiConfig } from '~/index.js';
import { canonicalHeaders, canonicalHttpMethod, canonicalQueryString, canonicalUri, createHeaders, createSigningKey, encodeString, hashSha256, hmacSha256, hmacSha256Raw, sign } from '~/utils.js';

test('Hash Sha256', () => {
  expect(hashSha256('test')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
});

test('Hmac Sha256', () => {
  expect(hmacSha256Raw('key', 'data').toString('hex')).toBe('5031fe3d989c6d1537a013fa6e739da23463fdaec3b70137d828e36ace221bd0');
  expect(hmacSha256('key', 'data')).toBe('5031fe3d989c6d1537a013fa6e739da23463fdaec3b70137d828e36ace221bd0');
});

test.each([
  ['Normal', 'Normal'],
  ['With Space', 'With%20Space'],
  ['With Slash /', 'With%20Slash%20%2F'],
  ['With Colon :', 'With%20Colon%20%3A'],
  ['With Question ?', 'With%20Question%20%3F'],
  ['With Equal =', 'With%20Equal%20%3D'],
  ['With Ampersand &', 'With%20Ampersand%20%26'],
  ['With Percent %', 'With%20Percent%20%25'],
])('Encode string %s', (source, result) => {
  expect(encodeString(source)).toBe(result);
});

test.each([
  ['get', 'GET'],
  ['post', 'POST'],
  ['put', 'PUT'],
  ['patch', 'PATCH'],
  ['delete', 'DELETE'],
  ['head', 'HEAD'],
  ['options', 'OPTIONS'],
  ['Get', 'GET'],
  ['Post', 'POST'],
  ['Put', 'PUT'],
  ['Patch', 'PATCH'],
  ['Delete', 'DELETE'],
  ['Head', 'HEAD'],
  ['Options', 'OPTIONS'],
  ['GET', 'GET'],
  ['POST', 'POST'],
  ['PUT', 'PUT'],
  ['PATCH', 'PATCH'],
  ['DELETE', 'DELETE'],
  ['HEAD', 'HEAD'],
  ['OPTIONS', 'OPTIONS'],
])('Canonical http method "%s"', (source, result) => {
  expect(canonicalHttpMethod(source)).toBe(result);
});
test('Canonical invalid HTTP method', () => {
  expect(() => canonicalHttpMethod('invalid')).toThrowError(new InvalidArgumentError('Invalid HTTP method'));
});

test.each([
  ['/path', '/path'],
  ['/path/', '/path/'],
  ['/api/v1/example=example', '/api/v1/example%3Dexample'],
  ['/path/with space', '/path/with%20space'],
  ['/path/with%20percent', '/path/with%2520percent'],
  ['/path/with%2520percent', '/path/with%252520percent'],
])('Canonical uri "%s"', (source, result) => {
  expect(canonicalUri(source)).toBe(result);
});

test.each([
  ['name=value&name2=value2', 'name=value&name2=value2'],
  ['?name=value&name2=value2', 'name=value&name2=value2'],
  ['name=!value&name|2=value2', 'name=%21value&name%7C2=value2'],
  ['?name=!value&name|2=value2', 'name=%21value&name%7C2=value2'],
  ['', ''],
  ['?', ''],
])('Canonical query string "%s"', (source, result) => {
  expect(canonicalQueryString(source)).toBe(result);
});

test.each([
  [
    [
      ['host', 'example.com'],
      ['x-sd-datetime', '2021-01-01T00:00:00Z'],
      ['x-sd-instance-id', 'instance-id'],
      ['x-sd-api-version', 'v1'],
    ] as [string, string][],
    'host:example.com\nx-sd-api-version:v1\nx-sd-datetime:2021-01-01T00:00:00Z\nx-sd-instance-id:instance-id',
  ],
  [
    [
      [':authority', 'example.com'],
      ['x-sd-datetime', '2021-01-01T00:00:00Z'],
      ['x-sd-instance-id', 'instance-id'],
      ['x-sd-api-version', 'v1'],
      ['x-sd-unknown', 'unknown'],
    ] as [string, string][],
    ':authority:example.com\nx-sd-api-version:v1\nx-sd-datetime:2021-01-01T00:00:00Z\nx-sd-instance-id:instance-id\nx-sd-unknown:unknown',
  ],
])('Canonical headers', (header, result) => {
  expect(canonicalHeaders(header)).toBe(result);
});
test('Canonical headers missing host', () => {
  expect(() => canonicalHeaders([
    ['x-sd-datetime', '2021-01-01T00:00:00Z'],
    ['x-sd-instance-id', 'instance-id'],
    ['x-sd-api-version', 'v1'],
  ])).toThrowError(new InvalidArgumentError('Missing necessary headers: host or :authority'));
});
test.each([
  [
    [
      ['host', 'example.com'],
      ['x-sd-datetime', '2021-01-01T00:00:00Z'],
      ['x-sd-instance-id', 'instance-id'],
    ] as [string, string][],
    ['x-sd-api-version'],
  ],
  [
    [
      ['host', 'example.com'],
      ['x-sd-datetime', '2021-01-01T00:00:00Z'],
      ['x-sd-api-version', 'v1'],
    ] as [string, string][],
    ['x-sd-instance-id'],
  ],
  [
    [
      ['host', 'example.com'],
    ] as [string, string][],
    ['x-sd-datetime', 'x-sd-instance-id', 'x-sd-api-version'],
  ],
])('Canonical headers missing headers', (header, result) => {
  expect(() => canonicalHeaders(header)).toThrowError(new InvalidArgumentError(`Missing necessary headers: ${result.join(', ')}`));
});

test('Create signing key', () => {
  const config = new ServiceApiConfig({
    accessKeyId: 'accessKeyId',
    apiVersion: 'v1',
    gatewayUrl: 'https://example.com',
    instanceId: 'instanceId',
    region: 'ap-east-1',
    secretAccessKey: 'secretAccessKey',
    signatureVersion: 'sd1',
  });
  expect(createSigningKey(config, '20210101', 'service').toString('hex')).toBe('1590984d6fce76e1ce50301fdafae94f16a52f8db490c6be2b3f7abef8879717');
});

describe('Create headers', () => {
  const originalDateNow = Date.now;

  beforeAll(() => {
    Date.now = vi.fn(() => new Date('2021-01-01T00:00:03Z').getTime());
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });

  test('Create headers with mocked Date.now', () => {
    const config = new ServiceApiConfig({
      accessKeyId: 'accessKeyId',
      apiVersion: 'v1',
      gatewayUrl: 'https://example.com',
      instanceId: 'instanceId',
      region: 'ap-east-1',
      secretAccessKey: 'secretAccessKey',
      signatureVersion: 'sd1',
    });
    expect(createHeaders(config)).toStrictEqual([
      ['x-sd-datetime', '20210101T000002Z'],
      ['x-sd-instance-id', 'instanceId'],
      ['x-sd-api-version', 'v1'],
    ]);
  });
});

describe('Create Authorization Header', () => {
  const config = new ServiceApiConfig({
    accessKeyId: 'accessKeyId',
    apiVersion: 'v1',
    gatewayUrl: 'https://example.com',
    instanceId: 'instanceId',
    region: 'ap-east-1',
    secretAccessKey: 'secretAccessKey',
    signatureVersion: 'sd1',
  });
  const headers = [
    ['host', 'example.com'],
    ['x-sd-datetime', '20210101T000000Z'],
    ['x-sd-instance-id', 'instanceId'],
    ['x-sd-api-version', 'v1'],
  ] as [string, string][];
  test.each([
    [ImageModeration.GET_IMAGE_SCORE, ServiceName.IMAGE_MODERATION, 'b0199704a79b87334e441a691c12891adf515eeca1a486d253a5037b21fe65a7'],
    [ImageModeration.GET_IMAGE_SCORE_ASYNC, ServiceName.IMAGE_MODERATION, 'd2be0772a6a74d5e85ed9ea46c3f3ef02f166107c573742de01de6efed9f431b'],
    [IpInfo.GET_IP_ASN, ServiceName.IP_INFO, '96241450ca66fe9048517a8453fd10a85f0d47c993116111c5f874f2c483d661'],
    [IpInfo.GET_IP_GEOLOCATION, ServiceName.IP_INFO, '23a5d604c82bc5f8e768cf404c40e0a700f5472c631aaeba817a741351d3f104'],
  ])('%s', (path, service, signature) => {
    const authorizationHeader = sign(config, service, `https://example.com${path}`, 'GET', headers, '');
    expect(authorizationHeader).toBe(`SD1-HMAC-SHA256 Credential=accessKeyId/20210101/${config.getRegion()}/${service}/${config.getSignatureVersion()}_request,SignedHeaders=host;x-sd-api-version;x-sd-datetime;x-sd-instance-id,Signature=${signature}`);
    expect(sign(config, service, `https://example.com${path}`, 'GET', headers.map(([key, value]) => [key.toUpperCase(), value]), '')).toBe(authorizationHeader);
    expect(sign(config, service, `https://example.com${path}`, 'GET', headers.map(([key, value]) => [key + ' ', value]), '')).toBe(authorizationHeader);
    expect(sign(config, service, `https://example.com${path}`, 'GET', headers.map(([key, value]) => [' ' + key, value]), '')).toBe(authorizationHeader);
  });
});

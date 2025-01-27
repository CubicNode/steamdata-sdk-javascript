import { expect, expectTypeOf, test, vi, type Mock } from 'vitest';
import { ServiceName } from '~/enums/index.js';
import { IpInfo } from '~/enums/service-routes/index.js';
import { ServiceApiConfig } from '~/ServiceApiConfig.js';
import type { ServiceResponse } from '~/services/core.js';
import { type IpAsnResult, type IpGeolocationResult, IpInfoService } from '~/services/IpInfoService.js';
import { createHeaders } from '~/utils.js';

vi.mock(import('~/utils.js'), async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    createHeaders: vi.fn(original.createHeaders),
  };
});

const config = new ServiceApiConfig({
  accessKeyId: 'accessKeyId',
  apiVersion: 'v1',
  gatewayUrl: 'https://example.com',
  instanceId: 'instanceId',
  region: 'ap-east-1',
  secretAccessKey: 'secretAccessKey',
  signatureVersion: 'sd1',
});

test('IpInfoService getIpGeolocation', async () => {
  const service = new IpInfoService(config);
  const result: ServiceResponse<IpGeolocationResult> = {
    message: 'success',
    code: 200,
    data: {
      ip: '1.1.1.1',
      network: null,
      country: null,
      province: null,
      city: null,
      latitude: null,
      longitude: null,
    },
  };
  (createHeaders as Mock).mockClear();
  const spy = vi.spyOn(service, 'fetch').mockResolvedValue({ json: () => Promise.resolve(result) } as Response);
  const response = await service.getIpGeolocation(result.data.ip, 'zh_CN');
  await expect(response.json()).resolves.toBe(result);
  expect(createHeaders).toBeCalledTimes(1);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(ServiceName.IP_INFO, expect.any(Request));
  const request = spy.mock.calls[0][1] as Request;
  expect(request.method).toBe('GET');
  expect(request.headers.get('host')).toBe('example.com');
  expect(request.headers.get('accept')).toBe('application/json');
  expect(request.headers.get('content-type')).toBe('application/json');
  expect(request.headers.get('x-sd-instance-id')).toBe(config.getInstanceId());
  expect(request.headers.get('x-sd-api-version')).toBe(config.getApiVersion());
  const url = new URL(request.url);
  expect(url.pathname).toBe(IpInfo.GET_IP_GEOLOCATION);
  expect(url.searchParams.get('ip')).toBe(result.data.ip);
  expect(url.searchParams.get('language')).toBe('zh_CN');
  expectTypeOf(response.json()).resolves.toEqualTypeOf(result);
});

test('IpInfoService getIpGeolocation without language', async () => {
  const service = new IpInfoService(config);
  const result: ServiceResponse<IpGeolocationResult> = {
    message: 'success',
    code: 200,
    data: {
      ip: '1.1.1.1',
      network: null,
      country: null,
      province: null,
      city: null,
      latitude: null,
      longitude: null,
    },
  };
  (createHeaders as Mock).mockClear();
  const spy = vi.spyOn(service, 'fetch').mockResolvedValue({ json: () => Promise.resolve(result) } as Response);
  const response = await service.getIpGeolocation(result.data.ip);
  await expect(response.json()).resolves.toBe(result);
  expect(createHeaders).toBeCalledTimes(1);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(ServiceName.IP_INFO, expect.any(Request));
  const request = spy.mock.calls[0][1] as Request;
  expect(request.method).toBe('GET');
  expect(request.headers.get('host')).toBe('example.com');
  expect(request.headers.get('accept')).toBe('application/json');
  expect(request.headers.get('content-type')).toBe('application/json');
  expect(request.headers.get('x-sd-instance-id')).toBe(config.getInstanceId());
  expect(request.headers.get('x-sd-api-version')).toBe(config.getApiVersion());
  const url = new URL(request.url);
  expect(url.pathname).toBe(IpInfo.GET_IP_GEOLOCATION);
  expect(url.searchParams.get('ip')).toBe(result.data.ip);
  expect(url.searchParams.get('language')).toBeNull();
  expectTypeOf(response.json()).resolves.toEqualTypeOf(result);
});

test('IpInfoService getIpAsn', async () => {
  const service = new IpInfoService(config);
  const result: ServiceResponse<IpAsnResult> = {
    message: 'success',
    code: 200,
    data: {
      ip: '1.1.1.1',
      network: null,
      autonomous_system_number: null,
      autonomous_system_organization: null,
    },
  };
  (createHeaders as Mock).mockClear();
  const spy = vi.spyOn(service, 'fetch').mockResolvedValue({ json: () => Promise.resolve(result) } as Response);
  const response = await service.getIpAsn(result.data.ip, 'zh_CN');
  await expect(response.json()).resolves.toBe(result);
  expect(createHeaders).toBeCalledTimes(1);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(ServiceName.IP_INFO, expect.any(Request));
  const request = spy.mock.calls[0][1] as Request;
  expect(request.method).toBe('GET');
  expect(request.headers.get('host')).toBe('example.com');
  expect(request.headers.get('accept')).toBe('application/json');
  expect(request.headers.get('content-type')).toBe('application/json');
  expect(request.headers.get('x-sd-instance-id')).toBe(config.getInstanceId());
  expect(request.headers.get('x-sd-api-version')).toBe(config.getApiVersion());
  const url = new URL(request.url);
  expect(url.pathname).toBe(IpInfo.GET_IP_ASN);
  expect(url.searchParams.get('ip')).toBe(result.data.ip);
  expect(url.searchParams.get('language')).toBe('zh_CN');
  expectTypeOf(response.json()).resolves.toEqualTypeOf(result);
});

test('IpInfoService getIpAsn without language', async () => {
  const service = new IpInfoService(config);
  const result: ServiceResponse<IpAsnResult> = {
    message: 'success',
    code: 200,
    data: {
      ip: '1.1.1.1',
      network: null,
      autonomous_system_number: null,
      autonomous_system_organization: null,
    },
  };
  (createHeaders as Mock).mockClear();
  const spy = vi.spyOn(service, 'fetch').mockResolvedValue({ json: () => Promise.resolve(result) } as Response);
  const response = await service.getIpAsn(result.data.ip);
  await expect(response.json()).resolves.toBe(result);
  expect(createHeaders).toBeCalledTimes(1);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(ServiceName.IP_INFO, expect.any(Request));
  const request = spy.mock.calls[0][1] as Request;
  expect(request.method).toBe('GET');
  expect(request.headers.get('host')).toBe('example.com');
  expect(request.headers.get('accept')).toBe('application/json');
  expect(request.headers.get('content-type')).toBe('application/json');
  expect(request.headers.get('x-sd-instance-id')).toBe(config.getInstanceId());
  expect(request.headers.get('x-sd-api-version')).toBe(config.getApiVersion());
  const url = new URL(request.url);
  expect(url.pathname).toBe(IpInfo.GET_IP_ASN);
  expect(url.searchParams.get('ip')).toBe(result.data.ip);
  expect(url.searchParams.get('language')).toBeNull();
  expectTypeOf(response.json()).resolves.toEqualTypeOf(result);
});

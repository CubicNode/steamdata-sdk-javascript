import { IpInfo } from '../enums/service-routes/index.js';
import { ServiceCore, type ServiceResponse } from './core.js';
import { ServiceName } from '../enums/index.js';
import { createHeaders } from '../utils.js';

export interface IpGeolocationResult {
  ip: string;
  network: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface IpAsnResult {
  ip: string;
  network: string | null;
  autonomous_system_number: number | null;
  autonomous_system_organization: string | null;
}

export class IpInfoService extends ServiceCore {
  async getIpGeolocation (ip: string, language?: string) {
    const url = new URL(this.config.getGatewayUrl()!);
    url.pathname = IpInfo.GET_IP_GEOLOCATION;
    url.searchParams.append('ip', ip);
    if (language) {
      url.searchParams.append('language', language);
    }
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers([
        ['host', url.host],
        ['accept', 'application/json'],
        ['content-type', 'application/json'],
        ...createHeaders(this.config),
      ]),
    });
    const response = await this.fetch(ServiceName.IP_INFO, request);
    return response as Omit<Response, 'json'> & { json: () => Promise<ServiceResponse<IpGeolocationResult>> };
  }

  async getIpAsn (ip: string, language?: string) {
    const url = new URL(this.config.getGatewayUrl()!);
    url.pathname = IpInfo.GET_IP_ASN;
    url.searchParams.append('ip', ip);
    if (language) {
      url.searchParams.append('language', language);
    }
    const request = new Request(url, {
      method: 'GET',
      headers: new Headers([
        ['host', url.host],
        ['accept', 'application/json'],
        ['content-type', 'application/json'],
        ...createHeaders(this.config),
      ]),
    });
    const response = await this.fetch(ServiceName.IP_INFO, request);
    return response as Omit<Response, 'json'> & { json: () => Promise<ServiceResponse<IpAsnResult>> };
  }
}

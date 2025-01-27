import { type BinaryLike, createHash, createHmac } from 'crypto';
import { Algorithm, HttpMethod } from './enums/index.js';
import { InvalidArgumentError } from './errors/InvalidArgumentError.js';
import { ServiceApiConfig } from './ServiceApiConfig.js';

export function hashSha256 (message: BinaryLike): string {
  return createHash('sha256').update(message).digest('hex');
}
export function hmacSha256Raw (key: BinaryLike, message: BinaryLike) {
  return createHmac('sha256', key).update(message).digest();
}
export function hmacSha256 (key: BinaryLike, message: BinaryLike): string {
  return createHmac('sha256', key).update(message).digest('hex');
}
export function encodeString (str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
}

export function canonicalHttpMethod (method: string) {
  if (!Object.values(HttpMethod).map((value) => value.toLowerCase()).includes(method.toLowerCase())) {
    throw new InvalidArgumentError('Invalid HTTP method');
  }
  return method.toUpperCase();
}

export function canonicalUri (uri: string) {
  return uri.split('/').map((part) => encodeString(part)).join('/');
}

export function canonicalQueryString (query: string) {
  if (!query || query === '?') {
    return '';
  }
  return query.replace(/^\?/, '').split('&').map((part) => part.split('=').map(encodeString)).sort(([key1], [key2]) => key1.localeCompare(key2)).map(([key, value]) => `${key}=${value}`).join('&');
}

export function canonicalHeaders (headers: [string, string][]) {
  const headers_ = headers.map(([key, value]) => [key.trim().toLowerCase(), value.trim()] as [string, string]).sort(([key1], [key2]) => key1.localeCompare(key2));
  const optionalHeaders = ['host', ':authority'];
  if (!headers_.some(([key]) => optionalHeaders.includes(key))) {
    throw new InvalidArgumentError('Missing necessary headers: host or :authority');
  }
  const allRequiredHeaders = ['x-sd-datetime', 'x-sd-instance-id', 'x-sd-api-version'];
  const missingHeaders = allRequiredHeaders.filter((header) => !headers_.some(([key]) => key === header));
  if (missingHeaders.length) {
    throw new InvalidArgumentError(`Missing necessary headers: ${missingHeaders.join(', ')}`);
  }
  return headers_.map(([key, value]) => `${key}:${value}`).join('\n');
}

export function createHeaders (config: ServiceApiConfig) {
  return [
    /** 为了避免后端接口提示时间超前错误，创建的头的时间设置为当前时间的一秒前 */
    ['x-sd-datetime', new Date(Date.now() - 1000).toISOString().replace(/\.\d{3}Z$/, 'Z').replace(/[-:]/g, '')],
    ['x-sd-instance-id', config.getInstanceId()!],
    ['x-sd-api-version', config.getApiVersion()!],
  ] as [string, string][];
}

export function createSigningKey (config: ServiceApiConfig, date: string, serviceName: string) {
  const dateKey = hmacSha256Raw(`${config.getSignatureVersion()!.toUpperCase()}${config.getSecretAccessKey()}`, date);
  const regionKey = hmacSha256Raw(dateKey, config.getRegion()!);
  const serviceKey = hmacSha256Raw(regionKey, serviceName);
  return hmacSha256Raw(serviceKey, `${config.getSignatureVersion()}_request`);
}

export function sign (config: ServiceApiConfig, serviceName: string, url: string, method: string, headers: [string, string][], payload: BinaryLike) {
  const requestUrl = new URL(url);
  const formattedHeaderContent = canonicalHeaders(headers);
  const formattedHeaders = headers.map(([key, value]) => [key.trim().toLowerCase(), value.trim()] as [string, string]);
  const requestDateSource = formattedHeaders.find(([key]) => key === 'x-sd-datetime')![1];
  const signedHeaders = formattedHeaders.map(([key]) => key).sort((a, b) => a.localeCompare(b)).join(';');
  const requestDate = requestDateSource.slice(0, 8);
  const credentialScope = `${requestDate}/${config.getRegion()}/${serviceName}/${config.getSignatureVersion()}_request`;
  const signingKey = createSigningKey(config, requestDate, serviceName);
  const algorithm = Algorithm.SD1_HMAC_SHA256.toUpperCase();
  const canonicalRequest = [
    canonicalHttpMethod(method),
    canonicalUri(requestUrl.pathname),
    canonicalQueryString(requestUrl.search),
    formattedHeaderContent,
    signedHeaders,
    hashSha256(payload),
  ].join('\n');
  const stringToSign = [
    algorithm,
    requestDateSource,
    credentialScope,
    hashSha256(canonicalRequest),
  ].join('\n');
  const signature = hmacSha256(signingKey, stringToSign);
  return `${algorithm} Credential=${config.getAccessKeyId()}/${credentialScope},SignedHeaders=${signedHeaders},Signature=${signature}`;
}

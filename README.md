# Steamdata SDK for JavaScript

[![npm](https://img.shields.io/npm/v/cubicnode/steamdata-sdk-javascript)](https://www.npmjs.com/package/@cubicnode/steamdata-sdk-javascript)
[![license](https://img.shields.io/github/license/CubicNode/steamdata-sdk-javascript)](https://github.com/CubicNode/steamdata-sdk-javascript/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/CubicNode/steamdata-sdk-javascript/branch/master/graph/badge.svg?token=Uc9pEG6Yxt)](https://codecov.io/gh/CubicNode/steamdata-sdk-javascript)

这是适用于 JavaScript 的 Steamdata SDK，通过这个 SDK，您可以方便的在您的 Node 项目中使用 Steamdata 的 API。

本项目默认使用 fetch API，最低要求 Node 版本大于等于 20。

我们建议使用最新的 LTS 版本的 Node.js，以确保最佳的性能和兼容性。您可以在 [Node.js 官方网站](https://nodejs.org) 下载最新的 LTS 版本。


## 安装

```bash
npm install @cubicnode/steamdata-sdk-javascript
```

*您可以选择你喜欢的包管理器*


## 快速使用

```ts
import { ImageModerationService, ServiceApiConfig } from '@cubicnode/steamdata-sdk-javascript';
import { ApiVersion, Region, SignatureVersion } from '@cubicnode/steamdata-sdk-javascript/enums';
import { open } from 'fs/promises';

async function main() {
  /* 初始化配置 */
  const config = new ServiceApiConfig({
    gatewayUrl: 'https://api.steamdata.cloud.cubicnode.com',
    region: Region.AP_EAST_1,
    apiVersion: ApiVersion.V1_0,
    signatureVersion: SignatureVersion.SD1,
    accessKeyId: '<your-access-key-id>',
    secretAccessKey: '<your-secret-access-key>',
    instanceId: '<your-instance-id>',
  });
  /* 也可以这样设置 */
  config
    .setAccessKeyId('<your-access-key-id>')
    .setSecretAccessKey('<your-secret-access-key>')
    .setInstanceId('<your-instance-id>');

  /* 读取图片 */
  const imageBuffer = await open('./test.png').then(fileHandle => fileHandle.readFile());
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' });

  /* 创建服务实例 */
  const service = new ImageModerationService(config);
  /* 调用接口（使用fetch API） */
  const response = await service.getImageScoreAsync(image, 'https://example.com/callback', '0123456789');
  const result = await response.json();
  if (result.code === 0) {
    console.log(result.data);
  }
}
```

## 更多

如果现有的服务提供的API无法满足您的自定义需求，您可以使用更加原始的API

### 自行构造 Request

```ts
import { ServiceApiConfig, ServiceCore, type IpAsnResult, type ServiceResponse } from '@cubicnode/steamdata-sdk-javascript';
import { ApiVersion, Region, ServiceName, SignatureVersion } from '@cubicnode/steamdata-sdk-javascript/enums';
import { createHeaders } from '@cubicnode/steamdata-sdk-javascript/utils';

async function main() {
  /* 初始化配置 */
  const config = new ServiceApiConfig({
    gatewayUrl: 'https://api.steamdata.cloud.cubicnode.com',
    region: Region.AP_EAST_1,
    apiVersion: ApiVersion.V1_0,
    signatureVersion: SignatureVersion.SD1,
    accessKeyId: '<your-access-key-id>',
    secretAccessKey: '<your-secret-access-key>',
    instanceId: '<your-instance-id>',
  });

  /* 创建请求 */
  const url = new URL('https://api.steamdata.cloud.cubicnode.com/');
  url.pathname = '/service-api/ip-info/get-ip-geolocation';
  const request = new Request(url, {
    method: 'POST',
    headers: new Headers([
      /* 签名需要，必须设置 host 头 */
      ['host', url.host],
      ['accept', 'application/json'],
      ['content-type', 'application/json'],
      /* 生成其他必要头 */
      ...createHeaders(config),
    ]),
    body: JSON.stringify({
      ip: '8.8.8.8',
    }),
  });

  /* 使用 ServiceCore 发送请求时，会自动添加签名 */
  const service = new ServiceCore(config);
  const response = await service.fetch(ServiceName.IP_INFO, request);
  const result = await response.json() as ServiceResponse<IpAsnResult>;
  if (result.code === 0) {
    console.log(result.data);
  }
}
```

### 仅生成签名

```ts
import { ServiceApiConfig, sign } from '@cubicnode/steamdata-sdk-javascript';
import { ApiVersion, Region, ServiceName, SignatureVersion } from '@cubicnode/steamdata-sdk-javascript/enums';
import { createHeaders } from '@cubicnode/steamdata-sdk-javascript/utils';

async function main() {
  /* 初始化配置 */
  const config = new ServiceApiConfig({
    gatewayUrl: 'https://api.steamdata.cloud.cubicnode.com',
    region: Region.AP_EAST_1,
    apiVersion: ApiVersion.V1_0,
    signatureVersion: SignatureVersion.SD1,
    accessKeyId: '<your-access-key-id>',
    secretAccessKey: '<your-secret-access-key>',
    instanceId: '<your-instance-id>',
  });
  const url = new URL('https://api.steamdata.cloud.cubicnode.com/');
  url.pathname = '/service-api/ip-info/get-ip-geolocation';
  url.searchParams.append('ip', '8.8.8.8');
  const signature = sign(
    config,
    ServiceName.IP_INFO,
    url.toString(),
    'GET',
    [
      /* 签名需要，必须设置 host 头 */
      ['host', url.host],
      ['accept', 'application/json'],
      ['content-type', 'application/json'],
      /* 生成其他必要头 */
      ...createHeaders(config),
    ],
    '',
  );
  console.log('signature:', signature);
}
```

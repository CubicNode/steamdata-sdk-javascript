import { describe, expect, test } from 'vitest';
import { ApiVersion, Region, SignatureVersion } from '~/enums/index.js';
import { ImageModerationService, IpInfoService, ServiceApiConfig } from '~/index.js';

describe.skipIf(!process.env.VITE_GATEWAY_URL)('Real env test', () => {
  test.skipIf(!process.env.VITE_IP_INFO_INSTANCE_ID)('Test getIpGeolocation', async () => {
    const config = new ServiceApiConfig({
      instanceId: process.env.VITE_IP_INFO_INSTANCE_ID,
      accessKeyId: process.env.VITE_ACCESS_KEY_ID,
      secretAccessKey: process.env.VITE_SECRET_ACCESS_KEY,
      apiVersion: ApiVersion.V1_0,
      gatewayUrl: process.env.VITE_GATEWAY_URL,
      signatureVersion: SignatureVersion.SD1,
      region: Region.AP_EAST_1,
    });
    const ipInfoService = new IpInfoService(config);
    const response = await ipInfoService.getIpGeolocation('8.8.8.8', 'zh_CN');
    const result = await response.json();
    expect(result.data.country).toBe('美国');
  });

  test.skipIf(!process.env.VITE_IP_INFO_INSTANCE_ID)('Test getIpAsn', async () => {
    const config = new ServiceApiConfig({
      instanceId: process.env.VITE_IP_INFO_INSTANCE_ID,
      accessKeyId: process.env.VITE_ACCESS_KEY_ID,
      secretAccessKey: process.env.VITE_SECRET_ACCESS_KEY,
      apiVersion: ApiVersion.V1_0,
      gatewayUrl: process.env.VITE_GATEWAY_URL,
      signatureVersion: SignatureVersion.SD1,
      region: Region.AP_EAST_1,
    });
    const ipInfoService = new IpInfoService(config);
    const response = await ipInfoService.getIpAsn('8.8.8.8');
    const result = await response.json();
    expect(result.data.autonomous_system_organization).toBe('GOOGLE');
  });

  test.skipIf(!process.env.VITE_IMAGE_MODERATION_INSTANCE_ID)('Test getImageScore', async () => {
    const config = new ServiceApiConfig({
      instanceId: process.env.VITE_IMAGE_MODERATION_INSTANCE_ID,
      accessKeyId: process.env.VITE_ACCESS_KEY_ID,
      secretAccessKey: process.env.VITE_SECRET_ACCESS_KEY,
      apiVersion: ApiVersion.V1_0,
      gatewayUrl: process.env.VITE_GATEWAY_URL,
      signatureVersion: SignatureVersion.SD1,
      region: Region.AP_EAST_1,
    });
    const imageRequest = await fetch('https://picsum.photos/seed/picsum/200/300');
    const image = await imageRequest.blob();
    const imageModerationService = new ImageModerationService(config);
    const response = await imageModerationService.getImageScore(new File([image], 'image.jpg', { type: 'image/jpeg' }));
    const result = await response.json();
    expect(result.data.safe_score).toBeGreaterThan(0);
    expect(result.data.unsafe_score).toBeGreaterThan(0);
  });
});

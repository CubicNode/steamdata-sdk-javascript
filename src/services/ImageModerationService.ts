import { ImageModeration } from '../enums/service-routes/index.js';
import { ServiceCore, type ServiceResponse } from './core.js';
import { ServiceName } from '../enums/index.js';
import { createHeaders } from '../utils.js';

export interface ImageScoreResult {
  safe_score: number;
  unsafe_score: number;
}

export class ImageModerationService extends ServiceCore {
  async getImageScore (image: File) {
    const url = new URL(this.config.getGatewayUrl()!);
    url.pathname = ImageModeration.GET_IMAGE_SCORE;
    const formData = new FormData();
    formData.append('image', image);
    const request = new Request(url, {
      method: 'POST',
      headers: new Headers([
        ['host', url.host],
        ['accept', 'application/json'],
        ...createHeaders(this.config),
      ]),
      body: formData,
    });
    const response = await this.fetch(ServiceName.IMAGE_MODERATION, request);
    return response as Omit<Response, 'json'> & { json: () => Promise<ServiceResponse<ImageScoreResult>> };
  }

  async getImageScoreAsync (image: File, callbackUrl: string, markerId: string) {
    const url = new URL(this.config.getGatewayUrl()!);
    url.pathname = ImageModeration.GET_IMAGE_SCORE_ASYNC;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('marker_id', markerId);
    formData.append('callback_url', callbackUrl);
    const request = new Request(url, {
      method: 'POST',
      headers: new Headers([
        ['host', url.host],
        ['accept', 'application/json'],
        ...createHeaders(this.config),
      ]),
      body: formData,
    });
    const response = await this.fetch(ServiceName.IMAGE_MODERATION, request);
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    return response as Omit<Response, 'json'> & { json: () => Promise<ServiceResponse<{}>> };
  }
}

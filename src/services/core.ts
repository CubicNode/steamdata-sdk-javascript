import { sign } from '../utils.js';
import { ServiceApiConfig } from '../ServiceApiConfig.js';

export interface ServiceResponse<T> {
  message: string;
  code: number;
  data: T;
}

export class ServiceCore {
  constructor (protected readonly config: ServiceApiConfig) {
  }

  async fetch (serviceName: string, request: Request): Promise<Response> {
    const authorization = sign(
      this.config,
      serviceName,
      request.url,
      request.method,
      Array.from(request.headers.entries()),
      Buffer.from(await request.clone().arrayBuffer()),
    );
    return fetch(request.clone(), {
      headers: [
        ...Array.from(request.headers.entries()),
        ['Authorization', authorization],
      ],
    });
  }
}

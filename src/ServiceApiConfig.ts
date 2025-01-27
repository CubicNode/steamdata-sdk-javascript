export interface ServiceApiConfigOptions {
  gatewayUrl: string;
  region: string;
  apiVersion: string;
  signatureVersion: string;
  accessKeyId: string;
  secretAccessKey: string;
  instanceId: string;
}

export class ServiceApiConfig {
  constructor (private readonly options: Partial<ServiceApiConfigOptions> = {}) {
  }

  getGatewayUrl () {
    return this.options?.gatewayUrl ?? null;
  }

  getRegion () {
    return this.options?.region ?? null;
  }

  getApiVersion () {
    return this.options?.apiVersion ?? null;
  }

  getSignatureVersion () {
    return this.options?.signatureVersion ?? null;
  }

  getAccessKeyId () {
    return this.options?.accessKeyId ?? null;
  }

  getSecretAccessKey () {
    return this.options?.secretAccessKey ?? null;
  }

  getInstanceId () {
    return this.options?.instanceId ?? null;
  }

  setGatewayUrl (gatewayUrl: string): this {
    this.options.gatewayUrl = gatewayUrl;
    return this;
  }

  setRegion (region: string): this {
    this.options.region = region;
    return this;
  }

  setApiVersion (apiVersion: string): this {
    this.options.apiVersion = apiVersion;
    return this;
  }

  setSignatureVersion (signatureVersion: string): this {
    this.options.signatureVersion = signatureVersion;
    return this;
  }

  setAccessKeyId (accessKeyId: string): this {
    this.options.accessKeyId = accessKeyId;
    return this;
  }

  setSecretAccessKey (secretAccessKey: string): this {
    this.options.secretAccessKey = secretAccessKey;
    return this;
  }

  setInstanceId (instanceId: string): this {
    this.options.instanceId = instanceId;
    return this;
  }
}

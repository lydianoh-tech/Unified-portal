export interface Customization {
    id: string;
    name: string;
    description: string;
    settings: Record<string, any>;
}

export interface IntegrationConfig {
    apiKey: string;
    endpoint: string;
    timeout: number;
    retries: number;
}
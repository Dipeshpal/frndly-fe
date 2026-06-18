export const SECRET_CATEGORIES = ['api_key', 'database', 'cloud', 'personal', 'other'] as const;
export type SecretCategory = typeof SECRET_CATEGORIES[number];

export const CATEGORY_LABELS: Record<SecretCategory, string> = {
  api_key: 'API Key',
  database: 'Database',
  cloud: 'Cloud',
  personal: 'Personal',
  other: 'Other',
};

export interface Secret {
  id: string;
  name: string;
  value: string;
  description: string | null;
  category: SecretCategory;
  folder: string;
  created_at: string;
  updated_at: string;
}

export interface FolderInfo {
  name: string;
  count: number;
}

export interface CreateSecretInput {
  name: string;
  value: string;
  description?: string;
  category: SecretCategory;
  folder: string;
}

export type UpdateSecretInput = Partial<CreateSecretInput>;

export const QueryKeys = {
  me: ['auth', 'me'] as const,
  clipboard: (page?: number, search?: string) => ['clipboard', { page, search }] as const,
  secrets: (search?: string, category?: string) => ['secrets', { search, category }] as const,
  secret: (id: string) => ['secrets', id] as const,
} as const;

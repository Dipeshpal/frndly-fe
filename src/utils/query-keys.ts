export const QueryKeys = {
  me: ['auth', 'me'] as const,
  clipboard: (page?: number, search?: string) => ['clipboard', { page, search }] as const,
  secrets: (search?: string, category?: string, folder?: string) => ['secrets', { search, category, folder }] as const,
  secret: (id: string) => ['secrets', id] as const,
  notes: (page?: number, search?: string, tag?: string, folderId?: string | null, all?: boolean) => ['notes', { page, search, tag, folderId, all }] as const,
  note: (id: string) => ['notes', id] as const,
  folders: ['folders'] as const,
} as const;

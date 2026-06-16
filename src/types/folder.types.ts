export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFolderInput {
  name: string;
  parent_id?: string | null;
}

export type UpdateFolderInput = Partial<CreateFolderInput>;

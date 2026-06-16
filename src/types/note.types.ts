export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  folder_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content?: string;
  tags?: string[];
  is_pinned?: boolean;
  folder_id?: string | null;
}

export type UpdateNoteInput = Partial<CreateNoteInput>;

export interface NoteListResponse {
  items: Note[];
  total: number;
  page: number;
  per_page: number;
}

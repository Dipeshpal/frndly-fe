export interface ClipboardItem {
  id: string;
  content: string;
  device_name: string;
  created_at: string;
}

export interface CreateClipboardInput {
  content: string;
  device_name: string;
}

export interface ClipboardListResponse {
  items: ClipboardItem[];
  total: number;
  page: number;
  per_page: number;
}

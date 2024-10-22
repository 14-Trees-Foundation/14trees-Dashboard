
export type Tag = {
  key: number;
  id: number;
  tag: string;
  type: 'SYSTEM_DEFINED' | 'USER_DEFINED';
  created_at: string;
  updated_at: string;
};

export type CreateTagRequest = {
    type: 'SYSTEM_DEFINED' | 'USER_DEFINED';
    tag: string
}

export type TagsDataState = {
  totalTags: number,
  tags: Record<number, Tag>
}
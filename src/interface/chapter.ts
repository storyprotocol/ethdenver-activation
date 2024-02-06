export interface Chapter {
  id: number;
  content: string;
  story_id: number;
  parent_id: number;
  path: number[];
  sibling_count: number;
}

export interface Chapter {
  id: number;
  content: string;
  story_id: number;
  parent_id: number;
  wallet_address: string;
  path: number[];
  child_count: number;
}

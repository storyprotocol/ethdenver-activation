export interface ChapterRelationship {
  id: number;
  story_id: number;
  parent_id: number;
  wallet_address: string;
  content: string;
}

export interface ChapterRelationshipResponse {
  chapters: ChapterRelationship[];
}

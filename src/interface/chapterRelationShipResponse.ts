export interface ChapterRelationship {
  id: string;
  story_id: string;
  parent_id: string;
  wallet_address: string;
  content: string;
}

export interface ChapterRelationshipResponse {
  chapters: ChapterRelationship[];
}

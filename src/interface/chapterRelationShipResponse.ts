export interface ChapterRelationship {
  id: number;
  story_id: number;
  parent_id: number;
}

export interface ChapterRelationshipResponse {
  chapters: ChapterRelationship[];
}

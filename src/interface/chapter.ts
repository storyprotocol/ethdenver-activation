import { ChapterMO } from "@/app/api/model";
import exp from "constants";

export interface Chapter {
  id: number;
  content: string;
  story_id: number;
  parent_id: number;
  wallet_address: string;
  path: number[];
  child_count: number;
}

export function toChapter(chapter: ChapterMO): Chapter {
  return {
    id: chapter.id,
    content: chapter.content,
    story_id: chapter.story_id,
    parent_id: chapter.parent_id,
    wallet_address: chapter.wallet_address,
    path: chapter.path,
  } as Chapter;
}

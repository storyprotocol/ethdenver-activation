import { Chapter } from "@/interface/chapter";

export interface CreateChapterRequest {
  story_id: number;
  parent_id: number;
  is_anonymous: boolean;
  wallet_address?: string;
  content: string;
}

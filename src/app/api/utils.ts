function GetEnv(name: string) {
  return process.env[name] || "";
}

let EnvKey = {
  ChapterRandomMinCount: "API_CHAPTER_RANDOM_MIN_COUNT",
  ChapterRandomMaxCount: "API_CHAPTER_RANDOM_MAX_COUNT",
  ChapterUpWithSelfMaxDepth: "API_CHAPTER_UP_WITH_SELF_MAX_DEPTH",

  ChapterRelationshipMaxlimit: "API_CHAPTER_RELATIONSHIP_MAX_LIMIT",
};

export { EnvKey, GetEnv };

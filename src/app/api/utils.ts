function GetEnv(name: string) {
  return process.env[name] || "";
}

const EnvKey = {
  ChapterRandomMinCount: "API_CHAPTER_RANDOM_MIN_COUNT",
  ChapterRandomMaxCount: "API_CHAPTER_RANDOM_MAX_COUNT",
  ChapterRelationshipMaxLimit: "API_CHAPTER_RELATIONSHIP_MAX_LIMIT",
};

export { EnvKey, GetEnv };

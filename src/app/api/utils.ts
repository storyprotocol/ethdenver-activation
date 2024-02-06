function GetEnv(name: string) {
  return process.env[name] || "";
}

const EnvKey = {
  ChapterRandomMinCount: "API_CHAPTER_RANDOM_MIN_COUNT",
  ChapterRandomMaxCount: "API_CHAPTER_RANDOM_MAX_COUNT",
  ChapterUpWithSelfMaxDepth: "API_CHAPTER_UP_WITH_SELF_MAX_DEPTH",
  ChapterRelationshipMaxLimit: "API_CHAPTER_RELATIONSHIP_MAX_LIMIT",

  DefaultWalletAddress: "API_DEFAULT_WALLET_ADDRESS",
};

export { EnvKey, GetEnv };

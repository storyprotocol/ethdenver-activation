function GetEnv(name: string) {
  return process.env[name] || "";
}

let EnvKey = {
  ChapterRandomMinCount: "API_CHAPTER_RANDOM_MIN_COUNT",
  ChapterRandomMaxCount: "API_CHAPTER_RANDOM_MAX_COUNT",
};

export { EnvKey, GetEnv };

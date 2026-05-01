import axios from "axios";

const JUDGE0_TIMEOUT_MS = Number(process.env.JUDGE0_TIMEOUT_MS || 15000);
const JUDGE0_POLL_INTERVAL_MS = Number(process.env.JUDGE0_POLL_INTERVAL_MS || 1000);
const JUDGE0_MAX_POLL_ATTEMPTS = Number(process.env.JUDGE0_MAX_POLL_ATTEMPTS || 30);

const judge0Client = axios.create({
  baseURL: process.env.JUDGE0_API_URL,
  timeout: JUDGE0_TIMEOUT_MS,
});

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  if (!process.env.JUDGE0_API_URL) {
    throw new Error("JUDGE0_API_URL is not configured");
  }

  const { data } = await judge0Client.post(
    "/submissions/batch?base64_encoded=false",
    {
      submissions,
    },
  );

  console.log("Submission Result", data);
  return data; // [{tokens}, {tokens}, {tokens}]
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const pollBatchResults = async (tokens) => {
  if (!tokens.length) {
    throw new Error("No Judge0 submission tokens received");
  }

  for (let attempt = 1; attempt <= JUDGE0_MAX_POLL_ATTEMPTS; attempt++) {
    const { data } = await judge0Client.get(
      "/submissions/batch",
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      },
    );

    const results = data.submissions;

    const isAllDone = results.every(r => r.status.id !== 1 && r.status.id !== 2);

    if (isAllDone) {
      return results;
    }

    await sleep(JUDGE0_POLL_INTERVAL_MS);
  }

  throw new Error("Judge0 execution timed out");
};

export function getLanguageName (languageId) {
  const LANGUAGE_NAMES = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
    74: "TYPESCRIPT"
  }

  return LANGUAGE_NAMES[languageId] || "Unknown";
}

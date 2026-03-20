import { db } from "../libs/db.js";
import { getJudge0LanguageId } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  // going to all the data from request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    refererenceSolutions,
  } = req.body;
  // goint to check role of the user
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "You are not allowed to create a problem" });
  }
  // loop through each reference solution for different language
  try {
    for (const [language, solutionCode] of Object.entries(
      refererenceSolutions,
    )) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({
              error: `Testcases ${i + 1} failed for this language  ${language}`,
            });
        }
      }

      // sae the problem to the database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          refererenceSolutions,
          userId: req.user.id
        },
      });

      return res.status(201).json(newProblem);
    }
  } catch (error) {
    console.error("Error creating problem", error);
    return res.status(500).json({ error: "Error creating problem" });
  }
};
export const getAllProblems = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
export const getProblemsSolvedByUser = async (req, res) => {};

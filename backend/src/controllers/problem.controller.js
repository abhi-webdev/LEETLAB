import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

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
        console.log("Results: ", result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcases ${i + 1} failed for this language  ${language}`,
          });
        }
      }
      // save the problem to the database
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
          userId: req.user.id,
        },
      });
      return res.status(201).json({
        sucess : true,
        message : "Problem created successfully",
        newProblem
      });
     }
      
  } catch (error) {
    console.error("Error creating problem", error);
    return res.status(500).json({ error: "Error creating problem" });
  }
};
export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();
        if(!problems){
            return res.status(404).json({
                error : "No problem found"
            })
        }

        res.status(200).json({
            success : true,
            message : "All problems fetched successfully",
            problems
        })
    } catch (error) {
        console.error("Error creating problem", error);
    return res.status(500).json({ error: "Error featching problem" });
    }
};

export const getProblemById = async (req, res) => {
  const {id} = req.params;
  try {
    const problem = await db.problem.findUnique(
      {
        where : {
          id 
        },
      }
    )

    if(!problem){
        return res.status(404).json({
            error : "No problem found"
        })
    }

    res.status(200).json({
        success : true,
        message : "Problem fetched successfully",
        problem
    })
  } catch (error) {
    console.error("Error creating problem", error);
    return res.status(500).json({ error: "Error featching problem by id" });
  }
};

export const updateProblem = async (req, res) => {
  // const {id} = req.params;

};
export const deleteProblem = async (req, res) => {
  const {id} = req.params;
  try {
    const getProblem = await db.problem.findUnique({
      where : {
        id
      }
    })
  
    if(!getProblem){
      return res.status(404).json({
        error : "No problem found"
      })
    }
    
    await db.problem.delete({
      where : {
        id
      }
    })

    return res.status(200).json({
      success : true,
      message : "Problem deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting problem", error);
    return res.status(500).json({ error: "Error deleting problem by id" });
  }

};
export const getProblemsSolvedByUser = async (req, res) => {
  
};

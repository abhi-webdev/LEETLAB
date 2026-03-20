export const getAllSubmission = async(req, res) => {
    try {
        const userId = req.user.id;

        const submissions = await db.submission.findMany({
            where : {
                userId
            }
        });

        res.status(200).json({
            success: true,
            message : "Submission fetched successfully",
            submissions
        })
    } catch (error) {
        console.error("Error fetching submission", error);
        return res.status(500).json({ error: "Failed to fetch submission" });
    }
}
export const getSubmissionForProblem = async(req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;
        const submissions = await db.submission.findMany({
            where : {
                userId : userId,
                problemId: problemId
            }
        })

        res.status(200).json({
            success: true,
            message : "Submission fetched successfully",
            submissions
        })

    } catch (error) {
        console.error("Error fetching submission", error);
        return res.status(500).json({ error: "Failed to fetch submission" });
    }
}
export const getAllTheSubmissionsForProblem = async(req, res) => {
    try {
        const problemId = req.params.problemId;
        const submissions = await db.submission.count({
            where : {
                problemId: problemId
            }
        })

        res.status(200).json({
            success: true,
            message : "Submission fetched successfully",
            count : submissions
        })

    } catch (error) {
        console.error("Error fetching submission", error);
        return res.status(500).json({ error: "Failed to fetch submission" });
    }
}
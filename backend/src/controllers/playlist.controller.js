import {db} from "../libs/db.js"

export const createPlaylist = async(req, res) => {
    try {
        const {name, description} = req.body
        const userId = req.user.id

        if(!name?.trim()) {
            return res.status(400).json({ error: "Playlist name is required" });
        }

        const playlist = await db.playlist.create({
            data: {
                name: name.trim(), 
                description,
                userId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        })
    } catch (error) {
        console.error("Error creating playlist", error);
        if(error.code === "P2002") {
            return res.status(409).json({ error: "A playlist with this name already exists" });
        }
        return res.status(500).json({ error: "Error creating playlist" });
    }
}
export const getAllListDetails = async(req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where: {
                userId: req.user.id
            },
            include : {
                problems : {
                    include : {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlists
        })
    } catch (error) {
        console.error("Error fetching playlists", error);
        return res.status(500).json({ error: "Error fetching playlists" });
    }
}
export const getPlaylistDetails = async(req, res) => {
    try {
        const {playlistId} = req.params
        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
                userId : req.user.id
            },
            include : {
                problems : {
                    include : {
                        problem: true
                    }
                }
            }
        })

        if(!playlist) {
            return res.status(404).json({
                error: "Playlist not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlist
        })
    } catch (error) {
        console.error("Error fetching playlist", error);
        return res.status(500).json({ error: "Error fetching playlist" });
    }
}
export const addProblemToPlaylist = async(req, res) => {
    try {
        const {playlistId} = req.params
        const {problemIds} = req.body

        if(!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                error: "Invalid or missing problem ids"
            })
        }

        const playlist = await db.playlist.findFirst({
            where: {
                id: playlistId,
                userId: req.user.id
            }
        })

        if(!playlist) {
            return res.status(404).json({
                error: "Playlist not found"
            })
        }

        // create records for each problem in playlist
        const problemInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId
            })),
            skipDuplicates: true
        })

        res.status(201).json({
            success: true,
            message: problemInPlaylist.count > 0 ? "Problem added to playlist successfully" : "Problem is already in this playlist",
            problemInPlaylist
        })
    } catch (error) {
        console.error("Error adding problem to playlist", error);
        return res.status(500).json({ error: "Error adding problem to playlist" });
    }
}
export const deletePlaylist = async(req, res) => {
    const {playlistId} = req.params
    try {
        const deletePlaylist = await db.playlist.delete({
            where: {
                id: playlistId,
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            deletePlaylist
        })
    } catch (error) {
        console.log("Error deleting playlist", error);
        return res.status(500).json({ error: "Error deleting playlist" });
    }
}
export const removeProblemFromPlaylist = async(req, res) => {
    const {playlistId} = req.params
    const {problemIds} = req.body
    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                error: "Invalid or missing problem ids"
            })
        }

        const deletedProblem = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Problem removed from playlist successfully",
            deletedProblem
        })
    } catch (error) {
        console.log("Error removing problem from playlist", error);
        return res.status(500).json({ error: "Error removing problem from playlist" });
    } 
}

// The last middleware in the error middleware chain
module.exports = (error, req, res, next) => {
    console.error("Unexpected error occurred", error);
    res
        .status(500)
        .json({ error: "Unexpected error occurred, please try again later" });
}
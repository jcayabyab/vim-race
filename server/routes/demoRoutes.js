const router = require("express").Router();
const problemGenerator = require("../problem-generator/ProblemGenerator");
const Diff = require("diff");

router.get("/api/demo/problem", async (req, res) => {
  const { start, goal } = problemGenerator.generateProblem();
  const diff = Diff.diffChars(start.trim(), goal.trim());
  res.send({ startText: start, goalText: goal, diff });
});

module.exports = router;
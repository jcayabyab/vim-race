const fs = require("fs");
const path = require("path");

class ProblemGenerator {
  constructor(showDebug) {
    this.showDebug = showDebug;

    this.problems = [];

    this.readProblemsFromFiles();
  }

  debug(msg) {
    if (this.showDebug) {
      console.log(msg);
    }
  }

  readProblemsFromFiles() {
    // creates list of [start, goal] texts
    const filenames = this.getFilenames();
    for (const fn of filenames) {
      const rootPath = path.join(__dirname, "data");
      const startPath = path.join(rootPath, "infiles", fn);
      const goalPath = path.join(rootPath, "outfiles", fn);
      const startText = fs.readFileSync(startPath, { encoding: "utf-8" });
      const goalText = fs.readFileSync(goalPath, { encoding: "utf-8" });
      this.problems.push([startText, goalText]);
    }
  }

  getRandomProblem() {
    if (this.problems.length) {
      const idx = Math.floor(Math.random() * this.problems.length);
      const problem = this.problems[idx];

      this.debug(problem);

      return problem;
    }
    this.debug("No entries in VimGolf problem set");
    throw "No entries in VimGolf problem set";
  }

  // returns start and goal strings
  generateProblem() {
    const [start, goal] = this.getRandomProblem();
    return { start, goal };
  }

  // get names of text files of VimGolf problems
  getFilenames() {
    const filepath = path.join(__dirname, "data", "infiles");

    return fs.readdirSync(filepath);
  }
}

const problemGenerator = new ProblemGenerator();

module.exports = problemGenerator;

const fs = require("fs");
const path = require("path");
const tabToSpace = require("tab-to-space");

class ProblemGenerator {
  constructor(showDebug, dummyProblem = false) {
    this.showDebug = showDebug;
    this.lengthThreshold = 200;

    this.problems = [];

    if (!dummyProblem) {
      this.readProblemsFromFiles();
    } else {
      const startText = `Hello, universe!`;
      const goalText = `Hello, world!`;
      this.problems.push([startText, goalText]);
    }
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
      const startText = this.preprocessText(
        fs.readFileSync(startPath, { encoding: "utf-8" })
      );
      const goalText = this.preprocessText(
        fs.readFileSync(goalPath, { encoding: "utf-8" })
      );
      if (goalText.length < this.lengthThreshold)
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

  preprocessText(text) {
    text = this.replaceTabs(text);
    text = text.trim();
    text = text.replace("\r", "");
    return text;
  }

  replaceTabs(text) {
    return tabToSpace(text, 4);
  }
}

const showDummyProblem = process.env.NODE_ENV !== "production";

const problemGenerator = new ProblemGenerator(false, showDummyProblem);

module.exports = { problemGenerator, ProblemGenerator };

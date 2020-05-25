class StringGenerator {
  // returns start and goal strings
  generateGame() {
    const start = 'foo = a\n' +
                  '      ab\n' +
                  '      abc\n';
    const goal = 'foo = "a"\n' + 
                 '      "ab"\n' +
                 '      "abc"\n';

    return { start, goal };
  }
}

module.exports = StringGenerator;

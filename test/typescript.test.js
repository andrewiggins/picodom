// const fs = require("fs")
const path = require("path")
const ts = require("typescript")

// const readFile = filePath => new Promise((resolve, reject) =>
//   fs.readFile(filePath, "utf-8", (err, data) => err ? reject(err) : resolve(data))
// )

const compilerOptions = {
  "strict": true,
  "jsx": ts.JsxEmit.React,
  "jsxFactory": "h"
}

const formatDiagnostics = diagnostics => ts.formatDiagnostics(diagnostics, {
  getCurrentDirectory: () => process.cwd(),
  getCanonicalFileName: (fileName) => path.relative(process.cwd(), fileName),
  getNewLine: () => "\n"
})

// For each file, map line numbers to expected error codes
const expectedErrors = {
  "./typings/h-error.test.tsx": {
    1: 2304,
    2: 2304,
    3: 2304,
    6: 2345,
    7: 2345,
    11: 2345,
    16: 2322,
    17: 2322
  }
}

function runTest(fileName, expectedErrorCodes) {
  fileName = path.join(__dirname, fileName)
  // return readFile(fileName).then(data => {
  const program = ts.createProgram([fileName], compilerOptions)
  const fatalDiagnostics = [
    ...program.getGlobalDiagnostics(),
    ...program.getOptionsDiagnostics(),
    ...program.getSyntacticDiagnostics(),
  ];

  if (fatalDiagnostics.length) {
    fail("Unexpected fatal error compiling TypeScript:\n" + formatDiagnostics(fatalDiagnostics))
  }

  const testDiagnostics = [
    ...program.getSemanticDiagnostics(),
  ];

  fail("Unexpected error: " + formatDiagnostics([testDiagnostics[0]]))
  expect(testDiagnostics.length).toBe(expectedErrorCodes.length)

  for (let i = 0; i < expectedErrorCodes.length; i++) {
    if (expectedErrorCodes[i] !== testDiagnostics[i].code) {}
  }
  // })
}


// Investigate using transpileModule to compile individual strings.
// Perhaps specify files to test with their expected errors in each test case and use node fs module to read each file
// Also, don't bring in the extra complexity of reading tsconfig.json from file. Just specify global options 
// in this test file

test("typescript should compile with no errors", () => {
  return runTest("./typings/h.test.tsx", [])
})

test("typescript definitions throw expected errors", () => {})
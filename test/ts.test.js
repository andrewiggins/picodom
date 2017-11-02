const path = require("path")
const ts = require("typescript")

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

const tsOptions = loadConfigOptions(
  path.join(__dirname, "./typings/tsconfig.json")
)

// Should there be assertions per thing I want to test? Yes
// Investigate using transpileModule to compile individual strings.
// Perhaps specify files to test with their expected errors in each test case and use node fs module to read each file
// Also, don't bring in the extra complexity of reading tsconfig.json from file. Just specify global options 
// in this test file

test("typescript definitions compile correctly", () => {})

test("typescript definitions throw expected errors", () => {})

function loadConfigOptions(tsConfigPath) {
  const formattingHost = {
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => "\n",
    getCanonicalFileName: name => path.relative(process.cwd(), name)
  }

  const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  if (tsConfig.error) {
    let errorText = ts.formatDiagnostics([tsConfig.error], formattingHost)
    throw "Error parsing tsconfig.json.\n" + errorText
  }

  const result = ts.parseJsonConfigFileContent(
    tsConfig.config || {},
    ts.sys,
    path.resolve(path.dirname(tsConfigPath)),
    undefined,
    path.basename(tsConfigPath)
  )

  if (result.errors.length) {
    let errorText = ts.formatDiagnostics(result.errors, formattingHost)
    throw "Error parsing tsconfig.json.\n" + errorText
  }

  return result.options
}

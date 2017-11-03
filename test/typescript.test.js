const path = require("path")
const ts = require("typescript")

/**
 * Directions to update the tests in this file:
 * 1. Run `tsc -p ./typings/tsconfig.json` from the directory this file is in
 * 2. Fix any unexpected errors
 * 3. Copy the output of expected errors to the proper test for that file
 */

const compilerOptions = loadTsConfig("./typings/tsconfig.json").options

const formatDiagnostics = diagnostics =>
  ts.formatDiagnostics(diagnostics, {
    getCurrentDirectory: () => __dirname,
    getCanonicalFileName: fileName => path.relative(__dirname, fileName),
    getNewLine: () => "\n"
  })

function getActualDiagnostics(fileName) {
  fileName = path.join(__dirname, fileName)
  const program = ts.createProgram([fileName], compilerOptions)
  return formatDiagnostics([
    ...program.getGlobalDiagnostics(),
    ...program.getOptionsDiagnostics(),
    ...program.getSyntacticDiagnostics(),
    ...program.getSemanticDiagnostics()
  ]).trim()
}

function loadTsConfig(tsConfigPath) {
  tsConfigPath = path.join(__dirname, tsConfigPath)

  const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  if (tsConfig.error) {
    throw "Error parsing tsconfig.json.\n" + formatDiagnostics([tsConfig.error])
  }

  const result = ts.parseJsonConfigFileContent(
    tsConfig.config || {},
    ts.sys,
    path.resolve(path.dirname(tsConfigPath)),
    undefined,
    path.basename(tsConfigPath)
  )

  if (result.errors.length) {
    throw "Error parsing tsconfig.json.\n" + formatDiagnostics(result.errors)
  }

  return result
}

test("typescript should compile with no errors", () => {
  expect(getActualDiagnostics("./typings/h.test.tsx")).toBe("")
  expect(getActualDiagnostics("./typings/patch.test.tsx")).toBe("")
})

test("Improper usages of h and JSX should throw expected errors", () => {
  expect(getActualDiagnostics("./typings/h-error.test.tsx")).toEqual(
    `
typings/h-error.test.tsx(6,14): error TS2345: Argument of type 'true' is not assignable to parameter of type '(string | number | VNode<{}> | null)[] | undefined'.
typings/h-error.test.tsx(7,14): error TS2345: Argument of type 'false' is not assignable to parameter of type '(string | number | VNode<{}> | null)[] | undefined'.
typings/h-error.test.tsx(11,12): error TS2345: Argument of type '{ id: string; }' is not assignable to parameter of type 'TestProps | undefined'.
  Type '{ id: string; }' is not assignable to type 'TestProps'.
    Property 'class' is missing in type '{ id: string; }'.
typings/h-error.test.tsx(16,11): error TS2322: Type '{}' is not assignable to type 'TestProps'.
  Property 'id' is missing in type '{}'.
typings/h-error.test.tsx(17,20): error TS2322: Type '{ id: "foo"; }' is not assignable to type 'TestProps'.
  Property 'class' is missing in type '{ id: "foo"; }'.
  `.trim()
  )
})

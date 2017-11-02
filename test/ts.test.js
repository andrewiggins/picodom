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
    17: 2322,
  }
}

const tsOptions = loadConfigOptions(path.join(__dirname, "tsconfig.json"))

// Should there be assertions per thing I want to test? Investigate using transpileModule to compile individual strings

test("typescript definitions compile correctly", () => {
})

test("typescript definitions throw expected errors", () => {
})


function loadConfigOptions(tsConfigPath) {
  const tsConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  if (tsConfig.error) {
    throw getError(tsConfig.error)
  }

  const result = ts.parseJsonConfigFileContent(
    tsConfig.config || {},
    ts.sys,
    path.resolve(path.dirname(tsConfigPath)),
    undefined,
    path.basename(tsConfigPath)
  )

  for (const info of result.errors) {
    console.error(getError(info).message)
  }

  if (tsConfig.error || result.errors.length > 0) {
    throw new Error("Error parsing tsconfig.json. See log above for details")
  }

  return result.options
}

function getError(info) {
  const err = new Error()

  let filePreamble = ""
  if (info.file && info.start) {
    const startPos = ts.getLineAndCharacterOfPosition(info.file, info.start)

    filePreamble =
      path.relative(process.cwd(), info.file.fileName) +
      `(${startPos.line + 1},${startPos.character + 1}): `

    const endPos = ts.getLineAndCharacterOfPosition(
      info.file,
      info.start + info.length
    )

    err.startPosition = {
      position: info.start,
      line: startPos.line,
      character: startPos.character
    }

    err.endPosition = {
      position: info.start + info.length - 1,
      line: endPos.line,
      character: endPos.character
    }
  }

  const codeAndMessageText =
    filePreamble +
    ts.DiagnosticCategory[info.category].toLowerCase() +
    " TS" +
    info.code +
    ": " +
    ts.flattenDiagnosticMessageText(info.messageText, "\n")

  err.name = "TypeScript Error"
  err.message = codeAndMessageText
  err.diagnostic = info

  return err
}

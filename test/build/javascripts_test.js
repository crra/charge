import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createSourceFiles,
  createPackage,
  cleanFiles,
  snapshotFilesystem,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("bundles JavaScripts into a self-executing function", async (t) => {
  await createSourceFiles({
    "index.js": dedent`
      console.log("hey")
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("transpiles JavaScripts using Babel", async (t) => {
  await createSourceFiles({
    "index.js": dedent`
      console.log([1, ...[2]])
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("bundles imported JavaScript files via relative imports to current directory", async (t) => {
  await createSourceFiles({
    "foo.js": dedent`
      export default "bar"
    `,
    "index.js": dedent`
      import foo from  "./foo"

      console.log(foo)
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("bundles imported JavaScript files via relative imports to parent directory", async (t) => {
  await createSourceFiles({
    "foo.js": dedent`
      export default "bar"
    `,
    "folder/index.js": dedent`
      import foo from  "../foo"

      console.log(foo)
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("bundles imported npm packages", async (t) => {
  await createPackage("foo", {
    "index.js": dedent`
      export default "bar"
    `,
  })

  await createSourceFiles({
    "index.js": dedent`
      import foo from  "foo"

      console.log(foo)
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

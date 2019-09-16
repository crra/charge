import test from "ava"
import dedent from "dedent"
import { join as pathJoin } from "path"
import build from "../../lib/build"
import {
  createData,
  createSourceFiles,
  cleanFiles,
  dataDirectory,
  snapshotFilesystem,
  sourceDirectory,
  targetDirectory,
} from "../helpers/filesystem"

test.beforeEach((t) => cleanFiles())
test.after.always((t) => cleanFiles())

test("renders a JSX template as XML", async (t) => {
  await createSourceFiles({
    "feed.xml.jsx": dedent`
      export default () => {
        return <feed></feed>
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

test("loads data from data files and passes it to the JSX template", async (t) => {
  await createData({
    stuff: dedent`
      {
        "foo": "bar"
      }
    `,
  })

  await createSourceFiles({
    "feed.xml.jsx": dedent`
      export default (props) => {
        return <feed>{props.data.stuff.foo}</feed>
      }
    `,
  })

  await build({
    source: sourceDirectory,
    target: targetDirectory,
  })

  snapshotFilesystem(t)
})

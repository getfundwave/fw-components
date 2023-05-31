import { legacyPlugin } from "@web/dev-server-legacy";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { summaryReporter } from '@web/test-runner';

const mode = process.env.MODE || "dev";
if (!["dev", "prod"].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

const browsers = {
  chromium: playwrightLauncher({ product: "chromium" }),
  firefox: playwrightLauncher({ product: "firefox" }),
  webkit: playwrightLauncher({ product: "webkit" }),
};

const noBrowser = (b) => {
  throw new Error(`No browser configured named '${b}'; using defaults`);
};
let commandLineBrowsers;
try {
  commandLineBrowsers = process.env.BROWSERS?.split(",").map(
    (b) => browsers[b] ?? noBrowser(b)
  );
} catch (e) {
  console.warn(e);
}

const configObj = {
  rootDir: ".",
  files: ["./**/*test.js"],
  nodeResolve: { exportConditions: mode === "dev" ? ["development"] : [] },
  preserveSymlinks: true,
  browsers: commandLineBrowsers ?? Object.values(browsers),
  // reporters: [summaryReporter()],
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: "bdd",
      timeout: "2000",
    },
  },
  plugins: [legacyPlugin()],
};

export default configObj;

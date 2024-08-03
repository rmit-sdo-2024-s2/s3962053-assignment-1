const config = {
    testDir: "./tests/e2e",
    timeout: 30000,
    retries: 2,
    workers: 1,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
      headless: true,
      viewport: { width: 1280, height: 720 },
      actionTimeout: 0,
      ignoreHTTPSErrors: true,
    },
  };
  
  module.exports = config;
  
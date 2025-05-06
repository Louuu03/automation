module.exports = {
    apps: [
      {
        name: "automation-webhook",
        script: "start.mjs",
        interpreter: "node",
        cwd: "/var/www/automation",
        env: {
          NODE_ENV: "production",
          PORT: 4000
        }
      }
    ]
  };
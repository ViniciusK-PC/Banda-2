module.exports = {
  apps: [
    {
      name: "banda-api",
      script: "npm",
      args: "run start",
      cwd: "./api",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "banda-web",
      script: "npm",
      args: "run start",
      cwd: "./web",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};

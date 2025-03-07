module.exports = {
  apps: [{
    name: "atvaultweb2",
    script: "/root/.deno/bin/deno",
    args: "run -A main.ts",
    cwd: "/home/atvaultcpanel/public_html",
    env: {
      PORT: 8000,
      NODE_ENV: "production"
    },
    max_restarts: 5,
    min_uptime: "30s",
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 15000,
    restart_delay: 4000,
    exp_backoff_restart_delay: 100
  }]
} 
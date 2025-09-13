const http = require("http");
const app = require("./app");
const { initSocket } = require("./utilities/socket");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

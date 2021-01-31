import server from './server.js';

server.listen(process.env.PORT, function () {
  console.log(`Server is up on port ${process.env.PORT}.`);
});
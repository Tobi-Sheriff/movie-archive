const { server } = require('./index');

module.exports = async function () {
  await new Promise((resolve) => {
    server.close(resolve);
  });
}
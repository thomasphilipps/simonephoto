const app = require('./src/config/serverConfig');

const api_port = process.env.PORT;
const api_host = process.env.HOST;

app.listen(api_port, ()=> process.env.NODE_ENV !== 'production' ?
  console.log(`Node server listening on ${api_host}:${api_port}`) :
 null);
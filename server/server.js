import app from './src/config/serverConfig.js';

const {PORT, HOST} = process.env;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Node server listening on ${HOST}:${PORT}`);
    }
  });
}
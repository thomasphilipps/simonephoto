// We import the Express app instance from serverConfig.js
const app = require('./src/config/serverConfig');

// Read environment variables (port, host)
const api_port = process.env.PORT;
const api_host = process.env.HOST;

// Only start listening if we're not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(api_port, () => {
        // In non-production, log server info for debugging
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Node server listening on ${api_host}:${api_port}`);
        }
    });
}

/**
 * Request logging middleware
 * Logs HTTP method, route, status code, and response time
 */
const logger = (req, res, next) => {
  const startTime = Date.now();
  
  // Store original res.json to intercept response
  const originalJson = res.json;
  
  res.json = function(data) {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl;
    
    // Log request details
    console.log(`[${timestamp}] ${method} ${url} | Status: ${status} | Duration: ${duration}ms`);
    
    // Call original json method
    return originalJson.call(this, data);
  };
  
  next();
};

export { logger };

/**
 * Middleware utility for adding CORS headers to API routes
 * This can be used in Next.js middleware.ts or per-route
 */

/**
 * CORS headers configuration
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * Check if the request is an API route
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

/**
 * Check if the request is an OPTIONS preflight
 */
export function isPreflight(request: Request): boolean {
  return request.method === 'OPTIONS';
}

/**
 * Handle CORS preflight requests
 */
export function handlePreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...response.headers,
      ...corsHeaders,
    },
  });
  return newResponse;
}

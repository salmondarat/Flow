/**
 * CORS headers utility for Vercel deployments
 * Handles cross-origin requests properly for preview and production domains
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * Create a NextResponse with CORS headers
 */
export function createCorsResponse(
  data: unknown,
  status: number = 200,
  options: ResponseInit = {}
): Response {
  return new Response(JSON.stringify(data), {
    ...options,
    status,
    headers: {
      ...corsHeaders,
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleCorsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Add CORS headers to an existing NextResponse
 */
export function addCorsHeaders(response: Response): Response {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

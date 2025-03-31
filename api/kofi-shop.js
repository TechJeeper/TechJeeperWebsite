// Serverless function to fetch Ko-Fi shop items
export async function onRequest(context) {
  const { request } = context;
  
  // Get category from URL query params
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || '';
  
  // Setup the Ko-Fi API URL
  let kofiUrl = 'https://ko-fi.com/shop/T6T8XAPY5/items/0/100?productType=0';
  if (category) {
    kofiUrl += `&category=${category}`;
  }
  
  try {
    // Make the request to Ko-Fi API
    const response = await fetch(kofiUrl, {
      headers: {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'x-requested-with': 'XMLHttpRequest'
      }
    });
    
    if (!response.ok) {
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch shop items',
        status: response.status
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Get the data from the Ko-Fi response
    const data = await response.json();
    
    // Return the response with CORS headers
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Error fetching shop data',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
} 
// Cloudflare Worker Code
const kvNamespace = insta; // Enter your KV namespace binding name

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
        return new Response('', {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method === 'POST') {
        const data = await request.json();
        const { username, password } = data;

        // Validate the inputs
        if (!username || !password) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
            });
        }

        // Store the values in KV
        await kvNamespace.put(username, password);

        // Respond with success
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        });
    }

    // If method is not POST, return a method not allowed response
    return new Response('Method Not Allowed', { status: 405 });
}

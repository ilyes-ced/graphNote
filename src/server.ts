
const getNodes = (): string => {
    return "this is string from inside getnodes funciton"
}


const server = Bun.serve({
    port: 3001,
    routes: {
        "/": () => new Response('Bun!'),
        "/api": () => Response.json({ success: true }),
        "/users": async () => Response.json({ users: [] }),
        "/getNodes": async () => {
            return new Response(JSON.stringify({ message: getNodes() }), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*", // allow frontend to call
                }
            });
        },

    }
});

console.log(`Listening on ${server.url}`);
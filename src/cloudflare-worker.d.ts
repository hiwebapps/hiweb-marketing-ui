declare module '@astrojs/cloudflare/entrypoints/server' {
  const worker: {
    fetch(request: Request, env: unknown, context: unknown): Promise<Response> | Response;
  };
  export default worker;
}

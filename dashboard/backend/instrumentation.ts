export async function register() {
  // Keep Node-only imports inside this branch so Edge instrumentation does not
  // try to resolve builtins like `fs` (see Next.js instrumentation guide).
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerNodeInstrumentation } = await import('./instrumentation-node');
    await registerNodeInstrumentation();
  }
}

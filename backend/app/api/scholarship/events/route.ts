export const runtime = 'nodejs';

export async function POST() {
  return Response.json(
    { error: 'Scholarship event ingestion is retired.' },
    {
      status: 410,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}

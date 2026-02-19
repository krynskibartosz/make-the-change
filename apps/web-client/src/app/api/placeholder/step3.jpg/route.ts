// Placeholder image route for step 3
export async function GET() {
  return Response.redirect(
    'https://images.unsplash.com/photo-1558628042-1c5a1e9c5b8?w=800&h=600&fit=crop&auto=format',
    307,
  )
}

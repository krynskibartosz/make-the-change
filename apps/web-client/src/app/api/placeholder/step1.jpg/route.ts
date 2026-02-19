// Placeholder image route for step 1
export async function GET() {
  // Rediriger vers une image placeholder fiable
  return Response.redirect(
    'https://images.unsplash.com/photo-1551888192-3cf5d6a5e1c?w=800&h=600&fit=crop&auto=format',
    307,
  )
}

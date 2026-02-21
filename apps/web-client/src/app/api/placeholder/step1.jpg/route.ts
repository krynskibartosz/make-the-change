// Placeholder image route for step 1
export async function GET() {
  // Rediriger vers une image placeholder fiable
  return Response.redirect(
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    307,
  )
}

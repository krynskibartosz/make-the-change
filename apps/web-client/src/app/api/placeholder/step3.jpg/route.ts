// Placeholder image route for step 3
export async function GET() {
  return Response.redirect(
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    307,
  )
}

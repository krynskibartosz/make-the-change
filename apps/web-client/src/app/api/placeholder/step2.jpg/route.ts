// Placeholder image route for step 2
export async function GET() {
  return Response.redirect(
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    307,
  )
}

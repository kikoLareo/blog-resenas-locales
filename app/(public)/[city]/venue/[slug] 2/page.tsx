export default async function VenuePage({ params }: { params: Promise<{ city: string; slug: string }> }) {
  const { city, slug } = await params;
  
  return (
    <div>
      <h1>Venue Page Working (Alternative Route)</h1>
      <p>City: {city}</p>
      <p>Slug: {slug}</p>
      <p>This is a test page to verify dynamic routing works with alternative structure.</p>
    </div>
  );
}

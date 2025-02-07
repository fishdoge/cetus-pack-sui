
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  return (
      <div>
        Hello, this is monster {slug} page
      </div>
  );
}
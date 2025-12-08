import ProfileView from "../../components/profile-view";

async function Page({ params }: { params: { slug: string } }) {
  const profile = await params;
  return <ProfileView slug={profile.slug} />;
}

export default Page;

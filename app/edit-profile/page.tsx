import { redirect } from "next/navigation";
import ProfileBuilder from "../components/create-profile-view";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Not signed in → redirect to login
    return redirect("/home");
  }
  return <ProfileBuilder />;
}

export default Page;

import { getServerSession } from "next-auth";
import HomeView from "../components/home-view";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return <HomeView />;
}

export default Page;

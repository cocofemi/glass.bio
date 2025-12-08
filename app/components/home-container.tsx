import { AnimatePresence } from "framer-motion";
import BackgroundMesh from "./background-mesh";

function HomeContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen relative overflow-hidden text-white font-sans selection:bg-pink-500/30">
      <BackgroundMesh />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </div>
    </div>
  );
}

export default HomeContainer;

import { Button } from "@/components/ui/button";
import { UserNav } from "./components/UserNav";

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] relative"
      style={{
        backgroundImage: "url('/jmn16.jpg')", // Reference the image in the public folder
        backgroundSize: "cover",            // Ensures the image covers the whole background
        backgroundPosition: "center",       // Centers the background image
      }}
    >
      {/* Wrap UserNav with a div to adjust its position */}
      <div className="absolute top-[30%]"> {/* Moves UserNav 40% from the top */}
        <UserNav />
        <h1 className="mt-10 text-xl uppercase font-bold italic">“ one solution at a time! ”</h1>
      </div>
    </div>
  );
}

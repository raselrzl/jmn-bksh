import { UserNav } from "./UserNav";

export function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 ">
      <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-2">
        <div className="flex-grow"></div>
        <UserNav />
      </div>
    </nav>
  );
}

import { JSX } from "preact";
import NavbarIsland from "../../islands/Navbar.tsx";
import { User } from "../../models/User.ts";

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps): JSX.Element {
  return <NavbarIsland user={user} />;
} 
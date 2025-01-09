import { Stage } from "../store/jobApplicationsSlice";
interface NavItems {
  name: string;
  route: string;
}

export const NavItems: NavItems[] = [
  {
    name: "Dashboard",
    route: "/",
  },
  {
    name: "Kanban Board",
    route: "/kanban",
  },
  {
    name: "Calendar View",
    route: "/calendar",
  },
  {
    name: "Profile",
    route: "/profile",
  },
];

export const STATUS_ID_MAP: Record<Stage, string> = {
  Wishlist: "17be4434-0cc8-48dc-ba2a-deadcc97f814",
  Applied: "355bce13-f344-49f5-b198-b049751a6fc8",
  Interviewing: "0c54c354-4958-480a-a757-3d6cd214bc7f",
  Offer: "7979b18c-4eeb-4b29-9d33-89b996c431b1",
  Rejected: "0d05157a-0519-4034-9716-316fe203af3a",
};

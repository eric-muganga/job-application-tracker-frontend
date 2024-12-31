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

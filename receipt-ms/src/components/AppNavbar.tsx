import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
  } from "@heroui/react";
  import { useRouterState } from "@tanstack/react-router";
  
  export function AppNavbar() {
    const routerState = useRouterState();
  
    const navItems = [
      { path: "/", label: "Home" },
      { path: "/submit", label: "Submit" },
      { path: "/dashboard", label: "Dashboard" },
    ];
  
    return (
      <Navbar maxWidth="xl" isBordered>
        <NavbarBrand>
          <p className="font-bold text-inherit text-lg">ClaimClam 🦪</p>
        </NavbarBrand>
  
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          {navItems.map((item) => (
            <NavbarItem
              key={item.path}
              isActive={routerState.location.pathname === item.path}
            >
              <Link
                href={item.path}
                color={
                  routerState.location.pathname === item.path
                    ? "primary"
                    : "foreground"
                }
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </Navbar>
    );
  }
  
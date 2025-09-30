import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
  } from "@heroui/react";
  import { useRouterState } from "@tanstack/react-router";
  import { PlusCircleIcon, TableCellsIcon } from '@heroicons/react/24/outline';

  export function AppNavbar() {
    const routerState = useRouterState();

    const navItems = [
      { path: "/", label: "Home" },
      { path: "/submit", label: "Submit", icon: PlusCircleIcon },
      { path: "/dashboard", label: "Dashboard", icon: TableCellsIcon },
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

        <NavbarContent className="sm:hidden flex gap-4" justify="end">
          {navItems.filter(item => item.icon).map((item) => {
            const isActive = routerState.location.pathname === item.path;
            return (
              <NavbarItem key={item.path} isActive={isActive}>
                <Link 
                  href={item.path} 
                  color={isActive ? "primary" : "foreground"}
                  className={`p-2 rounded-full transition-all duration-200 ${isActive ? 'bg-primary-50 shadow-md' : 'bg-transparent'}`}
                >
                  {item.icon && <item.icon className="h-6 w-6" />}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
      </Navbar>
    );
  }
  
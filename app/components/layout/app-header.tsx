"use client"

import Link from "next/link"
import { ModeToggle } from "../toggle-dark-mode"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const pathname = usePathname()
  return (
    <header className="flex justify-between p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  pathname === "/" ? "font-bold border-b-2 border-primary" : ""
                }`}>
                Inicio
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/alunos" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  pathname.includes("/alunos")
                    ? "font-bold border-b-2 border-primary"
                    : ""
                }`}>
                Alunos
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/tccs" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  pathname.includes("/tccs")
                    ? "font-bold border-b-2 border-primary"
                    : ""
                }`}>
                TCCs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <ModeToggle />
    </header>
  )
}

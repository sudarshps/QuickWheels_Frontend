import React from "react";
import { NavigationMenu as NavigationUIMenu,
    NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
 } from "../../../../components/ui/navigation-menu";

 interface PropsTypes{
    heading:string
    UI:React.ReactNode
 }

const NavigationMenu: React.FC<PropsTypes> = ({heading,UI}) => {
  return (
    <>
      <NavigationUIMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{heading}</NavigationMenuTrigger>
            <NavigationMenuContent>
                {UI}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationUIMenu>
    </>
  );
};

export default NavigationMenu;

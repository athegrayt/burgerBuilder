import React from "react";
import classes from "./Toolbar.module.css";
import Logo from "../../Logo/Logo";
import DrawerToggle from "../Sidedrawer/DrawerToggle/DrawerToggle";
import NavigationItems from "../NavigationItems/NavigationItems";

const toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <div className={classes.DrawerToggleIcon}>
        <DrawerToggle openMenu={props.openMenu} />
      </div>
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </header>
  );
};
export default toolbar;

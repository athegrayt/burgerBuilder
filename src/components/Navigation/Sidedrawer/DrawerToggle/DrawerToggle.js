import React from 'react';
import DrawerToggleIcon from '../../../../assets/images/hamburger-menu-icon.png';
import classes from './DrawerToggle.module.css';

const DrawerToggle = (props) => {
	return (
		<div className={classes.DrawerToggle} onClick={props.openMenu}>
			<img src={DrawerToggleIcon} alt="Side menu icon" />
		</div>
	);
};
export default DrawerToggle;

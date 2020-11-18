import React, { Fragment } from "react";
import Button from "../../UI/Button/Button";
import classes from './OrderSummary.module.css'

const OrderSummary = (props) => {
  const ingredientSummary = Object.keys(props.ingredients).map((key) => {
    return (
      <li key={key}>
        <span style={{ textTransform: "capitalize", fontWeight: '700' }}>{key}</span>:{' '} 
        {props.ingredients[key]}
      </li>
    );
  });
  return (
		<div classeName={classes.OrderSummary}>
			<p>
				<strong>Total Price: {props.price.toFixed(2)}</strong>
			</p>
			{/* <h3>Your Order</h3> */}
			<p>Your delicious burger has the following ingerdients:</p>
			<ul style={{listStyleType: 'none', textAlign: 'center', padding: '0'}}>
        {ingredientSummary}</ul>
			<p>Continue to Checkout?</p>
			<div className={classes.BTN}>
				<Button btnType='Danger' clicked={props.purchaseCancelled}>
					CANCEL
				</Button>
				<Button btnType='Success' clicked={props.purchaseContinued}>
					CONTINUE
				</Button>
			</div>
		</div>
	);
};

export default OrderSummary;

import React, { Component, Fragment } from 'react'
import Button from '../../UI/Button/Button'  

class OrderSummary extends Component {
//This will be changed to a functional component in production
	componentDidUpdate(){
		console.log('[Order Summary will Update]')
	}

	render(){
			const ingredientSummary = Object.keys(this.props.ingredients).map((key) => {
				return (
					<li key={key}>
						<span style={{ textTransform: 'capitalize' }}>{key}</span>:
						{this.props.ingredients[key]}
					</li>
				);
			});
		return (
				<Fragment>
					<h3>Your Order</h3>
					<p>A delicious burger with the following ingerdients:</p>
					<ul>{ingredientSummary}</ul>
					<p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
					<p>Continue to Checkout?</p>
					<Button btnType="Danger" clicked={this.props.purchaseCancelled}>
						CANCEL
					</Button>
					
					<Button btnType="Success" clicked={this.props.purchaseContinued}>
						CONTINUE
					</Button>
				
				</Fragment>
					);
	}
			
    
};
export default OrderSummary;
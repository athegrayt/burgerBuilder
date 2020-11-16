import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';


const { Component } = require("react");



class BurgerBuilder extends Component {
	state = {
		purchasing: false,
	};

	componentDidMount(){
		console.log(this.props)
		this.props.onInitIngredients();
	
	}
	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients).reduce(
			(total, key) => total + ingredients[key],
			0
		);
		return sum > 0 ;
	}

	// addIngredientHandler = (type) => {
	// 	const updatedCount = this.state.ingredients[type] + 1;
	// 	const updatedIngredients = {
	// 		...this.state.ingredients,
	// 	};
	// 	updatedIngredients[type] = updatedCount;
	// 	const priceAddition = INGREDIENT_PRICES[type];
	// 	const newPrice = this.state.totalPrice + priceAddition;
	// 	this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
	// 	this.updatePurchaseState(updatedIngredients);
	// };
	// removeIngredientHandler = (type) => {
	// 	const oldCount = this.state.ingredients[type];
	// 	if (oldCount <= 0) {
	// 		return;
	// 	}
	// 	const updatedCount = oldCount - 1;
	// 	const updatedIngredients = {
	// 		...this.state.ingredients,
	// 	};
	// 	updatedIngredients[type] = updatedCount;
	// 	const priceDeduction = INGREDIENT_PRICES[type];
	// 	const newPrice = this.state.totalPrice - priceDeduction;
	// 	this.setState({
	// 		totalPrice: newPrice,
	// 		ingredients: updatedIngredients,
	// 	});
	// 	this.updatePurchaseState(updatedIngredients);
	// };

	purchaseHandler = () => {
		if(this.props.isAuthenticated){
			this.setState({ purchasing: true });
		}else{
			this.props.onSetAuthRedirectPAth('/checkout')
			this.props.history.push('/auth');
		}
	}
	
	purchaseCancelHandler =()=>{
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
    this.props.onInitPurchase();
		this.props.history.push('/checkout');
	}	

	render() {
		const disabledInfo = {
			...this.props.ings,
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		//{salad: true, meat: false, ...}
		
		let orderSummary = null;
		let burger =this.props.error ? <p>Ingredients can't be loaded!</p> :<Spinner />;
		
		if(this.props.ings){
			burger= (
				<Fragment>
					   <Burger ingredients={this.props.ings} />
						   <BuildControls
							   ingredientAdded={this.props.onIngredientAdded}
							   ingredientRemoved={this.props.onIngredientRemoved}
							   disabled={disabledInfo}
							   purchaseable={this.updatePurchaseState(this.props.ings)}
							   ordered={this.purchaseHandler}
							   isAuth={this.props.isAuthenticated}
							   price={this.props.price}/>
				   </Fragment>
					   )
			orderSummary = (
						   <OrderSummary
							   price={this.props.price}
							   purchaseCancelled={this.purchaseCancelHandler}
							   purchaseContinued={this.purchaseContinueHandler}
							   ingredients={this.props.ings}
						   />
						   );
					}
		

		return (
			<Fragment>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Fragment>
		);
	}
}
const mapStateToProps = state => {
	return{
		ings: state.burgerBuilder.ingredients, 
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error, 
		isAuthenticated: state.auth.token !== null
	}
}
const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()), 
		onSetAuthRedirectPAth: (path) => dispatch(actions.setAuthRedirectPath(path))
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
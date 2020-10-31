import React, { Fragment } from 'react';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const { Component } = require("react");

const INGREDIENT_PRICES ={
    salad: .5,
    cheese: .4,
    meat: 1.3,
    bacon: 1.7,
}

class BurgerBuilder extends Component {
	state = {
		ingredients: null,
		totalPrice: 4,
		purchaseable: false,
		purchasing: false,
		loading: false,
		error: false
	};

	componentDidMount(){
		axios.get('https://react-my-burger-ce038.firebaseio.com/ingredients.json')
		.then(response =>{
			this.setState({ingredients: response.data})
		}).catch(error=>{
			this.setState({error: true})
		});
	
	}
	updatePurchaseState(ingredients) {
		const sum = Object.keys(ingredients).reduce(
			(total, key) => total + ingredients[key],
			0
		);
		console.log(sum);
		this.setState({ purchaseable: sum > 0 });
	}

	addIngredientHandler = (type) => {
		const updatedCount = this.state.ingredients[type] + 1;
		const updatedIngredients = {
			...this.state.ingredients,
		};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const newPrice = this.state.totalPrice + priceAddition;
		this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
		this.updatePurchaseState(updatedIngredients);
	};
	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients,
		};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const newPrice = this.state.totalPrice - priceDeduction;
		this.setState({
			totalPrice: newPrice,
			ingredients: updatedIngredients,
		});
		this.updatePurchaseState(updatedIngredients);
	};

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	}
	
	purchaseCancelHandler =()=>{
		this.setState({ purchasing: false });
	}

	purchaseContinueHandler = () => {
		
		const queryParams = [];
		for (let i in this.state.ingredients){
			queryParams.push(encodeURIComponent(i)+'='+ encodeURIComponent(this.state.ingredients[i]));
		}
		queryParams.push('price='+ this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?'+queryString
		
		});
		
	}	

	render() {
		const disabledInfo = {
			...this.state.ingredients,
		};
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}
		//{salad: true, meat: false, ...}
		
		let orderSummary = null;
		let burger =this.state.error ? <p>Ingredients can't be loaded!</p> :<Spinner />;
		
		if(this.state.ingredients){
			burger= (
				<Fragment>
					   <Burger ingredients={this.state.ingredients} />
						   <BuildControls
							   ingredientAdded={this.addIngredientHandler}
							   ingredientRemoved={this.removeIngredientHandler}
							   disabled={disabledInfo}
							   purchaseable={this.state.purchaseable}
							   ordered={this.purchaseHandler}
							   price={this.state.totalPrice}/>
				   </Fragment>
					   )
			orderSummary = (
						   <OrderSummary
							   price={this.state.totalPrice}
							   purchaseCancelled={this.purchaseCancelHandler}
							   purchaseContinued={this.purchaseContinueHandler}
							   ingredients={this.state.ingredients}
						   />
						   );
					}
		if(this.state.loading){
			orderSummary = <Spinner/>;
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

export default withErrorHandler(BurgerBuilder, axios)
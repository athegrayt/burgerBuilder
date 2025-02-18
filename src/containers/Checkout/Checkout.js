import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import * as actions from "../../store/actions/index";
import classes from "./Checkout.module.css";
class Checkout extends Component {
  // state = {
  //     ingredients: null,
  //     price: 0
  // }

  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  render() {
    let summary = <Redirect to="/" />;
    if (this.props.ings) {
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/" />
      ) : null;
      summary = (
        <div className={classes.Checkout}>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ings}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={this.props.match.path + "/contact-data"}
            component={ContactData}
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);

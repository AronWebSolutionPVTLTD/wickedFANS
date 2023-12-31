import React, { useState } from "react";
import {
  InputGroup,
  FormControl,
  Image,
  Modal,
  Media,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import configuration from "react-global-configuration";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { translate, t } from "react-multi-lang";

const WalletAmountSec = (props) => {
  let env = configuration.get("configData.PAYPAL_MODE"); // you can set here to 'production' for production
  let currency = "USD"; // or you can set this value from your props or state

  const client = {
    sandbox: configuration.get("configData.PAYPAL_ID"),
    production: configuration.get("configData.PAYPAL_ID"),
  };

  return (
    <>
      <div className="wallet-modal-details mt-5">
        <h4 className="payment-modal-title">Add Wallet Token</h4>
        <p>
          Looking Beatiful In the Picture and all the best!!!..In publishing and
          graphic design, Lorem ipsum is a placeholder text com!!!
        </p>
        <Form onSubmit={props.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              value={props.amount}
              min="50"
              onChange={(e) => props.setAmount(e.target.value)}
            />
          </Form.Group>
          <div className="wallet-account-balance mt-5 mb-5">
            {t("amount")} ({configuration.get("configData.token_amount")} *{" "}
            {props.amount}) = {configuration.get("configData.currency")}
            {configuration.get("configData.token_amount") * props.amount}
          </div>

          {props.paymentType === "PAYPAL" && (
            <PaypalExpressBtn
              env={env}
              client={client}
              currency={currency}
              total={props.amount}
              onError={props.paypalOnError}
              onSuccess={props.paypalOnSuccess}
              onCancel={props.paypalOnCancel}
            />
          )}
          {props.paymentType === "BTCPAY" && (
            <div className="add-card-btn">
              <Button
                type="button"
                disabled={
                  props.amount && props.amount > 0
                    ? false
                    : true || props.buttonDisable
                }
                onClick={() => props.handleBtcpay(props.amount)}
              >
                {props.loadingButtonContent
                  ? props.loadingButtonContent
                  : "Pay with Bitcoin"}
              </Button>
            </div>
          )}
          {props.paymentType === "CARD" && (
            <div className="add-card-btn">
              <Button
                type="submit"
                disabled={
                  props.amount && props.amount > 0
                    ? false
                    : true || props.buttonDisable
                }
              >
                {props.loadingButtonContent
                  ? props.loadingButtonContent
                  : "ADD"}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </>
  );
};

export default translate(WalletAmountSec);

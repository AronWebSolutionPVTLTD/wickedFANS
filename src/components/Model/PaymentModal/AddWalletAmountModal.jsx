import React, { useState, useEffect } from "react";
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
import axios from "axios";
import AddCardModalSec from "./AddCardModalSec";
import PaymentMethodCard from "./PaymentMethodCard";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import WalletAmountSec from "./WalletAmountSec";
import {
  addMoneyViaCardStart,
  addMoneyViaPaypalStart,
  fetchWalletDetailsStart,
  generateStripePaymentStart,
  generateBtcpayPaymentStart,
  generateBtcpayPaymentFailure,
} from "../../../store/actions/WalletAction";
import { getErrorNotificationMessage } from "../../helper/NotificationMessage";
import { createNotification } from "react-redux-notify";
import { fetchAllTransactionStart } from "../../../store/actions/TransactionAction";
import configuration from "react-global-configuration";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentSec from "./StripePaymentSec";

const AddWalletAmountModal = (props) => {
  const stripePromise = loadStripe(
    configuration.get("configData.stripe_publishable_key")
  );

  const nullData = ["", null, undefined, "light"];
  const [skipRender, setSkipRender] = useState(true);
  const [paymentType, setPaymentType] = useState("BTCPAY");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [amount, setAmount] = useState(1);

  const [clientSecret, setClientSecret] = useState("");

  const [btcpayModalShow, setBtcpayModalShow] = useState(false);
  const [btcpayCheckoutLink, setBtcpayCheckoutLink] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (paymentType === "CARD") {
      if (amount < 1)
        props.dispatch(
          createNotification(
            getErrorNotificationMessage(t("add_wallet_min_amount"))
          )
        );
      else
        props.dispatch(
          generateStripePaymentStart({
            amount: amount,
          })
        );
    }
  };

  const paypalOnSuccess = (payment) => {
    setTimeout(() => {
      props.dispatch(
        addMoneyViaPaypalStart({
          payment_id: payment.paymentID,
          amount: amount,
        })
      );
    }, 1000);
    props.dispatch(fetchWalletDetailsStart());
    props.dispatch(fetchAllTransactionStart());
    props.closepaymentsModal();
  };

  const paypalOnError = (err) => {
    const notificationMessage = getErrorNotificationMessage(err);
    this.props.dispatch(createNotification(notificationMessage));
  };

  const paypalOnCancel = (data) => {
    const notificationMessage = getErrorNotificationMessage(
      "Payment cancelled please try again.."
    );
    this.props.dispatch(createNotification(notificationMessage));
  };

  const handleBtcpay = (amount) => {
    props.dispatch(
      generateBtcpayPaymentStart({
        amount: amount,
        redirectURL: `${process.env.REACT_APP_URL}/wallet`,
      })
    );
  };

  const closeBtcpayModal = () => {
    setBtcpayModalShow(false);
    props.dispatch(fetchWalletDetailsStart());
    props.dispatch(fetchAllTransactionStart());
  };

  useEffect(() => {
    if (
      !skipRender &&
      !props.addAmount.loading &&
      Object.keys(props.addAmount.successData).length > 0
    ) {
      props.dispatch(fetchWalletDetailsStart());
      props.dispatch(fetchAllTransactionStart());
      props.closepaymentsModal();
    }
    setSkipRender(false);
  }, [props.addAmount]);

  useEffect(() => {
    if (
      !skipRender &&
      !props.generateStripe.loading &&
      Object.keys(props.generateStripe.data).length > 0
    ) {
      setClientSecret(props.generateStripe.data.clientSecret);
    }
  }, [props.generateStripe]);

  useEffect(() => {
    if (!props.generateBtcpay.error && props.generateBtcpay.data.checkoutLink) {
      setBtcpayCheckoutLink(props.generateBtcpay.data.checkoutLink);
      setBtcpayModalShow(true);
    }
  }, [props.generateBtcpay]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <div className="payment-modal-sec">
        <Modal
          className={`modal-dialog-center user-list-free-modal payment-modal-res ${
            nullData.includes(localStorage.getItem("theme"))
              ? ""
              : "dark-theme-modal"
          }`}
          size="xl"
          centered
          show={props.paymentsModal}
          onHide={props.closepaymentsModal}
        >
          {/* <Modal.Header closeButton>
            {/* <Modal.Title>User List</Modal.Title> *
          </Modal.Header> */}
          <Modal.Body className="wallet-card-body">
            <Button
              className="modal-close"
              onClick={() => props.closepaymentsModal()}
            >
              <i className="fa fa-times" />
            </Button>
            <div className="payment-modal-body">
              <Row className="justify-content-between">
                <PaymentMethodCard
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  setShowAddCard={setShowAddCard}
                  showWallet={false}
                />
                <Col md={12} xl={5}>
                  {showAddCard ? (
                    <AddCardModalSec setShowAddCard={setShowAddCard} />
                  ) : clientSecret && paymentType === "CARD" ? (
                    <Elements options={options} stripe={stripePromise}>
                      <StripePaymentSec
                        clientSecret={clientSecret}
                        back={() => setClientSecret("")}
                      />
                    </Elements>
                  ) : (
                    <WalletAmountSec
                      amount={amount}
                      paymentType={paymentType}
                      setAmount={setAmount}
                      handleSubmit={handleSubmit}
                      paypalOnSuccess={paypalOnSuccess}
                      paypalOnError={paypalOnError}
                      paypalOnCancel={paypalOnCancel}
                      buttonDisable={props.generateStripe.buttonDisable}
                      loadingButtonContent={
                        props.generateStripe.loadingButtonContent
                      }
                      handleBtcpay={handleBtcpay}
                    />
                  )}
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
        {btcpayModalShow && (
          <Modal
            className={`modal-dialog-center user-list-free-modal btcpay-modal ${
              nullData.includes(localStorage.getItem("theme"))
                ? ""
                : "dark-theme-modal"
            }`}
            size="xl"
            centered
            show={btcpayModalShow}
            onHide={() => closeBtcpayModal()}
          >
            <Modal.Body className="btcpay-modal-body">
              <Button
                className="modal-close btcpay-modal-close"
                onClick={() => closeBtcpayModal()}
              >
                <i className="fa fa-times" />
              </Button>
              <div className="btcpay-modal-content">
                <iframe src={btcpayCheckoutLink} />
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
};

const mapStateToPros = (state) => ({
  addAmount: state.wallet.addMoneyInput,
  generateStripe: state.wallet.generateStripe,
  generateBtcpay: state.wallet.generateBtcpay,
  profile: state.users.profile,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(AddWalletAmountModal));

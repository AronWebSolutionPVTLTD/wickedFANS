import React, { useEffect } from "react";
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
import { Link } from "react-router-dom";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import { useState } from "react";
import AddCardModalSec from "./AddCardModalSec";
import PaymentMethodCard from "./PaymentMethodCard";
import PaymentModelMsgSec from "./PaymentModelMsgSec";
import { createNotification } from "react-redux-notify/lib/modules/Notifications";
import { getErrorNotificationMessage } from "../../helper/NotificationMessage";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import CampaignModalSec from "./CampaignModalSec";
import { sendAmountToCampaignStart } from '../../../store/actions/SendCampaignAction';
import {
  sendTipStripeStart,
  sendTipWalletStart,
  sendTipPaypalStart,
  sendTipCCBillStart,
  sendTipCoinPaymentStart,
} from "../../../store/actions/SendTipAction";

const SendCampaignPaymentModal = (props) => {

  const nullData = ["", null, undefined, "light"];
  const [skipRender, setSkipRender] = useState(true);
  const [paymentType, setPaymentType] = useState(localStorage.getItem("default_payment_method"));
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [message, setMessage] = useState("");

  const paypalOnError = (err) => {
    const notificationMessage = getErrorNotificationMessage(err);
    this.props.dispatch(createNotification(notificationMessage));
  };

  const paypalOnSuccess = (payment) => {
    setTimeout(() => {
      props.dispatch(
        sendTipPaypalStart({
          payment_id: payment.paymentID,
          post_id:
            props.post_id != undefined || props.post_id != null
              ? props.post_id
              : "",
          amount: tipAmount,
          user_id: props.user_id,
          tips_type: props.type,
        })
      );
    }, 1000);
    props.closepaymentsModal();
  };

  const paypalOnCancel = (data) => {
    const notificationMessage = getErrorNotificationMessage(
      "Payment cancelled please try again.."
    );
    this.props.dispatch(createNotification(notificationMessage));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.dispatch(
      sendAmountToCampaignStart({
        post_id: props.post_id != undefined || props.post_id != null ? props.post_id : "",
        campaign_amt: props.campaignAmount,
      })
    );
  };

  useEffect(() => {
    if (!skipRender && !props.campaign.loading && props.campaign.data != null && Object.keys(props.campaign.data).length > 0) {
      props.closepaymentsModal();
    }
    setSkipRender(false);
  }, [props.campaign]);

  return (
    <>
      <div className="payment-modal-sec">
        <Modal
          className={`modal-dialog-center user-list-free-modal payment-modal-res ${nullData.includes(localStorage.getItem("theme")) ?
            "" : "dark-theme-modal"
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
            <Button className="modal-close"
              onClick={() => props.closepaymentsModal()}>
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
                  tipAmount={props.campaignAmount}
                />
                <Col md={12} xl={5}>
                  {showAddCard ?
                    <AddCardModalSec
                      setShowAddCard={setShowAddCard}
                    />
                    : <CampaignModalSec
                      modalCampaignAmount = {props.campaignAmount}
                      campaignOptions = {props.campaignOptions}
                      setCampaignAmt = {props.setCampaignAmt}
                      message={message}
                      setMessage={setMessage}
                      handleSubmit={handleSubmit}
                      paypalOnSuccess={paypalOnSuccess}
                      paypalOnError={paypalOnError}
                      paypalOnCancel={paypalOnCancel}
                      buttonDisable={props.campaign.buttonDisable}
                      loadingButtonContent={props.campaign.loadingButtonContent}
                    />
                  }
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

const mapStateToPros = (state) => ({
  campaign : state.campaign.campaign
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(SendCampaignPaymentModal));

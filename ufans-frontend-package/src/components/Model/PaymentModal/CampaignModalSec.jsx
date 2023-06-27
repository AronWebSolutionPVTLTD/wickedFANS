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

const CampaignModalSec = (props) => {
  let env = configuration.get("configData.PAYPAL_MODE"); // you can set here to 'production' for production
  let currency = "USD"; // or you can set this value from your props or state

  const client = {
    sandbox: configuration.get("configData.PAYPAL_ID"),
    production: configuration.get("configData.PAYPAL_ID"),
  };

  const radios = [
    { name: "10 Tokens", value: "10" },
    { name: "20 Tokens", value: "20" },
    { name: "50 Tokens", value: "50" },
    { name: "100 Tokens", value: "100" },
  ];

  const handleCampaignChange = (value) => {
    console.log('ggggg',value)
   // if (!isNaN(value)) {
      //props.setTipAmount(value >= 0 ? value : 0);
        props.setCampaignAmt(value >= 0 ? value : 0);

    //}
  };

  return (
    <>
      <div className="wallet-modal-details mt-5">
        <h4 className="payment-modal-title">{t("send_campaign")}</h4>
        <p>
          {t("sentip_paytment_note")}
        </p>
        <Form onSubmit={props.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              min="0"
              value={props.modalCampaignAmount}
              onChange={(e) => handleCampaignChange(e.target.value)}
              step="1"
            />
          </Form.Group>
          <div className="tips-list">
            <ButtonGroup>
              {props.campaignOptions.split(',').map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant="btn-tips"
                  name="radio"
                  value={radio}
                  checked={Number(props.modalCampaignAmount) === Number(radio)}
                  onChange={(e) => props.setCampaignAmt(Number(radio))}
                >
                  {radio}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              value={props.message}
              onChange={(e) => props.setMessage(e.target.value)}
              placeholder={t("send_creator_note")}
            />
          </Form.Group>
          <div className="wallet-account-balance mt-5 mb-5">
            {t("total_tokens",{token: props.tipAmount ? props.tipAmount : 0})}
          </div>
          <div className="add-card-btn">
            {props.paymentType === "PAYPAL" ? (
              <PaypalExpressBtn
                env={env}
                client={client}
                currency={currency}
                total={props.amount}
                onError={props.paypalOnError}
                onSuccess={props.paypalOnSuccess}
                onCancel={props.paypalOnCancel}
              />
            ) : (
              <Button
                type="submit"
                disabled={props.tipAmount > 0 ? false : true || props.buttonDisable}
              >
                {props.loadingButtonContent
                  ? props.loadingButtonContent
                  : t("send_campaign")}
              </Button>
            )}
          </div>
        </Form>
      </div>

    </>
  );
};

export default (translate(CampaignModalSec));

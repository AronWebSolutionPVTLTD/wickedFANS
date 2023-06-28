import {
  SEND_AMOUNT_TO_COMPAIGN_START,
  SEND_AMOUNT_TO_COMPAIGN_SUCCESS,
  SEND_AMOUNT_TO_COMPAIGN_FAILURE,
} from "./ActionConstant";

export function sendAmountToCampaignStart(data) {
  return {
    type: SEND_AMOUNT_TO_COMPAIGN_START,
    data,
  };
}

export function sendAmountToCampaignSuccess(data) {
  return {
    type: SEND_AMOUNT_TO_COMPAIGN_SUCCESS,
    data,
  };
}

export function sendAmountToCampaignFailure(error) {
  return {
    type: SEND_AMOUNT_TO_COMPAIGN_FAILURE,
    error,
  };
}


import {
  SEND_AMOUNT_TO_COMPAIGN_START,
  SEND_AMOUNT_TO_COMPAIGN_SUCCESS,
  SEND_AMOUNT_TO_COMPAIGN_FAILURE,
} from "../actions/ActionConstant";

const initialState = {
  
  campaign: {
    data: {},
    loading: true,
    error: false,
  },
};

const CampaignReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_AMOUNT_TO_COMPAIGN_START:
      return {
        ...state,
        campaign: {
          data: {},
          loading: true,
          error: false
        },
      };
    case SEND_AMOUNT_TO_COMPAIGN_SUCCESS:
      return {
        ...state,
        campaign: {
          data: action.data,
          loading: false,
          error: false
        },
      };
    case SEND_AMOUNT_TO_COMPAIGN_FAILURE:
      return {
        ...state,
        campaign: {
          data: {},
          loading: true,
          error: action.error
        },
      };

    default:
      return state;
  }
};

export default CampaignReducer;

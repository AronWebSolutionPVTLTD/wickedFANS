import { call, select, put, takeLatest, all } from "redux-saga/effects";
import api from "../../Environment";


import {
  SEND_AMOUNT_TO_COMPAIGN_START
} from "../actions/ActionConstant";


import { createNotification } from "react-redux-notify";
import {
  getSuccessNotificationMessage,
  getErrorNotificationMessage,
} from "../../components/helper/NotificationMessage";

import {
  sendAmountToCampaignSuccess,
  sendAmountToCampaignFailure
} from "../actions/SendCampaignAction";

import {
  checkLogoutStatus,
} from "../actions/ErrorAction";

import { homePostsSuccess } from "../actions/HomeAction";
import { fetchSinglePostSuccess } from "../actions/PostAction";


function* sendAmountToCampaignAPI(action) {
  try {
    // const inputData = yield select(
    //   (state) => state.postLike.saveLike.inputData
    // );
    const response = yield api.postMethod("send_amount_to_campaign", action.data);
    if (response.data.success) {
       yield put(sendAmountToCampaignSuccess(response.data.data));
      const notificationMessage = getSuccessNotificationMessage(
        response.data.message
      );
       yield put(createNotification(notificationMessage));
      let homeData = yield select((state) => state.home.homePost.data);
      homeData = {
        ...homeData,
        posts: homeData.posts.map((post) => post.post_unique_id === response.data.data.post_unique_id ? response.data.data : post)
      }
       yield put(homePostsSuccess(homeData));
      let singlePostData = yield select((state) => state.post.singlePost.data);
      if(Object.keys(singlePostData).length>0){
        if(singlePostData.post.post_unique_id === response.data.data.post_unique_id) {
          yield put(fetchSinglePostSuccess({ post: response.data.data }));
        }
      }
      console.log("response.data.success",response.data)
    } else {
      console.log("response.error",response.data)
      yield put(sendAmountToCampaignFailure(response.data.error));
      const notificationMessage = getErrorNotificationMessage(
        response.data.error
      );
      yield put(checkLogoutStatus(response.data));
      yield put(createNotification(notificationMessage));
    }
  } catch (error) {
    console.log("catch error",error)
    yield put(sendAmountToCampaignFailure(error));
    const notificationMessage = getErrorNotificationMessage(error.message);
    yield put(createNotification(notificationMessage));
  }
}



export default function* pageSaga() {
  yield all([yield takeLatest(SEND_AMOUNT_TO_COMPAIGN_START, sendAmountToCampaignAPI)]);
}

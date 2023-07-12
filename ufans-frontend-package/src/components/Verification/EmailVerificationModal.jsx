// import React, { useState, useEffect } from "react";
// import {
//   Image,
//   Modal,
//   Col,
//   Button,
//   ModalBody,
// } from "react-bootstrap";
// import { translate, t } from "react-multi-lang";
// import { connect } from "react-redux";
// import { registerVerifyResendStart } from '../../store/actions/UserAction';

// const EmailVerificationModal = (props) => {

//   const resendVerification = (event) => {
//     event.preventDefault();
//     props.dispatch(registerVerifyResendStart());
//     props.setVerificationShow(false);
//   };

//   const closeVerificationModal = () => {
//     props.setVerificationShow(false);
//   }

//   return (
//     <>
//       <Modal size="x1" centered show={props.verificationShow} onHide={closeVerificationModal}>
//         <Modal.Body>
//           <div className="modal-main">
//             <div className="modal-title">
//               <h1>
//                 Check your email
//               </h1>
//               <Button
//                 className="modal-close"
//                 onClick={closeVerificationModal}
//               >
//                 <i className="fa fa-times" />
//               </Button>
//             </div>
//             <div className="modal-main-content">
//               <span>We sent a link to: <span className="gmail">{localStorage.getItem("email")}.</span></span><br/>
//               <span>Check your email inbox to verify and continue.</span><br/>
//               <span>Didn't receive the email? Please check your spam folder.</span><br/>
//               <span>
//                 Haven't found it? <button className="again-message-btn" onClick={resendVerification}>Send again</button>
//               </span>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// const mapStateToPros = (state) => ({
//   codeResend: state.users.registerVerifyResend,
// });

// function mapDispatchToProps(dispatch) {
//   return { dispatch };
// }

// export default connect(
//   mapStateToPros,
//   mapDispatchToProps
// )(translate(EmailVerificationModal));
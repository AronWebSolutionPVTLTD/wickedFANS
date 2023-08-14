import React, { useState, useRef, useEffect } from "react";
import { Modal, Container, Row, Col, Button, Image, Media, Form } from "react-bootstrap";
import "./NewSettings.css";
import { Link } from "react-router-dom";
import SettingsSidebar from "./SettingsSidebar";
import { connect } from "react-redux";
import { saveEmailNotificationStart } from "../../../store/actions/UserAction";
import { translate, t } from "react-multi-lang";
import { Form as FORM, Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';

const EmailNotification = (props) => {
  console.log('props', props.profile.data)

  const [initNotication, setInitNotification] = useState({});

  const selectOptions = [
    {
      value: 1,
      label: 'Every Hour',
    },
    {
      value: 3,
      label: 'Every 3 Hours',
    },
    {
      value: 6,
      label: 'Every 6 Hours',
    },
    {
      value: 12,
      label: 'Every 12 Hours',
    },
    {
      value: 24,
      label: 'Every 24 Hours',
    },
  ]

  // const formikRef = useRef();

  // useEffect(() => {
  //   if (formikRef.current) {
  //     formikRef.current.resetForm();
  //   }
  // }, [props.activeSec])

  useEffect(() => {
    if (Object.keys(props.profile.data).length > 0) {
      console.log('setInitNotication', !!props.profile.data.new_likes)
      setInitNotification({
        new_likes: props.profile.data.new_likes,
        new_likes_period: props.profile.data.new_likes_period,
        new_referral: props.profile.data.new_referral,
        new_subscriber: props.profile.data.new_subscriber,
        new_tip: props.profile.data.new_tip,
        renewal: props.profile.data.renewal,
        new_posts: props.profile.data.new_posts,
        new_posts_period: props.profile.data.new_posts_period,
        new_stream: props.profile.data.new_stream,
        new_message: props.profile.data.new_message,
        new_message_period: props.profile.data.new_message_period,
      })
    }
  }, [props.profile.data])

  const handleSubmit = (values) => {
    console.log('handleSubmit', values);
    props.dispatch(saveEmailNotificationStart(values));
  };

  return (
    <>
      <div className="new-settings-sec new-change-password">
        <div className="new-settings-box">
          <SettingsSidebar />
          <div className="new-settings-main-wrapper">
            <div className="new-changes-password-box">
              <div className="settings-personal-info-card">
                <div className="settings-personal-info-header">
                  <h3>Email Notification</h3>
                  <p>Get emails to find out what's going on when you're not on Wickedfans.</p>
                </div>

                {Object.keys(initNotication).length > 0 && (
                  <div className="">
                    <Formik
                      initialValues={{ ...initNotication }}
                      onSubmit={(values) => handleSubmit(values)}
                    >
                      {({ errors, touched, setFieldValue, resetForm, handleChange, values, initialValues }) => (
                        <FORM noValidate className="edit-profile-form">
                          {props.profile.data.is_content_creator === 2 && 
                            <>
                              <Row>
                                <Col xl={6}>
                                  <div className="mt-4 mb-4">
                                    <h3>Related to you and your posts</h3>
                                    <hr />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl={6}>
                                  <div className="form-check form-check-inline mb-4">
                                    <Field
                                      type="checkbox"
                                      name="new_likes"
                                      className={`no-padding form-check-input`}
                                      id="new_likes"
                                      style={{ width: 22, height: 22, marginRight: 8 }}
                                      onChange={event => setFieldValue('new_likes', event.target.checked ? 1 : 0)}
                                    />
                                    <Form.Label className="form-check-label" htmlFor="new_likes" style={{ marginBottom: 0 }}>New Likes Summary</Form.Label>
                                  </div>
                                  <div className="mb-4">
                                    <Form.Control 
                                      as="select" 
                                      name="new_likes_period" 
                                      defaultValue={values.new_likes_period} 
                                      onChange={handleChange}
                                    >
                                      {selectOptions.map((option, idx) => 
                                        <option
                                          key={idx}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      )}
                                    </Form.Control>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl={6}>
                                  <div className="form-check form-check-inline mb-4">
                                    <Field
                                      type="checkbox"
                                      name="new_referral"
                                      className={`no-padding form-check-input`}
                                      id="new_referral"
                                      style={{ width: 22, height: 22, marginRight: 8 }}
                                      onChange={event => setFieldValue('new_referral', event.target.checked ? 1 : 0)}
                                    />
                                    <Form.Label className="form-check-label" htmlFor="new_referral" style={{ marginBottom: 0 }}>New Referral</Form.Label>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl={6}>
                                  <div className="form-check form-check-inline mb-4">
                                    <Field
                                      type="checkbox"
                                      name="new_subscriber"
                                      className={`no-padding form-check-input`}
                                      id="new_subscriber"
                                      style={{ width: 22, height: 22, marginRight: 8 }}
                                      onChange={event => setFieldValue('new_subscriber', event.target.checked ? 1 : 0)}
                                    />
                                    <Form.Label className="form-check-label" htmlFor="new_subscriber" style={{ marginBottom: 0 }}>New Subscriber</Form.Label>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl={6}>
                                  <div className="form-check form-check-inline mb-4">
                                    <Field
                                      type="checkbox"
                                      name="new_tip"
                                      className={`no-padding form-check-input`}
                                      id="new_tip"
                                      style={{ width: 22, height: 22, marginRight: 8 }}
                                      onChange={event => setFieldValue('new_tip', event.target.checked ? 1 : 0)}
                                    />
                                    <Form.Label className="form-check-label" htmlFor="new_tip" style={{ marginBottom: 0 }}>New Tip</Form.Label>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl={6}>
                                  <div className="form-check form-check-inline mb-4">
                                    <Field
                                      type="checkbox"
                                      name="renewal"
                                      className={`no-padding form-check-input`}
                                      id="renewal"
                                      style={{ width: 22, height: 22, marginRight: 8 }}
                                      onChange={event => setFieldValue('renewal', event.target.checked ? 1 : 0)}
                                    />
                                    <Form.Label className="form-check-label" htmlFor="renewal" style={{ marginBottom: 0 }}>Renewal</Form.Label>
                                  </div>
                                </Col>
                              </Row>
                            </>
                          }

                          <Row>
                            <Col xl={6}>
                              <div className="mt-4 mb-4">
                                <h3>Subscriptions and following</h3>
                                <hr />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col xl={6}>
                              <div className="form-check form-check-inline mb-4">
                                <Field
                                  type="checkbox"
                                  name="new_posts"
                                  className={`no-padding form-check-input`}
                                  id="new_posts"
                                  style={{ width: 22, height: 22, marginRight: 8 }}
                                  onChange={event => setFieldValue('new_posts', event.target.checked ? 1 : 0)}
                                />
                                <Form.Label className="form-check-label" htmlFor="new_posts" style={{ marginBottom: 0 }}>New Posts Summary</Form.Label>
                              </div>
                              <div className="mb-4">
                                <Form.Control 
                                  as="select" 
                                  name="new_posts_period" 
                                  defaultValue={values.new_posts_period} 
                                  onChange={handleChange}
                                >
                                  {selectOptions.map((option, idx) => 
                                    <option
                                      key={idx}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  )}
                                </Form.Control>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col xl={6}>
                              <div className="form-check form-check-inline mb-4">
                                <Field
                                  type="checkbox"
                                  name="new_stream"
                                  className={`no-padding form-check-input`}
                                  id="new_stream"
                                  style={{ width: 22, height: 22, marginRight: 8 }}
                                  onChange={event => setFieldValue('new_stream', event.target.checked ? 1 : 0)}
                                />
                                <Form.Label className="form-check-label" htmlFor="new_stream" style={{ marginBottom: 0 }}>New Stream</Form.Label>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col xl={6}>
                              <div className="mt-4 mb-4">
                                <h3>New messages</h3>
                                <hr />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col xl={6}>
                              <div className="form-check form-check-inline mb-4">
                                <Field
                                  type="checkbox"
                                  name="new_message"
                                  className={`no-padding form-check-input`}
                                  id="new_message"
                                  style={{ width: 22, height: 22, marginRight: 8 }}
                                  onChange={event => setFieldValue('new_message', event.target.checked ? 1 : 0)}
                                />
                                <Form.Label className="form-check-label" htmlFor="new_message" style={{ marginBottom: 0 }}>New Private Message Summary</Form.Label>
                              </div>
                              <div className="mb-4">
                                <Form.Control 
                                  as="select" 
                                  name="new_message_period" 
                                  defaultValue={values.new_message_period} 
                                  onChange={handleChange}
                                >
                                  {selectOptions.map((option, idx) => 
                                    <option
                                      key={idx}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  )}
                                </Form.Control>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={12} xs={12} md={12}>
                              <div className="settings-btn-sec">
                                <Button
                                  className="settings-submit-btn"
                                  type="submit"
                                  // disabled={props.changePassword.buttonDisable}
                                >
                                  {props.changePassword.loadingButtonContent != null
                                    ? props.changePassword.loadingButtonContent
                                    : t('submit')}
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </FORM>
                      )}
                    </Formik>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToPros = (state) => ({
  profile: state.users.profile,
  changePassword: state.changePassword,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToPros, mapDispatchToProps)(translate(EmailNotification));

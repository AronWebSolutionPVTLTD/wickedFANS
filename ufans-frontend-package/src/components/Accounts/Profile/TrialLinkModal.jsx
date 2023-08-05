import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import {
    Button,
    Modal,
    Form,
} from "react-bootstrap";
import { saveTrialLinkOptionStart } from "../../../store/actions/UserAction";

const TrialLinkModal = (props) => {
    const [inputData, setInputData] = useState({});
    const [skip, setSkip] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        props.dispatch(saveTrialLinkOptionStart(inputData));
    };

    useEffect(() => {
        if (!skip && !props.saveTrialLinkOption.loading) {
            setSkip(true);
            props.closeModal();
        } else {
            setSkip(false);
        }
    }, [props.saveTrialLinkOption]);

    return (
        <>
            <Modal
                centered
                size="lg"
                className=""
                show={props.trialLink}
                onHide={props.closeModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t("free_trial_link")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="trial-link-modal-body">
                        <Form className="" method="post">
                            <div>
                                <Form.Group controlId="formBasicName" className="">
                                    <Form.Control
                                        type="text"
                                        controlId="linkName"
                                        className="form-control"
                                        placeholder="Trial link name"
                                        required
                                        name="linkName"
                                    />
                                </Form.Group>
                            </div>
                            <div className="trial-link-modal-offer">
                                <Form.Group controlId="offerLimit">
                                    <Form.Control
                                        as="select"
                                        controlId="offerLimit"
                                        className="form-control"
                                        style={{ marginRight: "10px" }}
                                        required
                                        name="offerLimit"
                                        onChange={(event) => {
                                            setInputData({
                                                ...inputData,
                                                offerLimit: event.currentTarget.value,
                                            });
                                        }}
                                    >
                                        <option value="0">No limits</option>
                                        <option value="1">1 subscriber</option>
                                        <option value="2">2 subscribers</option>
                                        <option value="3">3 subscribers</option>
                                        <option value="4">4 subscribers</option>
                                        <option value="5">5 subscribers</option>
                                        <option value="6">6 subscribers</option>
                                        <option value="7">7 subscribers</option>
                                        <option value="8">8 subscribers</option>
                                        <option value="9">9 subscribers</option>
                                        <option value="10">10 subscribers</option>
                                        <option value="50">50 subscribers</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="offerExpiration">
                                    <Form.Control
                                        as="select"
                                        controlId="offerExpiration"
                                        className="form-control"
                                        required
                                        name="offerExpiration"
                                        onChange={(event) => {
                                            setInputData({
                                                ...inputData,
                                                offerExpiration: event.currentTarget.value,
                                            });
                                        }}
                                    >
                                        <option value="0">No expiration</option>
                                        <option value="1">1 day</option>
                                        <option value="2">2 days</option>
                                        <option value="3">3 days</option>
                                        <option value="4">4 days</option>
                                        <option value="5">5 days</option>
                                        <option value="6">6 days</option>
                                        <option value="7">7 days</option>
                                        <option value="8">8 days</option>
                                        <option value="9">9 days</option>
                                        <option value="10">10 days</option>
                                        <option value="11">11 days</option>
                                        <option value="12">12 days</option>
                                        <option value="13">13 day</option>
                                        <option value="14">14 days</option>
                                        <option value="15">15 days</option>
                                        <option value="16">16 days</option>
                                        <option value="17">17 days</option>
                                        <option value="18">18 days</option>
                                        <option value="19">19 days</option>
                                        <option value="20">20 days</option>
                                        <option value="21">21 days</option>
                                        <option value="22">22 days</option>
                                        <option value="23">23 days</option>
                                        <option value="24">24 days</option>
                                        <option value="25">25 days</option>
                                        <option value="26">26 days</option>
                                        <option value="27">27 days</option>
                                        <option value="28">28 days</option>
                                        <option value="29">29 days</option>
                                        <option value="30">30 days</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div>
                                <Form.Group controlId="duration" className="">
                                    <Form.Control
                                        as="select"
                                        controlId="freeTrialDuration"
                                        className="form-control"
                                        required
                                        name="freeTrialDuration"
                                        onChange={(event) => {
                                            setInputData({
                                                ...inputData,
                                                freeTrialDuration: event.currentTarget.value,
                                            });
                                        }}
                                    >
                                        <option value="1">1 day</option>
                                        <option value="3">3 days</option>
                                        <option value="7">7 days</option>
                                        <option value="14">14 days</option>
                                        <option value="30">1 month</option>
                                        <option value="90">3 months</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div>
                                <p>{t("trial_modal_note_first")}</p>
                                <p>{t("trial_modal_note_second")}</p>
                            </div>
                            <Modal.Footer>
                                <div className="trial-link-modal-btn-sec">
                                    <Button
                                        type="button"
                                        className="trial-link-modal-btn"
                                        data-dismiss="modal"
                                        disabled={props.saveTrialLinkOption.buttonDisable}
                                        onClick={props.closeModal}
                                    >
                                        {t("cancel")}
                                    </Button>
                                </div>
                                <div className="trial-link-modal-btn">
                                    <Button
                                        type="button"
                                        className="trial-link-modal-btn"
                                        data-dismiss="modal"
                                        onClick={handleSubmit}
                                        disabled={props.saveTrialLinkOption.buttonDisable}
                                    >
                                        {props.saveTrialLinkOption.loadingButtonContent ?
                                            props.saveTrialLinkOption.loadingButtonContent :
                                            t("create_link")}
                                    </Button>
                                </div>
                            </Modal.Footer>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

const mapStateToPros = (state) => ({
    saveTrialLinkOption: state.users.saveTrialLinkOption,
});

function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(mapStateToPros, mapDispatchToProps)(translate(TrialLinkModal));

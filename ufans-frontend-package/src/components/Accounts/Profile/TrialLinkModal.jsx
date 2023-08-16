import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import {
    Button,
    Modal,
    Form,
} from "react-bootstrap";
import { saveTrialLinkOptionStart } from "../../../store/actions/UserAction";

const TrialLinkModal = (props) => {
    const [inputData, setInputData] = useState({
        offer_limit: "0",
        offer_expiration: "0",
        free_trial_duration: "1",
        is_everybody: "0"
    });
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
    }, [props.saveTrialLinkOption])

    const nullData = ["", null, undefined, "light"];
    
    return (
        <>
            <Modal
                className={`modal-dialog-center withdraw-modal 
                ${nullData.includes(localStorage.getItem("theme")) ?
                        "" : "dark-theme-modal"
                    }`}
                size="md"
                centered
                show={props.trialLink}
                onHide={props.closeModal}
            >
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <div className="trial-modal-title">
                                <h4>{t("free_trial_link")}</h4>
                            </div>
                            <div className="trial-modal-body-first">
                                <input
                                    className="floating-input"
                                    type="text"
                                    placeholder={t("trial_link_name")}
                                    required
                                    name="linkName"
                                    onChange={(event) => {
                                        setInputData({
                                            ...inputData,
                                            link_name: event.currentTarget.value,
                                        });
                                    }}
                                />
                            </div>
                            <div className="trial-modal-body-second">
                                <div className="trial-modal-body-second-limit">
                                    <label for="offerLimit">Offer limit</label>
                                    <select
                                        id="offerLimit"
                                        className="floating-input"
                                        style={{ marginRight: "10px" }}
                                        required
                                        name="offerLimit"
                                        onChange={(event) => {
                                            setInputData({
                                                ...inputData,
                                                offer_limit: event.currentTarget.value,
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
                                    </select>
                                </div>
                                <div className="trial-modal-body-second-expiration">
                                    <label>Offer expiration</label>
                                    <select
                                        className="floating-input"
                                        required
                                        name="offerExpiration"
                                        onChange={(event) => {
                                            setInputData({
                                                ...inputData,
                                                offer_expiration: event.currentTarget.value,
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
                                    </select>
                                </div>
                            </div>
                            <div className="trial-modal-body-third">
                                <label>Free trial duration</label>
                                <select
                                    className="floating-input"
                                    required
                                    name="freeTrialDuration"
                                    onChange={(event) => {
                                        setInputData({
                                            ...inputData,
                                            free_trial_duration: event.currentTarget.value,
                                        });
                                    }}
                                >
                                    <option value="1">1 day</option>
                                    <option value="3">3 days</option>
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="30">1 month</option>
                                    <option value="90">3 months</option>
                                </select>
                            </div>
                            <div className="trial-modal-body-fourth">
                                <select
                                    className="floating-input"
                                    required
                                    name="isEverybody"
                                    onChange={(event) => {
                                        setInputData({
                                            ...inputData,
                                            is_everybody: event.currentTarget.value,
                                        });
                                    }}
                                >
                                    <option value="0">For new fans</option>
                                    <option value="1">For everybody</option>
                                </select>
                            </div>
                            <div className="trial-modal-body-des">
                                <p>{t("trial_modal_note_first")}</p>
                                <p>{t("trial_modal_note_second")}</p>
                            </div>
                        </Modal.Body>
                        <div className="trial-modal-footer">
                            <button className="createBtn" onClick={handleSubmit}>
                                {t("create_link")}
                            </button>
                            <button
                                className="cancelBtn"
                                onClick={() => props.setTrialLink(false)}
                            >
                                {t("modal_cancel")}
                            </button>
                        </div>
                    </Form>
            </Modal>
        </>
    );
};

const mapStateToPros = (state) => ({
    profile: state.users.profile,
    saveTrialLinkOption: state.users.saveTrialLinkOption,
});

function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(mapStateToPros, mapDispatchToProps)(translate(TrialLinkModal));
import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import GlobalAddIcon from "@assets/images/globalAdd.svg";
import shareAnonymous from "@assets/images/shareAnonymous.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";

import Loader from "@src/common/Loader";
import ContactItem from "@src/models/ContactItem";
import ConfirmationModal from "@src/common/ConfirmationModal";
import { GoalItem } from "@src/models/GoalItem";
import { themeState } from "@src/store/ThemeState";
import { confirmAction } from "@src/Interfaces/IPopupModals";
import { shareGoalWithContact } from "@src/services/contact.service";
import { displayAddContact, displayShareModal } from "@src/store/GoalsState";
import { darkModeState, displayToast, displayConfirmation } from "@src/store";
import { checkAndUpdateRelationshipStatus, getAllContacts } from "@src/api/ContactsAPI";
import { getGoal, getAllLevelGoalsOfId, shareMyGoalAnonymously, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";

import AddContactModal from "./AddContactModal";
import "./ShareGoalModal.scss";
import Icon from "../../../common/Icon";

const ShareGoalModal = ({ goal }: { goal: GoalItem }) => {
  const minContacts = 3;
  const navigate = useNavigate();
  const { state } = useLocation();
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showShareModal = useRecoilValue(displayShareModal);

  const [loading, setLoading] = useState({ P: false, A: false, S: false });
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [displaySubmenu, setDisplaySubmenu] = useState("");
  const [showConfirmation, setDisplayConfirmation] = useRecoilState(displayConfirmation);
  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);
  const [showAddContactModal, setShowAddContactModal] = useRecoilState(displayAddContact);

  const setShowToast = useSetRecoilState(displayToast);
  const handleShowAddContact = () => {
    navigate("/MyGoals", { state: { ...state, displayAddContact: true } });
  };

  const getContactBtn = (relId = "", name = "", accepted = false) => (
    <div className="contact-icon">
      <button
        type="button"
        style={name === "" || accepted ? {} : { background: "#DFDFDF", color: "#979797" }}
        onClick={async (e) => {
          e.stopPropagation();
          setLoading({ ...loading, S: true });
          if (name === "") handleShowAddContact();
          else {
            const status = accepted ? true : await checkAndUpdateRelationshipStatus(relId);
            if (goal.typeOfGoal === "myGoal" && status) {
              const goalWithChildrens = await getAllLevelGoalsOfId(goal.id, true);
              await shareGoalWithContact(relId, [
                ...goalWithChildrens.map((ele) => ({
                  ...ele,
                  participants: [],
                  parentGoalId: ele.id === goal.id ? "root" : ele.parentGoalId,
                  rootGoalId: ele.id === goal.id ? "root" : goal.id,
                })),
              ]);
              setShowToast({ open: true, message: `Cheers!!, Your goal is shared with ${name}`, extra: "" });
              updateSharedStatusOfGoal(goal.id, relId, name).then(() => console.log("status updated"));
            } else {
              navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
              setShowToast({
                open: true,
                message: "Link copied to clipboard",
                extra: `Your invite hasn't been accepted yet. Send this link to ${name} so that they can add you in their contacts`,
              });
            }
          }
          setLoading({ ...loading, S: false });
        }}
      >
        {name === "" ? <img alt="add contact" className="global-addBtn-img" width={25} src={GlobalAddIcon} /> : name[0]}
      </button>
      {name !== "" && <p style={{ margin: 0 }}>{name}</p>}
    </div>
  );

  const handleActionClick = async (action: string) => {
    if (action === "shareAnonymously") {
      let parentGoalTitle = "root";
      setLoading({ ...loading, A: true });
      if (goal.parentGoalId !== "root") {
        parentGoalTitle = (await getGoal(goal.parentGoalId))?.title || "";
      }
      const { response } = await shareMyGoalAnonymously(goal, parentGoalTitle);
      setShowToast({ open: true, message: response, extra: "" });
      setLoading({ ...loading, A: false });
    } else if (action === "shareWithOne") {
      setDisplaySubmenu("contacts");
      if (contacts.length === 0) {
        handleShowAddContact();
      }
    }
    setConfirmationAction(null);
  };

  const openConfirmationPopUp = async (action: confirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "collaboration" && showConfirmation.collaboration[actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...showConfirmation, open: true });
    } else if (actionCategory === "goal" && showConfirmation.goal[action.actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...showConfirmation, open: true });
    } else {
      await handleActionClick(actionName);
    }
  };
  useEffect(() => {
    (async () => {
      const userContacts = await getAllContacts();
      setContacts([...userContacts]);
    })();
  }, [showAddContactModal]);
  return (
    <Modal
      open={!!showShareModal}
      closable={false}
      footer={null}
      centered
      style={showAddContactModal ? { zIndex: 1 } : {}}
      onCancel={() => window.history.back()}
      className={`share-modal${darkModeStatus ? "-dark" : ""} popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"
        }-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      {confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} />}
      <p className="popupModal-title">{displaySubmenu === "groups" ? "Share in Public Group" : "Share Goals"}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Share Anonymously */}
        <button
          onClick={async () => {
            await openConfirmationPopUp({ actionCategory: "goal", actionName: "shareAnonymously" });
          }}
          type="button"
          className="shareOptions-btn"
        >
          <div className="share-Options">
            {loading.A ? (
              <Loader />
            ) : (
              <div className="icon">
                <Icon active={true} title="SingleAvatar" />
                {/* <img className="secondary-icon" alt="share goal pseudo anonymously" src={shareAnonymous} /> */}
              </div>
            )}
            <p className={`shareOption-name ${loading.A ? "loading" : ""}`}>Share pseudo anonymously</p>
          </div>
        </button>

        {/* Share 1:1 */}
        <button
          disabled={goal.typeOfGoal !== "myGoal"}
          type="button"
          onClick={async () => {
            if (displaySubmenu !== "contacts")
              await openConfirmationPopUp({ actionCategory: "goal", actionName: "shareWithOne" });
          }}
          className="shareOptions-btn"
        >
          <div className="share-Options">
            {loading.S ? (
              <Loader />
            ) : (
              <div className="icon">
                <Icon active={true} title="TwoAvatars" />

              </div>
            )}
            <p className={`shareOption-name ${loading.S ? "loading" : ""}`}>Share privately</p>
          </div>
          {goal.typeOfGoal === "myGoal" && displaySubmenu === "contacts" && (
            <div className="shareWithContacts">
              {contacts.length === minContacts && (
                <p className="share-warning">
                  You don&apos;t have a contact yet.
                  <br />
                  Add one!
                </p>
              )}
              {contacts.length >= minContacts && (
                <p className="share-warning">
                  Don&apos;t Worry. <br /> We will soon allow our users to add more than 1 contact
                </p>
              )}
              <div
                id="modal-contact-list"
                style={contacts.length <= minContacts ? { justifyContent: "flex-start" } : {}}
              >
                {contacts.length > 0 &&
                  contacts
                    .slice(0, Math.min(minContacts, contacts.length))
                    .map((ele) => getContactBtn(ele.relId, ele.name, ele.accepted))}
                {contacts.length < minContacts && getContactBtn()}
              </div>
            </div>
          )}
        </button>
      </div>
      {showAddContactModal && (
        <AddContactModal showAddContactModal={showAddContactModal} setShowAddContactModal={setShowAddContactModal} />
      )}
    </Modal>
  );
};

export default ShareGoalModal;

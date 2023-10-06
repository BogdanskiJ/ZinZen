import { atom } from "recoil";
import { confirmActionState } from "@src/Interfaces/IPopupModals";
import { PartnerItem } from "@src/models/PartnerItem";
import { darkModeState } from "./DarkModeState";
import { languageSelectionState } from "./LanguageSelectionState";

export const displayConfirmation = atom({
  key: "displayConfirmation",
  default: JSON.parse(
    localStorage.getItem("confirmationState") ||
      JSON.stringify({
        open: false,
        goal: {
          archive: true,
          delete: true,
          shareAnonymously: true,
          shareWithOne: true,
        },
        collaboration: {
          colabRequest: true,
          delete: true,
          archive: true,
        },
      }),
  ) as confirmActionState,
});

export const lastAction = atom({
  key: "lastAction",
  default: "",
});

export const searchActive = atom({
  key: "searchActive",
  default: false,
});

export const backupRestoreModal = atom({
  key: "backupRestoreModal",
  default: false,
});

export const languageChangeModal = atom({
  key: "languageChangeModal",
  default: false,
});

export const displayLoader = atom({
  key: "displayLoader",
  default: false as boolean,
});

export const displayFromOptions = atom({
  key: "displayFromOptions",
  default: { archive: false, public: false },
});

export const displayInbox = atom({
  key: "displayInbox",
  default: false,
});

export const openInbox = atom({
  key: "openInbox",
  default: false as boolean,
});

export const displayToast = atom({
  key: "displayToast",
  default: { open: false, message: "Awww... no hints today. We'll keep looking!", extra: "" },
});

export const openDevMode = atom({
  key: "openDevMode",
  default: false,
});

export const displayPartnerMode = atom({
  key: "displayPartnerMode",
  default: false,
});

export const selectedMyTimeView = atom({
  key: "selectedMyTimeView",
  default: "today",
});

export const currentScheduledTask = atom({
  key: "currentScheduledTask",
  default: "",
});

export const focusTaskTitle = atom({
  key: "focusTaskTitle",
  default: "No Task Scheduled",
});

export { darkModeState, languageSelectionState };

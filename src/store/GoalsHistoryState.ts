// @ts-nocheck
import { ITags } from "@src/Interfaces/ITagExtractor";
import { atom, selector } from "recoil";

export interface ISubGoalHistory {
  goalID: number,
  goalColor: string,
  goalTitle: string,
}

export const displaySuggestionsModal = atom({
  key: "displaySuggestionsModal",
  default: false as boolean
});

export const displayAddGoalOptions = atom({
  key: "displayAddGoalOptions",
  default: false as boolean
});

export const inputGoalTags = atom({
  key: "inputGoalTags",
  default: {} as ITags
})

export const extractedTitle = atom({
  key: "extractedTitle",
  default: "" as string
})  

export const displayGoalId = atom({
  key: "displayGoalId",
  default: -1 as number
});
export const displayAddGoal = atom({
  key: "displayAddGoal",
  default: null as {open: boolean, goalId: number} | null
});
export const displayUpdateGoal = atom({
  key: "displayUpdateGoal",
  default: null as {open: boolean, goalId: number} | null
});
export const goalsHistory = atom({
  key: "goalsHistory",
  default: [] as ISubGoalHistory[],
});

export const addInGoalsHistory = selector({
  key: "addGoalInGoalsHistory",
  get: ({ get }) => get(goalsHistory),
  set: ({ get, set }, goal) => {
    set(goalsHistory, [...get(goalsHistory), ({
      goalID: goal.id || -1,
      goalColor: goal.goalColor || "#ffffff",
      goalTitle: goal.title || "",
    })]);
    set(displayGoalId, goal.id || -1);
  }
});

export const resetGoalsHistory = selector({
  key: "resetGoalsHistory",
  get: ({ get }) => get(goalsHistory),
  set: ({ set }) => {
    set(goalsHistory, []);
    set(displayGoalId, -1);
  }
});

export const popFromGoalsHistory = selector({
  key: "popFromGoalsHistory",
  get: ({ get }) => get(goalsHistory),
  set: ({ get, set }, index) => {
    if (get(displayAddGoal)?.open) {
      set(displayAddGoal, null);
    } else if (get(displayUpdateGoal)?.open) {
      set(displayUpdateGoal, null);
    } else {
      const currentState = get(goalsHistory).slice(0, index === -1 ? -1 : index + 1);
      if (currentState.length === 0) {
        set(displayGoalId, -1);
        set(displayAddGoal, null);
        set(displayUpdateGoal, null);
      } else {
        const item = currentState.slice(-1)[0];
        set(displayGoalId, item.goalID);
      }
      set(goalsHistory, [...currentState]);
    }
  }
});


import { addGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { colorPalleteList } from "@src/utils";

export const addStarterGoal = async (
  goalTitle: string,
  goalTags: {
    id: string | null;
    duration: string | null;
    afterTime: number | null;
    beforeTime: number | null;
    sublist?: string[];
    parentGoalId?: string;
  },
  colorIndex: number,
) => {
  await addGoal(
    createGoalObjectFromTags({
      title: goalTitle,
      ...goalTags,
      goalColor: colorPalleteList[colorIndex],
    }),
  );
};
export const starterGoals = [
  {
    title: "Sleep 😴🌙",
    goalTags: {
      id: "sleep",
      afterTime: 22,
      beforeTime: 7,
      timeBudget: {
        perDay: "6-8",
        perWeek: "42-52",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "Hobby project 🚂🚋",
    goalTags: {
      id: "hobbyProject",
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-4",
        perWeek: "1-4",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "House chores 🏡🧹🛠️",
    goalTags: {
      id: "houseChores",
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-3",
        perWeek: "1-3",
      },
      on: ["Sat", "Sun"],
    },
  },
  {
    title: "Family time 🥰",
    goalTags: {
      id: "familyTime",
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-6",
        perWeek: "10-10",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "Work 💪🏽",
    goalTags: {
      id: "work",
      afterTime: 6,
      beforeTime: 18,
      timeBudget: {
        perDay: "6-10",
        perWeek: "40-40",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    title: "Daily habits 🔁",
    goalTags: {
      id: "dailyHabits",
      afterTime: null,
      beforeTime: null,
      timeBudget: {
        perDay: null,
        perWeek: null,
      },
      on: [],
      sublist: ["breakfast", "lunch", "dinner", "meTime", "walk"],
    },
  },
  {
    title: "Walk🚶🏽",
    goalTags: {
      id: "walk",
      afterTime: 6,
      beforeTime: 21,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: "dailyHabits",
    },
  },
  {
    title: "Me time 🧘🏽😌",
    goalTags: {
      id: "meTime",
      afterTime: 5,
      beforeTime: 23,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: "dailyHabits",
    },
  },
  {
    title: "Dinner 🍽️",
    goalTags: {
      id: "dinner",
      afterTime: 18,
      beforeTime: 20,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: "dailyHabits",
    },
  },
  {
    title: "Lunch 🥪",
    goalTags: {
      id: "lunch",
      afterTime: 12,
      beforeTime: 14,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: "dailyHabits",
    },
  },
  {
    title: "Breakfast 🥐🥣",
    goalTags: {
      id: "breakfast",
      afterTime: 6,
      beforeTime: 9,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: "dailyHabits",
    },
  },
];

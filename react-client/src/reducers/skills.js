import {ADD_SKILL, CREATE_SKILL_ERRORS, NEW_SKILL_LOADING, SET_SKILLS} from "../actions/actionTypes";

export const skills = (state = [], action) => {
  switch (action.type) {
    case SET_SKILLS:
      return action.payload;

    case ADD_SKILL:
      return [...state, action.payload];

    default:
      return state;
  }
};

export const newSkillLoading = (state = false, action) => {
  switch (action.type) {
    case NEW_SKILL_LOADING:
      return action.payload;

    default:
      return state;
  }
};

export const createSkillErrors = (state = {}, action) => {
  switch (action.type) {
    case CREATE_SKILL_ERRORS:
      return action.payload;

    default:
      return state;
  }
};
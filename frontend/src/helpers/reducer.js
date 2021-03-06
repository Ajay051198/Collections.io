export const initialState = {
  modal: false,
  form: null,
  id: null,
  prefill_data: {},
  refresh: true,
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "CLOSE_MODAL":
      document.querySelector("#root").classList.remove("blur");
      return {
        ...state,
        modal: false,
      };
    case "REFRESH":
      return {
        ...state,
        refresh: action.refresh,
      };
    case "OPEN_FORM":
      document.querySelector("#root").classList.add("blur");
      return {
        ...state,
        modal: true,
        form: action.form,
        id: action.id,
        prefill_data: action.prefill_data,
      };
    default:
      return state;
  }
};

export default reducer;

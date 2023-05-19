import { ActionTypes } from "../types";

const INITIAL_STATE = {
  acc: "Connect Wallet",
  isWalletConnect: false,
};

const connectReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.CONNECT:
      return {
        ...state,
        acc: action.payload.myAcc,
        isWalletConnect: action.payload.isWalletConnect,
      };
    default:
      return state;
  }
};
export default connectReducer;

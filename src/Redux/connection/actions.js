import { loadWeb3 } from "../../api";
import { ActionTypes } from "../types";

export const connectionAction = () => {
  return async (dispatch) => {
    let acc = await loadWeb3();
    let myAcc;
    let isWalletConnect = false;
    if (acc === "No Wallet") {
      myAcc = "No Wallet";
    } else if (acc === "Wrong Network") {
      myAcc = "Wrong Network";
    } else {
      myAcc = acc;
      isWalletConnect = true;
    }
    await dispatch({
      type: ActionTypes.CONNECT,
      payload: { myAcc: myAcc, isWalletConnect: isWalletConnect },
    });
  };
};

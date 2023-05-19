import { useDispatch, useSelector } from "react-redux";
import { connectionAction } from "../Redux/connection/actions";

const useConnectButton = () => {
  const dispatch = useDispatch();
  // let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  const { acc, isWalletConnect } = useSelector((state) => state.connect);

  const connectWallet = () => {
    dispatch(connectionAction());
  };
  return { acc, connectWallet };
};

export default useConnectButton;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Withdraw.css";
import withdraw from "../../assets/images/virtual_card 1.png";
import info from "../../assets/images/Vector (6).png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { contractAddress, contractAddressAbi } from "../utils/contractaddress";
import { etaTokenAbi, etaTokenAddress } from "../utils/etaToken";
import { connectionAction } from "../../Redux/connection/actions";
import Web3 from "web3";
const web3Supply = new Web3("https://bsc-dataseed1.binance.org/");
const rpcUrl = new Web3("https://data-seed-prebsc-2-s2.binance.org:8545");

const Withdraw = () => {
  const { t, i18n } = useTranslation();
  const [etaAmount, setEtaAmount] = useState(0);
  const [reinvestAmount, setReinvestAmount] = useState(0);
  const [etaBal, setEtaBal] = useState(0);
  let [reinvestmentBtn, setreinvestmentBtn] = useState({
    text: "Reinvest REGETA",
    isDisable: true,
  });
  let [withdrawBtn, setwithdrawBtn] = useState({
    text: `${t("WithdrawETA")}`,
    isDisable: true,
  });
  let { acc, isWalletConnect } = useSelector((state) => state.connect);
  // let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  useEffect(() => {
    if (!isWalletConnect) {
      setwithdrawBtn({ ...withdrawBtn, text: `${t("WithdrawETA")}` });
    } else {
      getEtaToken();
    }
  }, [i18n.language]);

  const dispatch = useDispatch();
  const connectWallet = () => {
    dispatch(connectionAction());
  };
  const getEtaToken = async () => {
    try {
      if (
        acc != "No Wallet" &&
        acc != "Wrong Network" &&
        acc != "Connect Wallet"
      ) {
        const web3 = window.web3;
        const token = new web3.eth.Contract(etaTokenAbi, etaTokenAddress);
        let bal = await token.methods.balanceOf(acc).call();
        bal = web3.utils.fromWei(bal);
        console.log("bal", bal);
        if (bal > 0) {
          setReinvestAmount(bal);
          setreinvestmentBtn({ text: "Reinvest REGETA", isDisable: false });
        } else {
          setreinvestmentBtn({ text: "Insufficient Balance", isDisable: true });
        }
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let etaWithdrawAmount = await contract.methods
          .getETAWithdraw(acc)
          .call();
        etaWithdrawAmount = Number(web3.utils.fromWei(etaWithdrawAmount));
        if (etaWithdrawAmount > 0) {
          setEtaAmount(etaWithdrawAmount);
          setwithdrawBtn({ text: `${t("WithdrawETA")}`, isDisable: false });
        } else {
          setwithdrawBtn({
            text: `${t("insufficientAmount")}`,
            isDisable: true,
          });
        }
      }
    } catch (e) {
      console.error("Error While Buying Tokens", e);
    }
  };
  useEffect(() => {
    getEtaToken();
  }, [acc]);
  const WithdrawETA = async () => {
    try {
      const web3 = window.web3;
      let contract = new web3.eth.Contract(contractAddressAbi, contractAddress);
      setwithdrawBtn({ text: "Waiting..", isDisable: true });
      await contract.methods.userWithdrawETAToken().send({
        from: acc,
      });
      getEtaToken();
      connectWallet();
    } catch (error) {
      setwithdrawBtn({ text: `${t("WithdrawETA")}`, isDisable: false });
      console.error("error while withdraw eta", error);
    }
  };
  const reinvestEta = async () => {
    try {
      if (acc == "No Wallet") {
        toast.info("No Wallet");
      } else if (acc == "Wrong Network") {
        toast.info("Wrong Wallet");
      } else if (acc == "Connect Wallet") {
        toast.info(t("connectWallet"));
      } else {
        if (reinvestAmount > 0 && reinvestAmount != "") {
          const web3 = window.web3;
          const token = new web3.eth.Contract(etaTokenAbi, etaTokenAddress);
          let bal = await token.methods.balanceOf(acc).call();
          bal = Number(web3.utils.fromWei(bal));
          if (reinvestAmount <= bal) {
            const contract = new web3.eth.Contract(
              contractAddressAbi,
              contractAddress
            );
            const round = await contract.methods.round().call();
            if (round > 1) {
              setreinvestmentBtn({ text: "Waiting...", isDisable: true });
              await token.methods
                .approve(contractAddress, web3.utils.toWei(reinvestAmount))
                .send({
                  from: acc,
                });
              await contract.methods
                .reinvestETAToken(web3.utils.toWei(reinvestAmount))
                .send({
                  from: acc,
                });
              getEtaToken();
              connectWallet();
              setreinvestmentBtn({ text: "Reinvest REGETA", isDisable: false });
            } else {
              toast.error("Round must be greater then 2");
            }
          } else {
            toast.error("Your balance is less");
          }
        }
      }
    } catch (error) {
      setreinvestmentBtn({ text: "Reinvest REGETA", isDisable: false });
      console.error("error while reinvest", error);
    }
  };
  return (
    <div>
      <>
        <div className="container col-xxl-12 py-md-4 py-4  text-primay_globle">
          <div className="col-12 col-md-12 col-xxl-12">
            <h1 className="display-4 ">{t("Withdraw")}</h1>
          </div>
          <div className="row d-flex align-items-center flex-md-row-reverse">
            <div className="col-12 col-md-7 col-xxl-7 my-md-4 my-2 text-center ">
              <div className="d-flex justify-content-end align-items-center px-lg-5  py-4">
                <img className="img-fluid" src={withdraw} alt="Commission" />
              </div>
            </div>
            <div className="col-12 col-md-5 col-xxl-5 my-md-4 my-2 text-start sec_z_index1">
              <div className="container USDT_Purchase px-lg-5  py-4">
                <h4 className="text-center ">{t("etaWithdraw")}</h4>
                <div className="">
                  <h6 className=" small text-start">{t("Youwillget")}</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={
                        acc === "Connect Wallet"
                          ? "0.00 ETA"
                          : etaAmount + " ETA"
                      }
                      readOnly
                    />
                  </div>
                </div>

                <div className="row d-flex text-center">
                  <div className="col-12 col-md-12 col-xxl-12 my-md-2 my-2">
                    <div
                      className={
                        isWalletConnect && !withdrawBtn.isDisable
                          ? ""
                          : "is-disabled"
                      }
                    >
                      <button
                        className="btn btn btn-outline Withdraw_button py-2 px-5"
                        style={{ width: 100 + "%" }}
                        type="button"
                        onClick={WithdrawETA}
                      >
                        {withdrawBtn.text}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row d-flex text-center align-items-center">
                  <div className="col-12 col-md-12 col-xxl-12 my-md-2 my-2">
                    <div className="text-start text-color-info">
                      <img className="img-fluid" src={info} alt="info" />
                      {/* <i
                        className="fa fa-info-circle"
                        style={{ fontSize: 20 }}
                      /> */}

                      <span className="small ms-2">
                        {t("withdrawlNotification")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Withdraw;

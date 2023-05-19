import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "./Registor.css";
import { useTranslation } from "react-i18next";
import { contractAddress, contractAddressAbi } from "../utils/contractaddress";

const Registor = () => {
  const { t, i18n } = useTranslation();
  const [ref, setRef] = useState("0x000000000000000000000000");
  const [refLink, setRefLink] = useState(`${window.location.href}`);
  const [checkDeposit, setCheckDeposit] = useState(false);
  let { acc, isWalletConnect } = useSelector((state) => state.connect);
  const refaddress = async () => {
    const web3 = window.web3;
    try {
      if (acc === "No Wallet") {
        console.log("No Wallet");
      } else if (acc === "Wrong Network") {
        console.log("Wrong Wallet");
      } else if (acc === "Connect Wallet") {
        // toast.info("Connect Wallet");
        console.log("Connect Wallet");
      } else {
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let defaultReferral = await contract.methods.defaultRefer().call();
        let locationHref = window.location.href.includes("referrallink=");
        let refDeposit = await contract.methods.userInfo(acc).call();
        let deposit = refDeposit.totalDeposit;

        if (deposit >= 0) {
          setRefLink(`${window.location.origin}?referrallink=${acc}`);
        } else {
          setRefLink(
            `${window.location.origin}?referrallink=${defaultReferral}`
          );
        }
      }
    } catch (e) {
      console.log("Error", e);
    }
  };
  const referral = async () => {
    const web3 = window.web3;
    try {
      if (acc == "No Wallet") {
        toast.info("No Wallet");
      } else if (acc == "Wrong Network") {
        toast.info("Wrong Wallet");
      } else if (acc == "Connect Wallet") {
        console.log("Connect Wallet");
      } else {
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let defaultReferral = await contract.methods.defaultRefer().call();
        let locationHref = window.location.href.includes("referrallink=");
        if (locationHref) {
          let locationLink = window.location.href.split("referrallink=");
          setRef(locationLink[1]);
          setCheckDeposit(true);
        } else {
          setRef(defaultReferral);
          setCheckDeposit(false);
        }
      }
    } catch (e) {
      console.log("Error", e);
    }
  };
  const handleRegisterReferral = (e) => {
    setRef(e);
  };
  const handleRegister = async () => {
    try {
      if (acc == "No Wallet") {
        toast.info("Not Connected");
      } else if (acc == "Wrong Network") {
        toast.info("Wrong Network");
      } else if (acc == "Connect Wallet") {
        toast.info("Not Connected");
        console.log("knock knock");
      } else {
        const web3 = window.web3;
        const contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let defaultReferral = await contract.methods.defaultRefer().call();
        let { referrer } = await contract.methods.userInfo(acc).call();
        if (referrer != "0x0000000000000000000000000000000000000000") {
          toast.error("You are already register");
        } else if (ref === defaultReferral) {
          await contract.methods.register(ref).send({ from: acc });
          toast.success("Successfully Registered");
        } else {
          let refDeposit = await contract.methods.userInfo(ref).call();
          let deposit = refDeposit.totalDeposit;
          if (parseFloat(deposit) > 0) {
            await contract.methods.register(ref).send({ from: acc });
            toast.success("Successfully Registered");
          } else {
            toast.error("Your Referral address is not applicable");
          }
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Registration Failed!");
    }
  };
  useEffect(() => {
    referral();
    refaddress();
  }, [acc]);
  return (
    <div>
      <>
        <div className="container col-xxl-12 py-5 text-primay_globle">
          <div className="row">
            <div className="col-12 col-md-4 col-xxl-4 my-md-4 my-2 text-start">
              <h6 className="text-start">{t("walletAddress")}</h6>
              <div className="d-flex my-3 input_style">
                {/* <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder={isWalletConnect ? acc : t("connectWallet")}
                  readOnly
                /> */}
                <textarea
                  className="form-control form-control-lg shadow-none text-warp"
                  placeholder={isWalletConnect ? acc : t("connectWallet")}
                  readOnly
                  style={{
                    textAlign: "center",
                    textJustify: "center",
                    resize: "none",
                    overflow: "auto",
                    // height: "120px",
                    whiteSpace: "pre-wrap",
                  }}
                />
                <button
                  className="btn btn-outline copy"
                  onClick={() => {
                    window.location.reload();
                    toast.info("Refreshed");
                  }}
                >
                  <i className="fa fa-copyright" style={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
            <div className="col-12 col-md-4 col-xxl-4 my-md-4 my-2 text-center">
              <h6 className="text-start">{t("referralLink")}</h6>
              <div className="d-flex my-3 input_style">
                {/* <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder={refLink}
                  readOnly
                  style={{ overflow: "auto", height: "130px" }}
                /> */}
                <textarea
                  className="form-control form-control-lg shadow-none text-warp"
                  placeholder={refLink}
                  readOnly
                  style={{
                    textAlign: "center",
                    textJustify: "center",
                    resize: "none",
                    overflow: "auto",
                    height: "135px",
                    whiteSpace: "pre-wrap",
                  }}
                />
                <button
                  className="btn btn-outline copy"
                  onClick={() => {
                    navigator.clipboard.writeText(refLink);
                    toast.info("copied");
                  }}
                >
                  <i className="fa fa-clone" style={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
            <div className="col-12 col-md-4 col-xxl-4 my-md-4 my-2 text-end">
              <h6 className="text-start">{t("introducerAddress")}</h6>
              <div className="d-flex my-3 input_style">
                {/* <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder={ref}
                  value={ref}
                  onChange={(e) => {
                    handleRegisterReferral(e.target.value);
                  }}
                /> */}
                <textarea
                  className="form-control form-control-lg shadow-none text-warp"
                  placeholder={ref}
                  value={ref}
                  onChange={(e) => {
                    handleRegisterReferral(e.target.value);
                  }}
                  style={{
                    display: "flex",
                    textAlign: "center",
                    textJustify: "center",
                    resize: "none",
                    overflow: "auto",
                    // height: "60px",
                    width: "100%",
                    whiteSpace: "pre-wrap",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row d-flex text-center">
            <div className="col-12 col-md-12 col-xxl-12 my-md-4 my-2">
              <div className="">
                <button
                  className="btn registor_button py-2 px-5"
                  onClick={handleRegister}
                >
                  {t("Register")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Registor;

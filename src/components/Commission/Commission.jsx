import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Commission.css";
import commission from "../../assets/images/digital_wallet (1) 1.png";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { contractAddress, contractAddressAbi } from "../utils/contractaddress";
import { connectionAction } from "../../Redux/connection/actions";
const Commission = () => {
  const { t, i18n } = useTranslation();
  const [refLevel, setRefLevel] = useState([]);
  const [commissionInfo, setCommissionInfo] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCommEarn, setTotalComEarn] = useState([
    {
      txid: "0",
      usdtValue: "0",
      usdaceValue: "0",
    },
  ]);

  const { acc } = useSelector((state) => state.connect);
  // let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  const dispatch = useDispatch();
  const connectWallet = () => {
    dispatch(connectionAction());
  };
  const ReferralLevel = async () => {
    const web3 = window.web3;
    try {
      if (acc === "No Wallet") {
        console.log("No Wallet");
      } else if (acc === "Wrong Network") {
        console.log("Wrong Wallet");
      } else if (acc === "Connect Wallet") {
        console.log("Connect Wallet");
      } else {
        setIsLoading(true);
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let counts = [];
        for (let level = 1; level <= 10; level++) {
          let count = await contract.methods.userCount(acc, level).call();

          let arr = [];
          for (let i = 1; i <= count; i++) {
            let obj = {};
            let refferralAddress = await contract.methods
              .userReferral(acc, level, i)
              .call();
            let totalUSDACESpent = await contract.methods
              .totalUSDACESpent(refferralAddress)
              .call();
            totalUSDACESpent = Number(
              web3.utils.fromWei(totalUSDACESpent)
            ).toLocaleString();
            let totalUSDTSpent = await contract.methods
              .totalUSDTSpent(refferralAddress)
              .call();
            totalUSDTSpent = Number(
              web3.utils.fromWei(totalUSDTSpent)
            ).toLocaleString();

            obj.refferralAddress = refferralAddress;
            obj.totalUSDACESpent = totalUSDACESpent;
            obj.totalUSDTSpent = totalUSDTSpent;
            arr.push(obj);
          }
          counts.push(arr);
        }
        setRefLevel(counts);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  const commissionDetail = async () => {
    const web3 = window.web3;
    try {
      if (acc === "No Wallet") {
        console.log("No Wallet");
      } else if (acc === "Wrong Network") {
        console.log("Wrong Wallet");
      } else if (acc === "Connect Wallet") {
        console.log("Connect Wallet");
      } else {
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let { 0: usdt, 1: usdac } = await contract.methods
          .TotalClaimed(acc)
          .call();
        let arr = [];
        arr.push(Number(web3.utils.fromWei(usdt)).toLocaleString());
        arr.push(Number(web3.utils.fromWei(usdac)).toLocaleString());
        setCommissionInfo(arr);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const userWithdraw = async () => {
    const web3 = window.web3;
    try {
      console.log(commissionInfo[0] === 0);
      if (acc === "No Wallet") {
        toast.info(t("connectWallet"));
      } else if (acc === "Wrong Network") {
        toast.info(t("connectWallet"));
      } else if (acc === "Connect Wallet") {
        toast.info(t("connectWallet"));
      } else {
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let commission;
        if (commissionInfo[0] == 0 && commissionInfo[1] == 0) {
          toast.info("Your Commission is 0");
        } else {
          let maxWithdrwa = await contract.methods.maxWithdraw(acc).call();
          maxWithdrwa = Number(web3.utils.fromWei(maxWithdrwa));
          let { 0: usdt } = await contract.methods.TotalClaimed(acc).call();
          let totalUSDTCommission = await contract.methods
            .totalUSDTCommission(acc)
            .call();
          totalUSDTCommission = Number(web3.utils.fromWei(totalUSDTCommission));
          let total = totalUSDTCommission + Number(web3.utils.fromWei(usdt));
          if (total <= maxWithdrwa) {
            commission = await contract.methods
              .claimedCommission()
              .send({ from: acc });
            commissionDetail();
            connectWallet();
          } else {
            toast.error("your commission limit have exceded");
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const getTotalCommEarn = async () => {
      try {
        const web3 = window.web3;
        if (acc == "No Wallet") {
          console.log("No Wallet");
        } else if (acc == "Wrong Network") {
          console.log("Wrong Wallet");
        } else if (acc == "Connect Wallet") {
          console.log("Connect Wallet");
        } else {
          const contract = new web3.eth.Contract(
            contractAddressAbi,
            contractAddress
          );
          let totalEarned = await contract.methods.totalEarned(acc).call();
          console.log("totalEarned", totalEarned._TotalUSDACEEarned);
          setTotalComEarn({
            usdtValue: web3.utils.fromWei(totalEarned._TotalUSDTEarned),
            usdaceValue: web3.utils.fromWei(totalEarned._TotalUSDACEEarned),
          });
        }
      } catch (e) {
        console.log("Error", e);
      }
    };
    getTotalCommEarn();
  }, [acc]);
  useEffect(() => {
    ReferralLevel();
    commissionDetail();
  }, [acc]);
  return (
    <div>
      <>
        <div
          id="commission"
          className="container col-xxl-12 py-md-4 py-4 text-primay_globle"
        >
          <div className="col-12 col-md-12 col-xxl-12">
            <h1 className="display-4 ">{t("commission")}</h1>
          </div>
          <div className="row d-flex align-items-center flex-md-row-reverse">
            <div className="col-12 col-md-7 col-xxl-7 my-md-4 my-2 text-center ">
              <div className="d-flex justify-content-end align-items-center px-lg-5 py-4">
                <img className="img-fluid" src={commission} alt="Commission" />
              </div>
            </div>
            <div className="col-12 col-md-5 col-xxl-5 my-md-4 my-2 text-start sec_z_index">
              <div className="container commission_boxs px-lg-5  py-4">
                <h4 className="text-center ">{t("referral")}</h4>
                <div className="">
                  <h6 className=" text-start">USDT</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={
                        acc === "Connect Wallet"
                          ? "0.00 USDT"
                          : commissionInfo[0] + " USDT"
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="">
                  <h6 className=" text-start">USDACE$</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={
                        acc === "Connect Wallet"
                          ? "0.00 USDACE$"
                          : commissionInfo[1] + " USDACE$"
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="row d-flex text-center">
                  <div className="col-12 col-md-12 col-xxl-12 my-md-2 my-2">
                    <div className="">
                      <button
                        className="btn btn btn-outline Withdraw_com_button py-2 px-5"
                        style={{ width: 100 + "%" }}
                        type="button"
                        onClick={() => {
                          userWithdraw();
                        }}
                      >
                        {t("withdrawCommission")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container commission_boxs mt-4 px-lg-5  py-4">
                <h4 className="text-center mb-4 ">{t("totalCommissionEar")}</h4>
                <div className="d-flex mb-3">
                  <div className="col-6 col-md-6 col-xxl-6 mx-lg-2">
                    <h6 className=" text-center">USDT</h6>
                    <div className="d-flex mt-3 input_style">
                      <input
                        className="form-control form-control-lg "
                        type="number"
                        placeholder={
                          acc === "Connect Wallet"
                            ? "0.00 $"
                            : totalCommEarn.usdtValue + " $"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-6 col-md-6 col-xxl-6 mx-lg-2">
                    <h6 className=" text-center">USDACE$</h6>
                    <div className="d-flex mt-3 input_style">
                      <input
                        className="form-control form-control-lg"
                        type="number"
                        placeholder={
                          acc === "Connect Wallet"
                            ? "0.00 $"
                            : totalCommEarn.usdaceValue + " $"
                        }
                        readOnly
                      />
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

export default Commission;

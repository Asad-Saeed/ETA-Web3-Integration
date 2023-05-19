import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./WithdrawHistory.css";
import { dummydata } from "../../data/dummydata";
import { contractAddress, contractAddressAbi } from "../utils/contractaddress";
import { usdtTokenAdd, usdtTokenAbi } from "../utils/contractUsdtToken";
import {
  usdaceTokenAdd,
  usdaceTokenAddAbi,
} from "../utils/contractUsdaceToken";
import { useTranslation } from "react-i18next";

const WithdrawHistory = () => {
  const { t, i18n } = useTranslation();
  const [wHistory, setwHistory] = useState([]);
  const [widthrawData, setWidthrawData] = useState([]);
  const [totalUSDTEarn, setTotalUSDTEarn] = useState(0);
  const [commissionHistory, setCommissionHistory] = useState([]);
  let { acc } = useSelector((state) => state.connect);
  // let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  // Total commission EARNED
  const totalCommissionEarn = async () => {
    const web3 = window.web3;
    try {
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
        const commissionHistory = await contract.methods
          .TotalUSDTEarned(acc)
          .call();
        setCommissionHistory(commissionHistory);
        console.log("Commission history:", commissionHistory);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };
  const WithdrawHistory = async () => {
    try {
      if (acc === "No Wallet") {
        console.log("No Wallet");
      } else if (acc === "Wrong Network") {
        console.log("Wrong Wallet");
      } else if (acc === "Connect Wallet") {
        console.log("Connect Wallet");
      } else {
        const web3 = window.web3;
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let count = await contract.methods.w_count(acc).call();
        console.log("Count=", count);
        let widthrawDetails = [];

        for (let i = 0; i < count; i++) {
          let obj = {};
          let usdt = await contract.methods
            .withdrawHistoryOfUSDT(acc, i)
            .call();
          let usAce = await contract.methods
            .withdrawHistoryOfUSDACE(acc, i)
            .call();
          let time = await contract.methods.withdrawHistoryTime(acc, i).call();
          obj.usdt = Number(web3.utils.fromWei(usdt));
          obj.usAce = Number(web3.utils.fromWei(usAce));
          // obj.date = new Date(time *1000).toLocaleDateString()
          obj.txId = acc;
          widthrawDetails.push(obj);
        }
        setWidthrawData(widthrawDetails);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    WithdrawHistory();
    totalCommissionEarn();
  }, [acc]);
  return (
    <div>
      <>
        <div className="container col-md-10 col-lg-10 col-xxl-12 py-md-4 py-4 text-primay_globle">
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-12 col-md-12 col-xxl-12">
              <h1 className="display-4 ">{t("withdrawHistory")}</h1>
            </div>
            <div className="col-12 col-md-12 col-xxl-12 my-md-4 my-2 text-start">
              <div className=" withdraw_history_boxs  px-lg-5 px-1  py-4">
                <div className="" style={{ overflow: "auto", height: "50vh" }}>
                  <table className="table table-borderless  text-center">
                    <thead>
                      <tr>
                        <th scope="col" className="col-3 fw-semibold th_color">
                          No.
                        </th>
                        <th scope="col" className="col-3 fw-semibold th_color">
                          USD
                        </th>
                        <th scope="col" className="col-3 fw-semibold th_color">
                          USDACE$
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {widthrawData.map((data, index) => (
                        <tr key={index} className="row_style">
                          <td className="border_radius_left">{index + 1}.</td>
                          <td>{data.usdt}$</td>
                          <td className="border_radius_right">{data.usAce}$</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default WithdrawHistory;

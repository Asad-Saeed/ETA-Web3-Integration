import React, { useEffect, useState } from "react";
import "./MyPortfolio.css";
import { useSelector } from "react-redux";
import { dummydata } from "../../data/dummydata";
import { contractAddress, contractAddressAbi } from "../utils/contractaddress";
import { useTranslation } from "react-i18next";

import Web3 from "web3";
import PortfolioTable from "./PortfolioTable";
const web3Supply = new Web3("https://bsc-dataseed1.binance.org/");

const MyPortfolio = () => {
  const { t, i18n } = useTranslation();
  const [roundNumber, setRoundNumber] = useState(0);
  const [spentUsd, setSpentUsd] = useState(0);
  const [receivedUsdt, setReceivedUsdt] = useState(0);
  const [etaBal, setEtaBal] = useState(0);
  let { acc } = useSelector((state) => state.connect);
  // let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  const usdSpend = async () => {
    const web3 = window.web3;
    try {
      if (acc == "No Wallet") {
        console.log("No Wallet");
      } else if (acc == "Wrong Network") {
        console.log("Wrong Wallet");
      } else if (acc == "Connect Wallet") {
        // toast.info("Connect Wallet");
        console.log("Connect Wallet");
      } else {
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let ceheckBalance = await contract.methods.checkbalance(acc).call();
        ceheckBalance = Number(
          web3.utils.fromWei(ceheckBalance)
        ).toLocaleString();
        setEtaBal(ceheckBalance);
        let totalUsd = await contract.methods.TotalUSDSpent(acc).call();
        console.log("totalUsd", totalUsd);
        totalUsd = Number(web3.utils.fromWei(totalUsd)).toLocaleString();
        setSpentUsd(totalUsd);
      }
    } catch (e) {
      console.log("Error While Buying Tokens", e);
    }
  };
  const usdtReceived = async () => {
    const web3 = window.web3;
    try {
      if (acc == "No Wallet") {
        console.log("No Wallet");
      } else if (acc == "Wrong Network") {
        console.log("Wrong Wallet");
      } else if (acc == "Connect Wallet") {
        // toast.info("Connect Wallet");
        console.log("Connect Wallet");
      } else {
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        const round = contract.methods.round().call();
        let sum = 0;
        for (let index = 2; index <= round; index++) {
          for (let j = 0; j <= index - 2; j++) {
            let countSell = await contract.methods.countSell(acc, j).call();
            for (let i = 0; i < countSell; i++) {
              let buyToken = await contract.methods
                .buyerSellTotalToken(acc, index, j, i)
                .call();
              let price = await contract.methods
                .userSellPrice(acc, j, i)
                .call();
              let val =
                Number(web3.utils.fromWei(buyToken)) *
                Number(web3.utils.fromWei(price));
              sum = sum + val;
            }
          }
        }
        setReceivedUsdt((sum * 70) / 100);
      }
    } catch (e) {
      console.log("Error While Buying Tokens", e);
    }
  };
  const getData = async () => {
    try {
      let contract = new web3Supply.eth.Contract(
        contractAddressAbi,
        contractAddress
      );
      let roundNo = await contract.methods.round().call();

      setRoundNumber(roundNo);
    } catch (e) {
      console.log("Error While Buying Tokens", e);
    }
  };
  useEffect(() => {
    usdSpend();
    usdtReceived();
  }, [acc]);
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <>
        <div
          id="Portfolio"
          className="container col-md-10 col-lg-10 col-xxl-12 py-md-4 py-4  text-primay_globle"
        >
          <div className="row d-flex align-items-center justify-content-center">
            <div className="col-12 col-md-12 col-xxl-12">
              <h1 className="display-4 ">{t("myportfolio")}</h1>
            </div>
            <div className="col-8 col-md-8 col-xxl-8 my-2">
              <div className="row">
                <div className="col-12 col-md-4 col-xxl-4 my-md-4  text-start">
                  <h6 className=" fw-normal text-center">
                    {t("totlaEtaPurchased")}
                  </h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={
                        acc === "Connect Wallet" ? "$ 0.00" : "$ " + etaBal
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 col-xxl-4 my-md-4  text-center">
                  <h6 className=" fw-normal text-center">
                    {t("totalUsdSpent")}
                  </h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={
                        acc === "Connect Wallet" ? "$ 0.00" : "$ " + spentUsd
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-12 col-md-4 col-xxl-4 my-md-4  text-end">
                  <h6 className=" fw-normal text-center">
                    {t("totalUsdtEarned")}
                  </h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={
                        acc === "Connect Wallet"
                          ? "$ 0.00"
                          : "$ " + receivedUsdt
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 col-xxl-12 my-md-4 my-2 mb-md-5 text-start">
              <PortfolioTable />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default MyPortfolio;

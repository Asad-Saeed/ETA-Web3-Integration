import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./Purchase.css";
import { useTranslation } from "react-i18next";
import { contractAddress, contractAddressAbi } from "../utils/contractaddress";
import { usdtTokenAdd, usdtTokenAbi } from "../utils/contractUsdtToken";
import {
  usdaceTokenAdd,
  usdaceTokenAddAbi,
} from "../utils/contractUsdaceToken";
import { etaTokenAbi, etaTokenAddress } from "../utils/etaToken";
import Web3 from "web3";
import { connectionAction } from "../../Redux/connection/actions";
const web3Supply = new Web3("https://bsc-dataseed1.binance.org/");
const rpcUrl = new Web3("https://data-seed-prebsc-2-s2.binance.org:8545");

const Purchase = () => {
  const { t, i18n } = useTranslation();
  const [usdtUnit, setUsdtUnit] = useState(0);
  const [usdtCost, setusdtCost] = useState(0);
  const [usdaceUnit, setUsdaceUnit] = useState(0);
  let [usdaceBtn, setUsdaceBtn] = useState({
    text: `${t("buyEta")}`,
    isDisable: true,
  });
  let [usdtBtn, setUsdtBtn] = useState({
    text: `${t("buyEta")}`,
    isDisable: true,
  });
  const [usdaceCost, setusdaceCost] = useState(0);
  const [roundNumber, setRoundNumber] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [etaBalance, setEtaBalance] = useState(null);
  let { acc, isWalletConnect } = useSelector((state) => state.connect);
  const dispatch = useDispatch();
  const connectWallet = () => {
    dispatch(connectionAction());
  };
  useEffect(() => {
    setUsdtBtn({ ...usdtBtn, text: `${t("buyEta")}` });
    setUsdaceBtn({ ...usdaceBtn, text: `${t("buyEta")}` });
  }, [i18n.language]);
  const token = async () => {
    try {
      let contract = new web3Supply.eth.Contract(
        contractAddressAbi,
        contractAddress
      );
      if (usdtUnit == 0 || usdtUnit == "") {
        setusdtCost(0);
        setUsdtBtn({ text: `${t("buyEta")}`, isDisable: true });
      } else {
        const round = await contract.methods.round().call();
        let maxDeposit = 0;
        if (round < 2) {
          maxDeposit = await contract.methods.maxDeposit().call();
        } else {
          maxDeposit = await contract.methods.maxToken().call();
        }
        maxDeposit = web3Supply.utils.fromWei(maxDeposit);
        let minDeposit = await contract.methods.minDeposit().call();
        minDeposit = web3Supply.utils.fromWei(minDeposit);
        if (
          Number(usdtUnit) >= Number(minDeposit) &&
          Number(usdtUnit) <= Number(maxDeposit)
        ) {
          let value = web3Supply.utils.toWei(usdtUnit);

          let checkinput = await contract.methods.checkPrice(value).call();

          let valueCost = web3Supply.utils.fromWei(checkinput);
          setusdtCost(valueCost);
          if (isWalletConnect) {
            const web3 = window.web3;
            const usdaceToken = new web3.eth.Contract(
              usdtTokenAbi,
              usdtTokenAdd
            );
            let balOfUsdace = await usdaceToken.methods.balanceOf(acc).call();
            balOfUsdace = web3.utils.fromWei(balOfUsdace);

            if (parseFloat(balOfUsdace) > parseFloat(valueCost)) {
              setUsdtBtn({ text: `${t("buyEta")}`, isDisable: false });
            } else {
              setUsdtBtn({ text: "Insufficent USDT", isDisable: true });
            }
          } else {
            setUsdtBtn({ text: `${t("buyEta")}`, isDisable: true });
          }
        } else {
          setUsdtBtn({
            text: `Enter your Value  ${minDeposit} to ${maxDeposit}`,
            isDisable: true,
          });
        }
      }
    } catch (e) {
      console.error("Error While Buying Tokens", e);
    }
  };

  const usdAceToken = async () => {
    try {
      let contract = new web3Supply.eth.Contract(
        contractAddressAbi,
        contractAddress
      );
      if (usdaceUnit == 0 || usdaceUnit == "") {
        setusdaceCost(0);
        setUsdaceBtn({ text: `${t("buyEta")}`, isDisable: true });
      } else {
        const round = await contract.methods.round().call();
        let maxDeposit = 0;
        if (round < 2) {
          maxDeposit = await contract.methods.maxDeposit().call();
        } else {
          maxDeposit = await contract.methods.maxToken().call();
        }
        maxDeposit = web3Supply.utils.fromWei(maxDeposit);
        let minDeposit = await contract.methods.minDeposit().call();
        minDeposit = web3Supply.utils.fromWei(minDeposit);
        if (
          Number(usdaceUnit) >= Number(minDeposit) &&
          Number(usdaceUnit) <= Number(maxDeposit)
        ) {
          let valueUsd = web3Supply.utils.toWei(usdaceUnit);
          let checkinputUsdace = await contract.methods
            .checkPrice(valueUsd)
            .call();
          let valueUsdace = web3Supply.utils.fromWei(checkinputUsdace);
          setusdaceCost(valueUsdace);
          if (isWalletConnect) {
            const web3 = window.web3;
            const usdaceToken = new web3.eth.Contract(
              usdaceTokenAddAbi,
              usdaceTokenAdd
            );
            let balOfUsdace = await usdaceToken.methods.balanceOf(acc).call();
            balOfUsdace = web3.utils.fromWei(balOfUsdace);
            console.log("balOfUsdace", balOfUsdace);
            if (parseFloat(balOfUsdace) > parseFloat(valueUsdace)) {
              setUsdaceBtn({ text: `${t("buyEta")}`, isDisable: false });
            } else {
              setUsdaceBtn({ text: "Insufficent USDACE", isDisable: true });
            }
          } else {
            setUsdaceBtn({ text: `${t("buyEta")}`, isDisable: true });
          }
        } else {
          setUsdaceBtn({
            text: `Enter your Value  ${minDeposit} to ${maxDeposit}`,
            isDisable: true,
          });
        }
      }
    } catch (e) {
      setUsdaceBtn({ text: `${t("buyEta")}`, isDisable: true });
      console.error("Error While Buying Tokens", e);
    }
  };

  const buyUsdt = async () => {
    const web3 = window.web3;
    try {
      if (acc == "No Wallet") {
        toast.info("No Wallet");
      } else if (acc == "Wrong Network") {
        toast.info("Wrong Wallet");
      } else if (acc == "Connect Wallet") {
        toast.info(t("connectWallet"));
      } else {
        let usdtToken = new web3.eth.Contract(usdtTokenAbi, usdtTokenAdd);
        let balOfUsdt = await usdtToken.methods.balanceOf(acc).call();
        balOfUsdt = web3.utils.fromWei(balOfUsdt);
        if (parseFloat(balOfUsdt) >= parseFloat(usdtCost)) {
          let contract = new web3.eth.Contract(
            contractAddressAbi,
            contractAddress
          );
          let { referrer } = await contract.methods.userInfo(acc).call();
          if (referrer != "0x0000000000000000000000000000000000000000") {
            let costValue = web3.utils.toWei(usdtCost);
            setUsdtBtn({ text: "Waiting...", isDisable: true });
            await usdtToken.methods
              .approve(contractAddress, costValue)
              .send({ from: acc });
            let unitValue = web3.utils.toWei(usdtUnit);
            await contract.methods
              .buy(usdtTokenAdd, costValue, unitValue)
              .send({ from: acc });
            priceOrderData();
            getData();
            connectWallet();
            setUsdtBtn({ text: `${t("buyEta")}`, isDisable: false });
            setUsdtUnit(0);
            toast.info(t("txSuccess"));
          } else {
            toast.info("You have not registered.");
          }
        } else {
          toast.info("You have insufficient USDT balance!");
        }
      }
    } catch (e) {
      setUsdtBtn({ text: `${t("buyEta")}`, isDisable: false });
      console.error("Error While Buying Tokens", e);
    }
  };

  const buyUsdace = async () => {
    const web3 = window.web3;
    try {
      if (acc == "No Wallet") {
        toast.info("No Wallet");
      } else if (acc == "Wrong Network") {
        toast.info("Wrong Wallet");
      } else if (acc == "Connect Wallet") {
        toast.info(t("connectWallet"));
      } else {
        let usdaceToken = new web3.eth.Contract(
          usdaceTokenAddAbi,
          usdaceTokenAdd
        );
        let balOfUsdace = await usdaceToken.methods.balanceOf(acc).call();
        balOfUsdace = web3.utils.fromWei(balOfUsdace);
        if (parseFloat(balOfUsdace) >= parseFloat(usdaceCost)) {
          let contract = new web3.eth.Contract(
            contractAddressAbi,
            contractAddress
          );
          let { referrer } = await contract.methods.userInfo(acc).call();
          if (referrer != "0x0000000000000000000000000000000000000000") {
            let costValue = web3.utils.toWei(usdaceCost);
            setUsdaceBtn({ text: "Waiting...", isDisable: true });
            await usdaceToken.methods
              .approve(contractAddress, costValue)
              .send({ from: acc });
            let unitValue = web3.utils.toWei(usdaceUnit);
            console.log("costValue, unitValue", costValue, unitValue);
            await contract.methods
              .buy(usdaceTokenAdd, costValue, unitValue)
              .send({ from: acc });
            getData();
            priceOrderData();
            setUsdaceUnit(0);
            connectWallet();
            setUsdaceBtn({ text: `${t("buyEta")}`, isDisable: true });
            toast.info(t("txSuccess"));
          } else {
            toast.info("You have not registered.");
          }
        } else {
          toast.info("You have insufficient USDACE balance!");
        }
      }
    } catch (e) {
      setUsdaceBtn({ text: `${t("buyEta")}`, isDisable: false });
      console.error("Error While Buying Tokens", e);
    }
  };
  const getData = async () => {
    try {
      let contract = new web3Supply.eth.Contract(
        contractAddressAbi,
        contractAddress
      );
      let minDeposit = await contract.methods.minDeposit().call();
      let curPrice = await contract.methods.checkPrice(minDeposit).call();
      setCurrentPrice(Number(web3Supply.utils.fromWei(curPrice)).toFixed(4));

      let roundNo = await contract.methods.round().call();
      setCurrentPage(Number(roundNo) + 1);
      setRoundNumber(Number(roundNo) + 1);
    } catch (e) {
      console.error("Error While Buying Tokens", e);
    }
  };
  let [isLoding, setIsLoading] = useState(true);
  const priceOrderData = async () => {
    try {
      if (
        acc != "No Wallet" &&
        acc != "Wrong Network" &&
        acc != "Connect Wallet"
      ) {
        setIsLoading(true);
        const web3 = window.web3;
        const etaContract = new web3.eth.Contract(etaTokenAbi, etaTokenAddress);
        let userEtaBal = await etaContract.methods.balanceOf(acc).call();
        setEtaBalance(Number(web3.utils.fromWei(userEtaBal)));
      }
    } catch (e) {
      setIsLoading(false);
      console.error("Error While Buying Tokens", e);
    }
  };

  useEffect(() => {
    token();
  }, [usdtUnit, isWalletConnect]);

  useEffect(() => {
    usdAceToken();
  }, [usdaceUnit, isWalletConnect]);
  useEffect(() => {
    priceOrderData();
  }, [acc, currentPage]);
  useEffect(() => {
    getData();
    // setInterval(() => {
    // }, 1000);
  }, [acc]);
  return (
    <div>
      <>
        <div
          id="whatiseta"
          className="container col-xxl-12 py-md-4 text-primay_globle"
        >
          <div className="row">
            <div className="col-12 col-md-2 col-xxl-2 my-md-4 my-2 d-flex flex-column justify-content-center align-item-center hidden_on_large_screen">
              <div className=" px-lg-5  py-4 text-center d-md-block d-flex justify-content-between p-5 p-md-0">
                <div className="text-center mb-md-5">
                  <h6>{t("round")}</h6>
                  <h1>{roundNumber}</h1>
                </div>
                <div className="text-center">
                  <h6>{t("currentPrice")}</h6>
                  <h1>{currentPrice}</h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-xxl-5 my-md-4 my-2 text-start">
              <div className="container USDT_Purchase px-lg-5  py-4">
                <h4 className="text-center ">{t("USDTPurchase")}</h4>
                <div className="">
                  <h6 className=" text-start">ETA</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder="0.00"
                      value={usdtUnit}
                      onChange={(e) => setUsdtUnit(e.target.value)}
                    />
                  </div>
                </div>
                <div className="">
                  <h6 className=" text-start">{t("cost")}</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={`${usdtCost} USDT`}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row d-flex text-center">
                  <div className="col-12 col-md-12 col-xxl-12 my-md-2 my-2">
                    <div
                      className={
                        isWalletConnect && !usdtBtn.isDisable
                          ? "disabled"
                          : "is-disabled"
                      }
                    >
                      <button
                        className="btn Buy_eta_button py-2 px-5"
                        type="button"
                        onClick={buyUsdt}
                      >
                        {usdtBtn.text}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-2 col-xxl-2 my-md-4 my-2 d-flex flex-column justify-content-center align-item-center hidden_on_mobile">
              <div className=" px-lg-5  py-4 text-center d-md-block d-flex justify-content-between p-5 p-md-0">
                <div className="text-center mb-md-5">
                  <h6>{t("round")}</h6>
                  <h1>{roundNumber}</h1>
                </div>
                <div className="text-center">
                  <h6>{t("currentPrice")}</h6>
                  <h1>{currentPrice}</h1>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 col-xxl-5 my-md-4 my-2 text-start">
              <div className="container USDT_Purchase px-lg-5  py-4">
                <h4 className="text-center ">{t("USDACE$Purchase")}</h4>
                <div className="">
                  <h6 className=" text-start">ETA</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder="0.00"
                      value={usdaceUnit}
                      onChange={(e) => setUsdaceUnit(e.target.value)}
                    />
                  </div>
                </div>
                <div className="">
                  <h6 className=" text-start">{t("cost")}</h6>
                  <div className="d-flex my-3 input_style">
                    <input
                      className="form-control form-control-lg"
                      type="number"
                      placeholder={`${usdaceCost} USDACE$`}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row d-flex text-center">
                  <div className="col-12 col-md-12 col-xxl-12 my-md-2 my-2">
                    <div
                      className={
                        isWalletConnect && !usdaceBtn.isDisable
                          ? "disabled"
                          : "is-disabled"
                      }
                    >
                      <button
                        className="btn Buy_eta_button py-2 px-5"
                        type="button"
                        onClick={buyUsdace}
                      >
                        {usdaceBtn.text}
                      </button>
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

export default Purchase;

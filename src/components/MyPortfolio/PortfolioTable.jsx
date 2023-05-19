import "./MyPortfolio.css";
import React, { useState, useRef, useEffect } from "react";
import Pagination from "../../paginations/pagination";
import { useSelector } from "react-redux";
import { contractAddressAbi, contractAddress } from "../utils/contractaddress";
import { useTranslation } from "react-i18next";

import Web3 from "web3";
const web3Supply = new Web3("https://bsc-dataseed1.binance.org/");

const PortfolioTable = () => {
  const { t, i18n } = useTranslation();
  let PageSize = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [priceOrder, setPriceOrder] = useState([]);
  const [roundNumber, setRoundNumber] = useState(null);

  let shouldLog = useRef(true);
  let currentBlock = 50;
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
    }
  }, [currentPage]);
  let { acc, isWalletConnect } = useSelector((state) => state.connect);
  //   let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  let [totalRound, setTotalRound] = useState(null);
  const getRound = async () => {
    try {
      if (
        acc != "No Wallet" &&
        acc != "Wrong Network" &&
        acc != "Connect Wallet"
      ) {
        const web3 = window.web3;
        const contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        const round = await contract.methods.round().call();
        setTotalRound(Number(round) + 1);
      }
    } catch (error) {
      console.error("error while get round", error);
    }
  };
  useEffect(() => {
    getRound();
  }, [totalRound, isWalletConnect]);
  const [roundDetail, setRoundDetail] = useState([]);
  let [loadData, setIsLoadData] = useState(true);
  const getRoundDetial = async () => {
    try {
      if (
        acc != "No Wallet" &&
        acc != "Wrong Network" &&
        acc != "Connect Wallet"
      ) {
        setIsLoadData(true);
        const web3 = window.web3;
        const contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        const countSell = await contract.methods
          .countSell(acc, currentPage - 1)
          .call();
        let arr = [];
        for (let index = 0; index < countSell; index++) {
          let obj = {};
          let userSellToken = await contract.methods
            .userSellToken(acc, currentPage - 1, index)
            .call();
          if (userSellToken > 0) {
            let userSellPrice = await contract.methods
              .userSellPrice(acc, currentPage - 1, index)
              .call();
            obj.price = web3.utils.fromWei(userSellPrice);
            obj.unit = web3.utils.fromWei(userSellToken);
            obj.totalSpend =
              web3.utils.fromWei(userSellPrice) *
              web3.utils.fromWei(userSellToken);
            obj.txid = acc;
            arr.push(obj);
          }
        }
        setIsLoadData(false);
        setRoundDetail(arr);
      }
    } catch (error) {
      console.error("error while get round detail", error);
    }
  };
  useEffect(() => {
    getRoundDetial();
  }, [isWalletConnect, currentPage]);
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
        let contract = new web3.eth.Contract(
          contractAddressAbi,
          contractAddress
        );
        let roundNo = await contract.methods.round().call();
        let newdata = [];
        for (let index = 0; index < roundNo + 1; index++) {
          let { 0: token, 1: price } = await contract.methods
            .countBuyers(acc, index)
            .call();

          for (let i = 0; i < token.length; i++) {
            if (token[i] > 0) {
              let obj = {};
              obj.buytoken = Number(web3.utils.fromWei(token[i]));
              obj.buytokenprice = Number(web3.utils.fromWei(price[i]));
              obj.round = index;
              obj.txId = acc;
              newdata.push(obj);
            }
          }
        }
        setIsLoading(false);
        setPriceOrder(newdata.reverse());
      }
    } catch (e) {
      setIsLoading(false);
      console.error("Error While Buying Tokens", e);
    }
  };
  useEffect(() => {
    priceOrderData();
  }, [acc, currentPage]);
  return (
    <div>
      <div className=" withdraw_history_boxs  px-lg-5 px-1  py-4">
        <div className="" style={{ overflow: "auto", height: "50vh" }}>
          <table className="table table-borderless text-white  text-center">
            <thead>
              <tr>
                <th scope="col" className="col-3 fw-semibold th_color">
                  {t("price")}
                </th>
                <th scope="col" className="col-3 fw-semibold th_color">
                  {t("ETAToken")}
                </th>
                <th scope="col" className="col-3 fw-semibold th_color">
                  {t("round")}
                </th>
              </tr>
            </thead>

            {/* <tbody>
                      {dummydata.map((data, index) => (
                        <tr key={index} className="row_style ">
                          <td className="border_radius_left">{data.no}$</td>
                          <td className="">{data.USD}$</td>
                          <td className="border_radius_right ">
                            {data.USDACE}
                          </td>
                        </tr>
                      ))}
                    </tbody> */}
            {isWalletConnect && (
              <tbody className="text-center">
                {priceOrder.length > 0 ? (
                  priceOrder.map((item, index) => {
                    return (
                      <tr key={index} className="row_style">
                        <td>{item.buytokenprice}</td>
                        <td>{item.buytoken}</td>
                        <td>{Number(item.round) + 1}</td>
                      </tr>
                    );
                  })
                ) : isLoding ? (
                  <tr>
                    <td colSpan={2}>Loading...</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={2}>No detail found</td>
                  </tr>
                )}
              </tbody>
            )}
            {!isWalletConnect && (
              <tbody>
                <tr>
                  <td colSpan={2}>{t("connectWallet")}</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTable;

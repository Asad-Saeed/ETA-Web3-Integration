import React from "react";
import "./CompanyBrands.css";
import Metamask from "../../assets/images/MetaMask logo.png";
import Coinbase from "../../assets/images/Coinbase svg.png";
import Binance from "../../assets/images/Binance svg.png";

const CompanyBrands = () => {
  return (
    <>
      <div className="container col-xxl-12 text-primay_globle">
        <div className="row">
          <div className="col-12 col-md-4 col-xxl-4 my-4">
            <a
              href="#"
              className="text-decoration-none d-flex align-items-center justify-content-center"
            >
              <img src={Metamask} alt="social" className="me-2" />
              <h2 className="text-primay_globle">METAMASK</h2>
            </a>
          </div>
          <div className="col-12 col-md-4 col-xxl-4 my-4 text-center">
            <a href="#" className="text-decoration-none">
              {/* <img src={Coinbase} alt="social" /> */}
              <h2 className="text-primay_globle">COINBASE</h2>
            </a>
          </div>
          <div className="col-12 col-md-4 col-xxl-4 my-4 text-center">
            <a href="#">
              <img src={Binance} alt="social" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyBrands;

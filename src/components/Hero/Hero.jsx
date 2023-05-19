import React from "react";
import "./Hero.css";
import hero_image from "../../assets/images/Illustrations.png";
import Discover from "../../assets/images/ETA-token 2.png";
import social1 from "../../assets/images/Vector (1).png";
import social2 from "../../assets/images/Vector (2).png";
import social3 from "../../assets/images/Vector (3).png";
import { useTranslation } from "react-i18next";
import useConnectButton from "../../Hooks/useConnectButton";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const { acc, connectWallet } = useConnectButton();
  return (
    <div className="pt-md-5">
      <div className="container col-xxl-12 py-5">
        <div className="row align-items-center py-5">
          <div className="col-12 col-md-6 col-lg-6 text-start text-primay_globle">
            <h1 className="display-1 fw-bold lh-2 mb-3 pt-5 p-md-0">
              Disc
              <img src={Discover} alt="eta" className="discover_img" />
              ver the
              <br /> Crypto & <br />
              Blockchain
            </h1>
            {/* <p className="lead py-md-4 py-2">
              Lorem ipsum dolor sit amet consectetur. Leo pellentesque eu utamet
              pretium <br />
              aliquet. Lacus lorem vestibulum pellentesque in feugiat sed
              tincidunt sagittis nunc.
            </p> */}
            <div className=" ">
              <button
                className="btn connect_wallet_button_hero"
                onClick={connectWallet}
              >
                {acc === "No Wallet"
                  ? t("connectWallet")
                  : acc === "Connect Wallet"
                  ? t("connectWallet")
                  : acc === "Wrong Network"
                  ? acc
                  : acc.substring(0, 3) + "..." + acc.substring(acc.length - 3)}
              </button>
            </div>
            <div>
              <ul className="list-unstyled d-flex my-md-4 my-2">
                <li className="me-4">
                  <a href="#">
                    <img src={social1} alt="social" />
                  </a>
                </li>
                <li className="me-4">
                  <a href="#">
                    <img src={social2} alt="social" />
                  </a>
                </li>
                <li className="me-4">
                  <a href="#">
                    <img src={social3} alt="social" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-6 d-flex justify-content-end align-items-center text-center">
            <div>
              <img
                src={hero_image}
                className="d-block mx-lg-auto img-fluid"
                alt="hero_image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

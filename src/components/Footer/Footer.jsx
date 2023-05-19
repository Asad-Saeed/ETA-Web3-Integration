import React from "react";
import "./Footer.css";
import footer_logo from "../../assets/images/Estella-Logo-CN-120423-2.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="footer_text_color  text-primay_globle">
      <div className="container">
        <div className="row text-start">
          <div className="container">
            <div className="row">
              <div className="container mt-3">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <img src={footer_logo} alt="eta" />
                    <div className="d-flex flex-column text-start">
                      <span className="small text-primay_globle fw-semibold">
                        兆星
                      </span>
                      <span className="small text-primay_globle fw-semibold">
                        ESTRELLA TERA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="container my-md-2">
                <div className="col-12">
                  <ul className="d-md-flex list-unstyled footer_nav_list">
                    <li className="me-md-3  my-4">
                      <a className="text-decoration-none" href="#commission">
                        {t("nav_1")}
                      </a>
                    </li>
                    <li className="mx-md-3 my-4">
                      <a className="text-decoration-none" href="#Portfolio">
                        {t("nav_2")}
                      </a>
                    </li>
                    <li className="mx-md-3 my-4">
                      <a className="text-decoration-none" href="#faq">
                        {t("nav_3")}
                      </a>
                    </li>
                    <li className="mx-md-3 my-4">
                      <a className="text-decoration-none" href="#whatiseta">
                        {t("nav_4")}
                      </a>
                    </li>
                    <li className="mx-md-3 my-4">
                      <a
                        className="text-decoration-none"
                        href="#downloadfastlink"
                      >
                        {t("nav_5")}
                      </a>
                    </li>
                    <li className="mx-md-3 my-4">
                      <a
                        className="text-decoration-none"
                        href="#DownloadTPwallet"
                      >
                        {t("nav_6")}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="container mb-2 d-md-flex">
                <div className="col-md-6">
                  Privacy Policy | Terms & Conditions
                </div>
                <div className="col-md-6 text-md-end mt-md-0 mt-5 text-center">
                  © 2023 All Rights Reserved Estrella Tera
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default Footer;

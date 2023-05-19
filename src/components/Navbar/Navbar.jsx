import React from "react";
import useConnectButton from "../../Hooks/useConnectButton";
import header_logo from "../../assets/images/Estella-Logo-CN-120423-2.png";
import useLanguageTheme from "../../Hooks/useLanguageTheme";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme, t, lan, handleClick } = useLanguageTheme();
  //let acc = "0x70C0Fb7462F6658A9d4D7d6Af2d2e0C1fD8CE365";
  const { acc, connectWallet } = useConnectButton();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-md-4 text-primay_globle fixed-top Nav_background">
      <div className="container">
        <a className="navbar-brand" href="/">
          <div className="d-flex  align-items-center">
            <img src={header_logo} alt="eta" />
            <div className="d-flex flex-column text-start">
              <span className="small text-primay_globle fw-semibold">兆星</span>
              <span className="small text-primay_globle fw-semibold">
                ESTRELLA TERA
              </span>
            </div>
          </div>
        </a>
        <button
          className="navbar-toggler me-1 shadow-none border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i
            className="fa fa-navicon text-primay_globle"
            style={{ fontSize: 24 }}
          />
        </button>
        <div
          className="collapse navbar-collapse text-start"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav m-auto">
            <li className="nav-item me-md-1">
              <a className="nav-link" href="#commission">
                <span
                  data-bs-target="#navbarSupportedContent"
                  data-bs-toggle="collapse"
                >
                  {t("nav_1")}
                </span>
              </a>
            </li>
            <li className="nav-item me-md-1">
              <a className="nav-link" href="#Portfolio">
                <span
                  data-bs-target="#navbarSupportedContent"
                  data-bs-toggle="collapse"
                >
                  {t("nav_2")}
                </span>
              </a>
            </li>
            <li className="nav-item me-md-1">
              <a className="nav-link" href="#faq">
                <span
                  data-bs-target="#navbarSupportedContent"
                  data-bs-toggle="collapse"
                >
                  {t("nav_3")}
                </span>
              </a>
            </li>
            <li className="nav-item me-md-1">
              <a className="nav-link" href="#whatiseta">
                <span
                  data-bs-target="#navbarSupportedContent"
                  data-bs-toggle="collapse"
                >
                  {t("nav_4")}
                </span>
              </a>
            </li>
            <li className="nav-item me-md-1">
              <a className="nav-link" href="#downloadfastlink">
                <span
                  data-bs-target="#navbarSupportedContent"
                  data-bs-toggle="collapse"
                >
                  {t("nav_5")}
                </span>
              </a>
            </li>
            <li className="nav-item me-md-1">
              <a className="nav-link" href="#DownloadTPwallet">
                <span
                  data-bs-target="#navbarSupportedContent"
                  data-bs-toggle="collapse"
                >
                  {t("nav_6")}
                </span>
              </a>
            </li>
          </ul>

          <div
            className="d-flex form-check btn form-switch align-items-center text-primay_globle hidden_on_mobile"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            onClick={() => toggleTheme()}
          >
            {/* {theme} */}
            {theme === "light-theme" ? (
              <i
                className="fa fa-moon-o hidden_on_mobile"
                style={{ fontSize: 20 }}
              />
            ) : (
              <i
                className="fa fa-sun-o hidden_on_mobile"
                style={{ fontSize: 20 }}
              />
            )}
          </div>

          <div className="language_change mx-md-1 hidden_on_mobile">
            <select
              className="btn btn-outline"
              aria-label="Default select example"
              onChange={(e) => handleClick(e.target.value)}
              value={lan}
            >
              <option value="en" selected>
                EN
              </option>
              <option value="chi">中文</option>
            </select>
          </div>
          <div>
            <button
              className="btn connect_wallet_button px-md-3"
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
        </div>
        <div className="d-flex hidden_on_large_screen">
          <div
            className="d-flex form-check btn form-switch align-items-center text-primay_globle"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            onClick={() => toggleTheme()}
          >
            {/* {theme} */}
            {theme === "light-theme" ? (
              <i
                className="fa fa-moon-o hidden_on_large_screen"
                style={{ fontSize: 20 }}
              />
            ) : (
              <i
                className="fa fa-sun-o hidden_on_large_screen"
                style={{ fontSize: 20 }}
              />
            )}
          </div>

          <div className="language_change hidden_on_large_screen">
            <select
              className="btn btn-outline"
              aria-label="Default select example"
              onChange={(e) => handleClick(e.target.value)}
              value={lan}
            >
              <option value="en">EN</option>
              <option value="chi">中文</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

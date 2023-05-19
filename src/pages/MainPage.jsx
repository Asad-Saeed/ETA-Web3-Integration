import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero/Hero";
import CompanyBrands from "../components/Brands/CompanyBrands";
import Registor from "../components/Register/Registor";
import Purchase from "../components/Purchase/Purchase";
import Commission from "../components/Commission/Commission";
import Withdraw from "../components/Withdraw/Withdraw";
import WithdrawHistory from "../components/WithdrawHistory/WithdrawHistory";
import MyPortfolio from "../components/MyPortfolio/MyPortfolio";

const MainPage = () => {
  return (
    <div className="document_bg">
      <Header />
      <Hero />
      <CompanyBrands />
      <Registor />
      <Purchase />
      <Commission />
      <WithdrawHistory />
      <Withdraw />
      <MyPortfolio />
      <Footer />
    </div>
  );
};

export default MainPage;

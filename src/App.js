import "./App.css";
import MainPage from "./pages/MainPage";
import { ThemeContext } from "./Theme";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  return (
    <div className={`App ${theme}`}>
      <MainPage />
    </div>
  );
}

export default App;

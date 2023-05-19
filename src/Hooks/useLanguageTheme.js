import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../Theme";

const useLanguageTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [lan, setLan] = useState("");

  const handleClick = (lang) => {
    i18n.changeLanguage(lang);
    setLan(lang);
  };

  useEffect(() => {
    setLan(i18n.language);
  }, []);

  return {
    theme,
    toggleTheme,
    t,
    lan,
    handleClick,
  };
};

export default useLanguageTheme;

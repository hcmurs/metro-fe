import { Select } from "antd";
import { useLanguage } from "../../contexts/LanguageContext";
import { UsaFlag, VietnamFlag } from "../../data/CustomIcons";

const languages: { [key: string]: { name: string; icon: JSX.Element } } = {
  vi: { name: "VN", icon: <VietnamFlag /> },
  en: { name: "ENG", icon: <UsaFlag /> },
};

interface Props {
  isDarkMode?: boolean;
}

const LanguageSelector: React.FC<Props> = ({ isDarkMode = true }) => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const handleChange = (value: string) => {
    changeLanguage(value);
  };

  const options = Object.entries(languages).map(([code, { name, icon }]) => ({
    value: code,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon}
        {name}
      </div>
    ),
  }));

  return (
    <Select
      value={currentLanguage}
      onChange={handleChange}
      options={options}
      style={{
        minWidth: isDarkMode ? 50 : 80,
        backgroundColor: isDarkMode ? "transparent" : "#f1f1f1",
        borderRadius: 4,
        color: isDarkMode ? "white" : "black",
      }}
      dropdownStyle={{
        backgroundColor: isDarkMode ? "#1f1f1f" : "white",
      }}
      variant="borderless"
    />
  );
};

export default LanguageSelector;

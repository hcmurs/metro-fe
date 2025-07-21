import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageTest = () => {
  const { t } = useTranslation('header');
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>Language Test Component</h3>
      <p>Current Language: {currentLanguage}</p>
      <p>Home Translation: {t('nav.home')}</p>
      <p>Buy Tickets Translation: {t('nav.buyTickets')}</p>
      <button onClick={() => changeLanguage('en')}>Switch to English</button>
      <button onClick={() => changeLanguage('vi')} style={{ marginLeft: '10px' }}>Switch to Vietnamese</button>
    </div>
  );
};

export default LanguageTest;
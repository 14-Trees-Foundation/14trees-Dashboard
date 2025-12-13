import React from 'react';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';

// Import Ant Design locales
import enUS from 'antd/locale/en_US';
import hiIN from 'antd/locale/hi_IN';

interface LocaleProviderProps {
  children: React.ReactNode;
}

// Custom Marathi locale based on Hindi with Marathi text
const mrIN = {
  ...hiIN,
  locale: 'mr',
  Pagination: {
    ...hiIN.Pagination,
    items_per_page: '/ पृष्ठ',
    jump_to: 'वर जा',
    jump_to_confirm: 'पुष्टी करा',
    page: 'पृष्ठ',
    prev_page: 'मागील पृष्ठ',
    next_page: 'पुढील पृष्ठ',
    prev_5: 'मागील 5 पृष्ठे',
    next_5: 'पुढील 5 पृष्ठे',
    prev_3: 'मागील 3 पृष्ठे',
    next_3: 'पुढील 3 पृष्ठे',
  },
  Table: {
    ...hiIN.Table,
    filterTitle: 'फिल्टर मेनू',
    filterConfirm: 'ठीक',
    filterReset: 'रीसेट',
    selectAll: 'सर्व निवडा',
    selectInvert: 'निवड उलट करा',
    selectionAll: 'सर्व डेटा निवडा',
    sortTitle: 'क्रमवारी',
    expand: 'रांग विस्तारित करा',
    collapse: 'रांग संकुचित करा',
    triggerDesc: 'उतरत्या क्रमाने क्रमवारी करण्यासाठी क्लिक करा',
    triggerAsc: 'चढत्या क्रमाने क्रमवारी करण्यासाठी क्लिक करा',
    cancelSort: 'क्रमवारी रद्द करण्यासाठी क्लिक करा',
  },
  Select: {
    ...hiIN.Select,
    notFoundContent: 'कोणताही डेटा सापडला नाही',
  },
  empty: {
    ...hiIN.empty,
    description: 'कोणताही डेटा नाही',
  },
};

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'hi':
        return hiIN;
      case 'mr':
        return mrIN;
      default:
        return enUS;
    }
  };

  return (
    <ConfigProvider 
      locale={getLocale()}
      theme={{
        token: {
          colorPrimary: '#00b96b',
          borderRadius: 5,
          colorBgContainer: '#B9C0AB1C',
        },
        components: {
          Button: {
            colorPrimary: '#000000',
            colorBgContainer: '#9BC53D',
            algorithm: true,
            borderRadius: 4,
          },
          Select: {
            colorPrimary: '#cef0d6',
            algorithm: true,
            borderRadius: 3
          },
          Input: {
            colorPrimary: '#cef0d6',
            algorithm: true,
            borderRadius: 3
          },
          Segmented: {
            itemActiveBg: '#e3e3e3bf',
            itemSelectedBg: '#8fcf9f7a',
            itemHoverBg: '#b7edc47a',
          },
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
};
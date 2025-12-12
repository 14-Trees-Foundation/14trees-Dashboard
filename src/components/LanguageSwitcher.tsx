import React from 'react';
import { MenuItem, Select, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LanguageOutlined } from '@mui/icons-material';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
];

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'compact';
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'dropdown',
  showIcon = true 
}) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  if (variant === 'compact') {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          size="small"
          variant="outlined"
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  {showIcon && <LanguageOutlined fontSize="small" />}
                  <Typography variant="body2">{t('language.selectLanguage')}</Typography>
                </Box>
              );
            }
            const selectedLang = languages.find(lang => lang.code === selected);
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {showIcon && <LanguageOutlined fontSize="small" />}
                <Typography variant="body2">{selectedLang?.nativeName}</Typography>
              </Box>
            );
          }}
          sx={{ 
            minWidth: 120,
            '& .MuiOutlinedInput-input': {
              padding: '8px 14px',
              color: 'white'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)'
            },
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.8)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white'
            }
          }}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              {language.nativeName}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  }

  return (
    <Select
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      size="small"
      variant="outlined"
      displayEmpty
      fullWidth
      renderValue={(selected) => {
        if (!selected) {
          return (
            <Box display="flex" alignItems="center" gap={1}>
              {showIcon && <LanguageOutlined />}
              <Typography variant="body2">{t('language.selectLanguage')}</Typography>
            </Box>
          );
        }
        const selectedLang = languages.find(lang => lang.code === selected);
        return (
          <Box display="flex" alignItems="center" gap={1}>
            {showIcon && <LanguageOutlined />}
            <Typography variant="body2">{selectedLang?.nativeName}</Typography>
          </Box>
        );
      }}
      sx={{
        '& .MuiOutlinedInput-input': {
          color: 'white'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.5)'
        },
        '& .MuiSvgIcon-root': {
          color: 'white'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.8)'
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white'
        }
      }}
    >
      {languages.map((language) => (
        <MenuItem key={language.code} value={language.code}>
          <Box>
            <Typography variant="body1">{language.nativeName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {language.name}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
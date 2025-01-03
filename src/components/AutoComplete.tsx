import { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

interface AutoCompleteProps {
  loading?: boolean,
  label: string,
  options: any[],
  getOptionLabel?: (option: any) => string,
  onChange?: (event: React.SyntheticEvent<Element, Event>, value: any) => void,
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setPage?: (value: React.SetStateAction<number>) => void
  fullWidth?: boolean
  size?: 'small' | 'medium'
  value?: any
  required?: boolean
}

const  AutocompleteWithPagination = ({
  loading,
  label,
  options,
  getOptionLabel, 
  onChange, 
  onInputChange, 
  setPage,
  fullWidth,
  size,
  value,
  required,
}: AutoCompleteProps) => {
  const [position, setPosition] = useState(0);
  const listElem: any = useRef();
  const mounted = useRef<boolean>();

  useEffect(() => {
    if (!mounted.current) mounted.current = true;
    else if (position && listElem.current) 
         listElem.current.scrollTop = position - listElem.current.offsetHeight;
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!onInputChange) return;
    onInputChange(event);
  }

  let listboxProps;
  if (setPage) {
    listboxProps = {
      ref: listElem,
      onScroll: (event: any) => {
        if (loading) return;

        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const scrollPosition = scrollTop + clientHeight;
        if (scrollHeight - scrollPosition <= 1) {
          setPosition(scrollPosition);
          setPage(prev => prev + 1);
        }
      }
    } as any;
  }

  const sx = fullWidth ? undefined : { width: 400 }

  return (
    <Autocomplete
      sx={sx}
      fullWidth={fullWidth}
      freeSolo
      blurOnSelect
      size={size ? size : 'small'}
      autoHighlight
      value={value ? value : null}
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={onChange}
      ListboxProps={listboxProps}
      renderInput={(params) => (
        <TextField
          {...params}
          margin={ sx ? undefined : 'dense' }
          label={label}
          required={required}
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : <ArrowDropDown htmlColor='rgba(0, 0, 0, 0.54)'/>}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
    
  );
};

export { AutocompleteWithPagination };
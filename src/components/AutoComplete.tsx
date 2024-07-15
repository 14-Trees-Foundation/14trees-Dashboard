import { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

interface AutoCompleteProps {
  loading?: boolean,
  label: string,
  options: any[],
  getOptionLabel?: (option: any) => string,
  onChange?: (event: React.SyntheticEvent<Element, Event>, value: any) => void,
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  setPage?: (value: React.SetStateAction<number>) => void
}

const  AutocompleteWithPagination = ({
  loading,
  label,
  options,
  getOptionLabel, 
  onChange, 
  onInputChange, 
  setPage 
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

  return (
    <Autocomplete
      sx={{ width: 400 }}
      freeSolo
      size='small'
      autoHighlight
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={onChange}
      ListboxProps={listboxProps}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
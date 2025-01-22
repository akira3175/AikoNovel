import React, { ChangeEvent } from 'react';
import { InputBase, IconButton, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

const SearchForm = styled('form')<{ $fullWidth?: boolean }>(({ theme, $fullWidth }) => ({
  position: 'relative',
  width: $fullWidth ? '100%' : '210px',
  height: '36px',
  borderRadius: '20px',
  border: '1px solid #0dcaf0',
  lineHeight: '36px',
  backgroundColor: '#ffffff',
  marginInlineEnd: $fullWidth ? '0' : '25px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginInlineEnd: '0',
    marginBottom: theme.spacing(1),
  },
}));

const SearchInput = styled(InputBase)({
  flex: 1,
  paddingLeft: '15px',
  fontSize: '14px',
});

const SearchButton = styled(IconButton)({
  padding: '5px',
  color: '#0dcaf0',
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  fullWidth = false,
  placeholder = "Tìm kiếm...",
  style,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', value);
    // Implement search functionality here
  };

  return (
    <SearchForm onSubmit={handleSubmit} $fullWidth={fullWidth} style={style}>
      <SearchInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputProps={{ 'aria-label': 'search' }}
      />
      <SearchButton type="submit" aria-label="search">
        <SearchIcon />
      </SearchButton>
    </SearchForm>
  );
};

export default SearchBar;

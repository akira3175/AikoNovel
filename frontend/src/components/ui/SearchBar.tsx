import React, { useState } from 'react';
import { InputBase, IconButton, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchForm = styled('form')(({ theme }) => ({
  position: 'relative',
  width: '210px',
  height: '36px',
  borderRadius: '20px',
  border: '1px solid #0dcaf0',
  lineHeight: '36px',
  backgroundColor: '#ffffff',
  marginInlineEnd: '25px',
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

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement search functionality here
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchInput
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <SearchButton type="submit" aria-label="search">
        <SearchIcon />
      </SearchButton>
    </SearchForm>
  );
};

export default SearchBar;


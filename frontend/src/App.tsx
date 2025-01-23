import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Base from './pages/Base';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Work from './pages/Work';
import BookWork from './pages/BookWork';
// We'll uncomment these imports once we create the corresponding components
// import Home from './pages/Home';
// import List from './pages/List';
// import Search from './pages/Search';
// import Profile from './pages/Profile';
// import Library from './pages/Library';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#039be5',
      contrastText: '#fff',
    },
  },
});

const AppContent: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/book/:id" element={<BookWork />} />
            <Route
              path="/*"
              element={
                <Base>
                  <Routes>
                    <Route path="/profile/:username" element={<Profile />} />
                    {/* We'll uncomment these routes once we create the corresponding components */}
                    {/* <Route path="/" element={<Home />} />
                    <Route path="/list/:type" element={<List />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/library" element={<Library />} /> */}
                    <Route path="/work" element={<Work />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Base>
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;


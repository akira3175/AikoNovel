import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Base from './pages/Base';
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
});

const AppContent: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/*"
              element={
                <Base>
                  <Routes>
                    {/* We'll uncomment these routes once we create the corresponding components */}
                    {/* <Route path="/" element={<Home />} />
                    <Route path="/list/:type" element={<List />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/library" element={<Library />} /> */}
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


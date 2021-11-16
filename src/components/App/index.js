import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navigation from '../Navigation';
import HomePage from '../Home';
import IndexAccounts from '../IndexAccounts';
import IndexContent from '../IndexContent';
import ContentPage from '../Content';
import './index.css';


const App = () => (
  <Router>
    <Navigation />

    {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
    <Routes>
      <Route path="/content" element={<ContentPage />} />
      <Route path="/indexAccounts" element={<IndexAccounts />} />
      <Route path="/indexContent" element={<IndexContent />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>

);

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { mockUsers } from './data/mockData';

const users = localStorage.getItem("users");
if (!users) {
  localStorage.setItem("users", JSON.stringify(mockUsers));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App.jsx'; import './styles.css';
import MotionRuntime from './MotionRuntime.jsx';
import Spotlight from './Spotlight.jsx';
createRoot(document.getElementById('root')).render(<><MotionRuntime /><Spotlight /><App /></>);

if ('serviceWorker' in navigator && import.meta.env.PROD) addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));

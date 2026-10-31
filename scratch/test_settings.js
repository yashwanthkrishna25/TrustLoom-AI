const esbuild = require('d:/TrustLoom_AI_Complete_Upgrade_Fixed/client/node_modules/esbuild');
const fs = require('fs');
const content = fs.readFileSync('client/src/App.jsx', 'utf8');

const start = content.indexOf('function Settings({');
const end = content.indexOf('function Plans({');
const settingsCode = content.slice(start, end);

const testCode = `
import React, { useState, useEffect } from 'd:/TrustLoom_AI_Complete_Upgrade_Fixed/client/node_modules/react';
import ReactDOMServer from 'd:/TrustLoom_AI_Complete_Upgrade_Fixed/client/node_modules/react-dom/server';

const api = () => Promise.resolve({});
const MetaIcon = () => 'MetaIcon';
const InstagramIcon = () => 'InstagramIcon';
const XIcon = () => 'XIcon';
const Tgl = () => 'Tgl';

${settingsCode}

console.log('Settings is:', typeof Settings);
console.log('Settings toString length:', Settings.toString().length);
try {
  const el = Settings({
    t: 'test-token',
    user: { id: '1', role: 'analyst', name: 'Security Analyst', email: 'analyst@demo.com', plan: 'free' },
    setUser: () => {},
    dark: true,
    setDark: () => {},
    switchRole: () => {},
    go: () => {}
  });
  console.log('Direct call return value:', el);
} catch (e) {
  console.log('Direct call error:', e);
}
`;

fs.writeFileSync('scratch/scratch_test_settings.jsx', testCode);
esbuild.buildSync({
  entryPoints: ['scratch/scratch_test_settings.jsx'],
  outfile: 'scratch/scratch_test_settings.js',
  bundle: true,
  platform: 'node',
  format: 'cjs'
});

require('./scratch_test_settings.js');

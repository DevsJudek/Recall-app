const fs = require('fs');
let c = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

c = c.replace(
  /<div className="bg-blue-50 dark:bg-blue-900\/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">/g,
  `<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative">
    <button onClick={() => { setHidePushBanner(true); localStorage.setItem('hidePushBanner', 'true'); }} className="absolute top-2 right-2 p-1 text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>`
);

c = c.replace(
  /<button onClick=\{\(\) => togglePush\(true\)\} className/g,
  `<button onClick={() => { setHidePushBanner(true); localStorage.setItem('hidePushBanner', 'true'); togglePush(true); }} className`
);

fs.writeFileSync('src/pages/Dashboard.jsx', c);

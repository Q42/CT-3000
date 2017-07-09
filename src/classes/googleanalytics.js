import GoogleAnalytics from 'react-ga';
GoogleAnalytics.initialize('UA-58394646-5');

export const trackPage = (page, language) => {
  GoogleAnalytics.set({ page, language });
  GoogleAnalytics.pageview(page + '?language=' + language);
};


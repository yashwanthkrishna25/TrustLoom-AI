import '../src/styles.css';

export const metadata = {
  title: 'TrustLoom AI | Explainable Social Account Intelligence',
  description: 'Interpretable machine learning for identifying spam bots and fake followers in social networks.',
  applicationName: 'TrustLoom AI',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from 'next';
import { I18nProvider } from '@/contexts/I18nContext';
import { LanguageSelector } from '@/components/LanguageSelector/LanguageSelector';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'LDAP Password Change Portal',
  description: 'Change your LDAP password securely',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <LanguageSelector />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}


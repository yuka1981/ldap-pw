import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { I18nProvider } from '../../contexts/I18nContext';

describe('Home', () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <I18nProvider>
          <Home />
        </I18nProvider>
      </BrowserRouter>
    );
  };

  it('should render home page with title', () => {
    renderHome();
    expect(screen.getByText(/LDAP Password Change Portal/i)).toBeInTheDocument();
  });

  it('should render description', () => {
    renderHome();
    expect(screen.getByText(/Change your LDAP password securely/i)).toBeInTheDocument();
  });

  it('should render change password button', () => {
    renderHome();
    expect(screen.getByText(/Change My Password/i)).toBeInTheDocument();
  });

  it('should render welcome message', () => {
    renderHome();
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});


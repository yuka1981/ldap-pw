import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChangePassword } from './ChangePassword';
import { I18nProvider } from '../../contexts/I18nContext';

// Mock the password change API
vi.mock('../../services/passwordService', () => ({
  changePassword: vi.fn(),
}));

describe('ChangePassword', () => {
  const renderChangePassword = () => {
    return render(
      <BrowserRouter>
        <I18nProvider>
          <ChangePassword />
        </I18nProvider>
      </BrowserRouter>
    );
  };

  it('should render change password form', () => {
    renderChangePassword();
    expect(screen.getByText(/Change Your Password/i)).toBeInTheDocument();
  });

  it('should render all input fields', () => {
    renderChangePassword();
    expect(screen.getByLabelText(/^Account \/ Username$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Current Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^Confirm New Password$/i)
    ).toBeInTheDocument();
  });

  it('should render password requirements', () => {
    renderChangePassword();
    expect(screen.getByText(/Password Requirements/i)).toBeInTheDocument();
  });

  it('should show error when passwords do not match', async () => {
    renderChangePassword();

    const accountInput = screen.getByLabelText(/^Account \/ Username$/i);
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirm New Password$/i
    );
    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });

    fireEvent.change(accountInput, { target: { value: 'testuser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'OldPass123!' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Different123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/do not match/i)).toBeInTheDocument();
    });
  });

  it('should show error for weak password', async () => {
    renderChangePassword();

    const accountInput = screen.getByLabelText(/^Account \/ Username$/i);
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirm New Password$/i
    );
    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });

    fireEvent.change(accountInput, { target: { value: 'testuser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'OldPass123!' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/does not meet requirements/i)
      ).toBeInTheDocument();
    });
  });

  it('should show error when account is required', async () => {
    renderChangePassword();

    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert');
      expect(
        errorMessages.some((msg) =>
          /Please enter your account or username/i.test(msg.textContent || '')
        )
      ).toBe(true);
    });
  });

  it('should show error when current password is required', async () => {
    renderChangePassword();

    const accountInput = screen.getByLabelText(/^Account \/ Username$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirm New Password$/i
    );
    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });

    fireEvent.change(accountInput, { target: { value: 'testuser' } });
    fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'NewPass123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter your current password/i)
      ).toBeInTheDocument();
    });
  });

  it('should show error when new password is required', async () => {
    renderChangePassword();

    const accountInput = screen.getByLabelText(/^Account \/ Username$/i);
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirm New Password$/i
    );
    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });

    fireEvent.change(accountInput, { target: { value: 'testuser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'OldPass123!' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'NewPass123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a new password/i)
      ).toBeInTheDocument();
    });
  });

  it('should show error when confirm password is required', async () => {
    renderChangePassword();

    const accountInput = screen.getByLabelText(/^Account \/ Username$/i);
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });

    fireEvent.change(accountInput, { target: { value: 'testuser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'OldPass123!' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Please confirm your new password/i)
      ).toBeInTheDocument();
    });
  });

  it('should enable submit button when form is valid', () => {
    renderChangePassword();

    const accountInput = screen.getByLabelText(/^Account \/ Username$/i);
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const confirmPasswordInput = screen.getByLabelText(
      /^Confirm New Password$/i
    );
    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });

    fireEvent.change(accountInput, { target: { value: 'testuser' } });
    fireEvent.change(currentPasswordInput, {
      target: { value: 'OldPass123!' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'NewPass123!' },
    });

    expect(submitButton).not.toBeDisabled();
  });
});

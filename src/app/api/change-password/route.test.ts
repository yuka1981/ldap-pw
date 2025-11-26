/**
 * LDAP 密碼修改 API 路由單元測試
 */

import { POST } from './route';
import { NextRequest } from 'next/server';
import { Client } from 'ldapts';
import { getLDAPConfig, buildUserDN } from '@/config/ldap.config';

// Mock ldapts
jest.mock('ldapts');
jest.mock('@/config/ldap.config');

const mockClient = {
  bind: jest.fn(),
  modify: jest.fn(),
  unbind: jest.fn(),
};

describe('POST /api/change-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Client as jest.MockedClass<typeof Client>).mockImplementation(() => mockClient as any);
    (getLDAPConfig as jest.Mock).mockReturnValue({
      url: 'ldaps://ldap.example.com:636',
      baseDN: 'dc=example,dc=com',
      userDNTemplate: 'uid={username},dc=example,dc=com',
      loginAttribute: 'uid',
      timeout: 10000,
      tlsOptions: {
        rejectUnauthorized: true,
      },
    });
    (buildUserDN as jest.Mock).mockImplementation((username: string) => {
      return `uid=${username},dc=example,dc=com`;
    });
  });

  it('應該成功修改密碼', async () => {
    mockClient.bind.mockResolvedValue(undefined);
    mockClient.modify.mockResolvedValue(undefined);
    mockClient.unbind.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        currentPassword: 'oldPassword123!',
        newPassword: 'newPassword123!',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Password changed successfully');
    expect(mockClient.bind).toHaveBeenCalledWith('uid=testuser,dc=example,dc=com', 'oldPassword123!');
    expect(mockClient.modify).toHaveBeenCalled();
    expect(mockClient.unbind).toHaveBeenCalled();
  });

  it('應該在缺少參數時回傳 400 錯誤', async () => {
    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        // 缺少 currentPassword 和 newPassword
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain('required');
  });

  it('應該在目前密碼錯誤時回傳 401 錯誤（LDAP 錯誤碼 49）', async () => {
    const bindError = new Error('Invalid Credentials');
    (bindError as any).code = 49;
    mockClient.bind.mockRejectedValue(bindError);
    mockClient.unbind.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123!',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.code).toBe(49);
    expect(data.message).toBe('Current password is incorrect');
    expect(mockClient.modify).not.toHaveBeenCalled();
    expect(mockClient.unbind).toHaveBeenCalled();
  });

  it('應該在密碼策略違規時回傳 400 錯誤（LDAP 錯誤碼 53）', async () => {
    mockClient.bind.mockResolvedValue(undefined);
    const modifyError = new Error('Password Policy Violation');
    (modifyError as any).code = 53;
    mockClient.modify.mockRejectedValue(modifyError);
    mockClient.unbind.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        currentPassword: 'oldPassword123!',
        newPassword: 'weak', // 不符合策略的密碼
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe(53);
    expect(data.message).toBe('Password does not meet policy requirements');
    expect(mockClient.unbind).toHaveBeenCalled();
  });

  it('應該在約束違規時回傳 400 錯誤（LDAP 錯誤碼 19）', async () => {
    mockClient.bind.mockResolvedValue(undefined);
    const modifyError = new Error('Constraint Violation');
    (modifyError as any).code = 19;
    mockClient.modify.mockRejectedValue(modifyError);
    mockClient.unbind.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        currentPassword: 'oldPassword123!',
        newPassword: 'oldPassword123!', // 與舊密碼相同
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.code).toBe(19);
    expect(data.message).toBe('Password constraint violation');
    expect(mockClient.unbind).toHaveBeenCalled();
  });

  it('應該處理其他 LDAP 錯誤', async () => {
    mockClient.bind.mockResolvedValue(undefined);
    const modifyError = new Error('LDAP Connection Error');
    (modifyError as any).code = 81;
    mockClient.modify.mockRejectedValue(modifyError);
    mockClient.unbind.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        currentPassword: 'oldPassword123!',
        newPassword: 'newPassword123!',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.code).toBe(81);
    expect(data.message).toBe('LDAP Connection Error');
    expect(mockClient.unbind).toHaveBeenCalled();
  });

  it('應該處理無效的 JSON 請求', async () => {
    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('應該確保在發生錯誤時關閉 LDAP 連線', async () => {
    const bindError = new Error('Connection Error');
    (bindError as any).code = 81;
    mockClient.bind.mockRejectedValue(bindError);
    mockClient.unbind.mockResolvedValue(undefined);

    const request = new NextRequest('http://localhost:3000/api/change-password', {
      method: 'POST',
      body: JSON.stringify({
        account: 'testuser',
        currentPassword: 'oldPassword123!',
        newPassword: 'newPassword123!',
      }),
    });

    await POST(request);

    expect(mockClient.unbind).toHaveBeenCalled();
  });
});


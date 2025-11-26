/**
 * LDAP 配置單元測試
 */

import { getLDAPConfig, buildUserDN, LDAPConfig } from './ldap.config';

describe('LDAP Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getLDAPConfig', () => {
    it('應該使用環境變數配置', () => {
      process.env.LDAP_URL = 'ldaps://test.example.com:636';
      process.env.LDAP_BASE_DN = 'dc=test,dc=com';
      process.env.LDAP_LOGIN_ATTRIBUTE = 'cn';
      process.env.LDAP_REJECT_UNAUTHORIZED = 'true';

      const config = getLDAPConfig();

      expect(config.url).toBe('ldaps://test.example.com:636');
      expect(config.baseDN).toBe('dc=test,dc=com');
      expect(config.loginAttribute).toBe('cn');
      expect(config.tlsOptions?.rejectUnauthorized).toBe(true);
    });

    it('應該使用預設值當環境變數不存在時', () => {
      delete process.env.LDAP_URL;
      delete process.env.LDAP_BASE_DN;
      delete process.env.LDAP_LOGIN_ATTRIBUTE;
      delete process.env.LDAP_REJECT_UNAUTHORIZED;

      const config = getLDAPConfig();

      expect(config.url).toBe('ldaps://localhost:636');
      expect(config.baseDN).toBe('dc=example,dc=com');
      expect(config.loginAttribute).toBe('uid');
      expect(config.timeout).toBe(10000);
      expect(config.tlsOptions?.rejectUnauthorized).toBe(true);
    });

    it('應該根據 loginAttribute 和 baseDN 自動構建 userDNTemplate', () => {
      process.env.LDAP_LOGIN_ATTRIBUTE = 'uid';
      process.env.LDAP_BASE_DN = 'dc=example,dc=com';
      delete process.env.LDAP_USER_DN_TEMPLATE;

      const config = getLDAPConfig();

      expect(config.userDNTemplate).toBe('uid={username},dc=example,dc=com');
    });

    it('應該使用自訂的 userDNTemplate 如果提供', () => {
      process.env.LDAP_USER_DN_TEMPLATE = 'uid={username},ou=users,dc=example,dc=com';

      const config = getLDAPConfig();

      expect(config.userDNTemplate).toBe('uid={username},ou=users,dc=example,dc=com');
    });

    it('應該正確處理 LDAP_REJECT_UNAUTHORIZED=false', () => {
      process.env.LDAP_REJECT_UNAUTHORIZED = 'false';

      const config = getLDAPConfig();

      expect(config.tlsOptions?.rejectUnauthorized).toBe(false);
    });
  });

  describe('buildUserDN', () => {
    it('應該正確替換 username 在 userDNTemplate 中', () => {
      const config: LDAPConfig = {
        url: 'ldaps://ldap.example.com:636',
        baseDN: 'dc=example,dc=com',
        userDNTemplate: 'uid={username},dc=example,dc=com',
        loginAttribute: 'uid',
      };

      const userDN = buildUserDN('testuser', config);

      expect(userDN).toBe('uid=testuser,dc=example,dc=com');
    });

    it('應該處理包含 ou 的複雜 DN 格式', () => {
      const config: LDAPConfig = {
        url: 'ldaps://ldap.example.com:636',
        baseDN: 'dc=example,dc=com',
        userDNTemplate: 'uid={username},ou=users,dc=example,dc=com',
        loginAttribute: 'uid',
      };

      const userDN = buildUserDN('testuser', config);

      expect(userDN).toBe('uid=testuser,ou=users,dc=example,dc=com');
    });

    it('應該處理 Active Directory 格式的 DN', () => {
      const config: LDAPConfig = {
        url: 'ldaps://ldap.example.com:636',
        baseDN: 'dc=example,dc=com',
        userDNTemplate: 'CN={username},CN=Users,DC=example,DC=com',
        loginAttribute: 'cn',
      };

      const userDN = buildUserDN('testuser', config);

      expect(userDN).toBe('CN=testuser,CN=Users,DC=example,DC=com');
    });
  });
});


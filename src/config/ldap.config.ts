/**
 * LDAP 連線配置
 *
 * 注意：
 * 1. 在生產環境中，這些配置應該從環境變數讀取，不要直接寫死在程式碼中
 * 2. 由於 ldapts 套件無法在瀏覽器環境中運行，LDAP 操作應該在後端進行
 * 3. 此配置檔案主要用於後端 API 參考，前端不需要直接使用
 *
 * 環境變數範例（後端使用）：
 * - LDAP_URL=ldaps://ldap.example.com:636
 * - LDAP_BASE_DN=dc=example,dc=com
 * - LDAP_USER_DN_TEMPLATE=uid={username},ou=users,dc=example,dc=com
 * - LDAP_LOGIN_ATTRIBUTE=uid
 *
 * 前端 API 端點配置：
 * - NEXT_PUBLIC_API_URL=http://localhost:3000/api
 */

export interface LDAPConfig {
  url: string;
  baseDN: string;
  userDNTemplate: string;
  loginAttribute?: string; // OpenLDAP 的 login attribute（例如：uid, cn, mail）
  timeout?: number;
  tlsOptions?: {
    rejectUnauthorized?: boolean;
  };
}

/**
 * 取得 LDAP 配置
 * 優先使用環境變數，如果沒有則使用預設值（僅供開發測試使用）
 * 
 * 注意：此配置用於後端 API，環境變數不需要 NEXT_PUBLIC_ 前綴
 */
export const getLDAPConfig = (): LDAPConfig => {
  // 後端環境變數（不需要 NEXT_PUBLIC_ 前綴）
  const loginAttribute = process.env.LDAP_LOGIN_ATTRIBUTE || 'uid';
  const baseDN = process.env.LDAP_BASE_DN || 'dc=example,dc=com';

  // 如果提供了完整的 userDNTemplate，則使用它
  // 否則根據 loginAttribute 和 baseDN 構建
  const userDNTemplate =
    process.env.LDAP_USER_DN_TEMPLATE ||
    `${loginAttribute}={username},${baseDN}`;

  return {
    url: process.env.LDAP_URL || 'ldaps://localhost:636',
    baseDN,
    userDNTemplate,
    loginAttribute,
    timeout: 10000, // 10 秒超時
    tlsOptions: {
      // 在生產環境中，應該設為 true 以驗證 SSL 憑證
      // 在開發環境中，如果使用自簽憑證，可以設為 false
      rejectUnauthorized: process.env.LDAP_REJECT_UNAUTHORIZED !== 'false',
    },
  };
};

/**
 * 根據使用者名稱構建完整的 DN（Distinguished Name）
 */
export const buildUserDN = (username: string, config: LDAPConfig): string => {
  return config.userDNTemplate.replace('{username}', username);
};

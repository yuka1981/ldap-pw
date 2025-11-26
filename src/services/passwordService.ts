/**
 * LDAP 密碼修改服務
 * 
 * 注意：ldapts 套件無法在瀏覽器環境中運行（需要 Node.js 的 net、tls 等模組）
 * 因此 LDAP 操作應該在後端 API 中進行，前端透過 HTTP 請求呼叫後端 API
 * 
 * TODO: 實作後端 API
 * 
 * 實作步驟：
 * 1. 建立後端 API 服務（例如：Express、Fastify 等）
 * 2. 在後端使用 ldapts 套件進行 LDAP 操作
 * 3. 前端透過 fetch 或 axios 呼叫後端 API
 * 4. 後端 API 端點範例：POST /api/change-password
 * 
 * 目前此函數為模擬實作，用於開發和測試
 */

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export interface LDAPError extends Error {
  code?: number;
  dn?: string;
}

/**
 * 修改 LDAP 密碼
 * 
 * 此函數呼叫後端 API 進行 LDAP 密碼修改
 */
export const changePassword = async (
  account: string,
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  // 參數驗證
  if (!account || !currentPassword || !newPassword) {
    throw new Error('Account, current password and new password are required');
  }

  // 呼叫後端 API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/change-password';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, currentPassword, newPassword }),
  });

  const result = await response.json();

  if (!response.ok) {
    // 建立錯誤物件，包含 LDAP 錯誤碼
    const error: LDAPError = new Error(result.message || 'Failed to change password');
    error.code = result.code;
    throw error;
  }

  return result;
};

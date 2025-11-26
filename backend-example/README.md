# 後端 API 實作範例

由於 `ldapts` 套件無法在瀏覽器環境中運行（需要 Node.js 的 `net`、`tls` 等模組），LDAP 操作必須在後端進行。

## 架構說明

```
前端 (React) → HTTP API → 後端 (Node.js) → LDAP 伺服器
```

## 後端實作範例

### 1. 安裝依賴

```bash
npm install express ldapts cors dotenv
npm install -D @types/express @types/cors
```

### 2. 後端 API 端點範例

```typescript
// server.ts
import express from 'express';
import cors from 'cors';
import { Client, Change, Attribute } from 'ldapts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// LDAP 配置
const LDAP_CONFIG = {
  url: process.env.LDAP_URL || 'ldaps://ldap.example.com:636',
  baseDN: process.env.LDAP_BASE_DN || 'dc=example,dc=com',
  loginAttribute: process.env.LDAP_LOGIN_ATTRIBUTE || 'uid',
  userDNTemplate: process.env.LDAP_USER_DN_TEMPLATE || 
    `${process.env.LDAP_LOGIN_ATTRIBUTE || 'uid'}={username},${process.env.LDAP_BASE_DN || 'dc=example,dc=com'}`,
  timeout: 10000,
  tlsOptions: {
    rejectUnauthorized: process.env.LDAP_REJECT_UNAUTHORIZED !== 'false',
  },
};

// 構建使用者 DN
const buildUserDN = (username: string): string => {
  return LDAP_CONFIG.userDNTemplate.replace('{username}', username);
};

// 修改密碼 API
app.post('/api/change-password', async (req, res) => {
  const { account, currentPassword, newPassword } = req.body;

  // 參數驗證
  if (!account || !currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Account, current password and new password are required',
    });
  }

  const userDN = buildUserDN(account);
  const client = new Client({
    url: LDAP_CONFIG.url,
    timeout: LDAP_CONFIG.timeout,
    connectTimeout: LDAP_CONFIG.timeout,
    tlsOptions: LDAP_CONFIG.tlsOptions,
    strictDN: true,
  });

  try {
    // 步驟 1: 驗證目前密碼
    try {
      await client.bind(userDN, currentPassword);
    } catch (bindError: any) {
      if (bindError.code === 49) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }
      throw bindError;
    }

    // 步驟 2: 修改密碼
    const passwordAttribute = new Attribute({
      type: 'userPassword', // 根據 LDAP 伺服器調整
      values: [newPassword],
    });

    const changes: Change[] = [
      new Change({
        operation: 'replace',
        modification: passwordAttribute,
      }),
    ];

    try {
      await client.modify(userDN, changes);
    } catch (modifyError: any) {
      if (modifyError.code === 53) {
        return res.status(400).json({
          success: false,
          message: 'Password does not meet policy requirements',
        });
      }
      if (modifyError.code === 19) {
        return res.status(400).json({
          success: false,
          message: 'Password constraint violation',
        });
      }
      throw modifyError;
    }

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'LDAP operation failed',
    });
  } finally {
    try {
      await client.unbind();
    } catch (unbindError) {
      console.warn('Failed to unbind LDAP connection:', unbindError);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. 後端環境變數 (.env)

```env
# 後端伺服器設定
PORT=3000

# LDAP 連線配置
LDAP_URL=ldaps://ldap.example.com:636
LDAP_BASE_DN=dc=example,dc=com
LDAP_LOGIN_ATTRIBUTE=uid
LDAP_USER_DN_TEMPLATE=uid={username},ou=users,dc=example,dc=com
LDAP_REJECT_UNAUTHORIZED=true
```

### 4. 前端環境變數 (.env)

```env
# 後端 API 端點（Next.js 環境變數需要以 NEXT_PUBLIC_ 開頭）
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 注意事項

1. **安全性**：確保後端 API 使用 HTTPS 進行通訊
2. **CORS**：配置適當的 CORS 政策
3. **認證**：考慮添加 API 認證機制（例如：JWT、API Key）
4. **錯誤處理**：實作適當的錯誤處理和日誌記錄
5. **密碼屬性**：根據實際 LDAP 伺服器調整密碼屬性名稱


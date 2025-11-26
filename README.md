# LDAP Password Change Portal

一個符合現代 Web 設計標準的 LDAP 密碼修改入口網站，支援多語系（繁體中文、日文、英文）。

## 功能特色

- ✅ 響應式設計 (RWD)
- ✅ 多語系支援（繁體中文、日文、英文，預設英文）
- ✅ 符合蘋果人機界面指南的設計風格
- ✅ 現代化的 UI/UX 設計
- ✅ 完整的表單驗證
- ✅ E2E 測試（使用 Playwright）

## 技術棧

- **Next.js 14** - React 框架（App Router）
- **React 18** + **TypeScript**
- **ldapts** - LDAP 客戶端庫（後端 API）
- **Jest** - 單元測試框架
- **Playwright** - E2E 測試框架
- **js-yaml** - YAML 檔案解析（多語系管理）
- **CSS3** - 樣式（使用 CSS Variables）

## 開始使用

### 安裝依賴

```bash
npm install
```

### 配置 LDAP 連線

1. 複製環境變數範例檔案：

```bash
cp env.example .env
```

2. 編輯 `.env` 檔案，填入實際的 LDAP 伺服器資訊：

**前端 API 配置**：

```env
# 後端 API 端點 URL（Next.js API 路由）
NEXT_PUBLIC_API_URL=/api/change-password
```

**後端 LDAP 配置**：

```env
# LDAP 伺服器 URL
LDAP_URL=ldaps://ldap.example.com:636

# LDAP Base DN
LDAP_BASE_DN=dc=example,dc=com

# OpenLDAP Login Attribute
LDAP_LOGIN_ATTRIBUTE=uid

# SSL/TLS 憑證驗證
LDAP_REJECT_UNAUTHORIZED=true
```

**注意**：

- Next.js 的環境變數在客戶端使用時需要以 `NEXT_PUBLIC_` 開頭
- 後端 LDAP 配置不需要 `NEXT_PUBLIC_` 前綴，因為它們只在伺服器端使用

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動

### 執行測試

#### 單元測試

```bash
# 執行所有單元測試
npm test

# 執行測試並監聽檔案變更
npm run test:watch

# 執行測試並生成覆蓋率報告
npm run test:coverage
```

#### E2E 測試

```bash
# 執行 E2E 測試（會自動啟動開發伺服器）
npm run test:e2e

# 執行 E2E 測試並顯示 UI
npm run test:e2e:ui

# 執行 E2E 測試（顯示瀏覽器視窗）
npm run test:e2e:headed

# 執行 E2E 測試（除錯模式）
npm run test:e2e:debug
```

**注意**: E2E 測試會自動啟動開發伺服器，無需手動執行 `npm run dev`。

### 建置生產版本

```bash
npm run build
```

## 專案結構

```
src/
├── app/                # Next.js App Router
│   ├── api/            # API 路由
│   │   └── change-password/ # LDAP 密碼修改 API
│   │       ├── route.ts     # API 路由處理
│   │       └── route.test.ts # API 單元測試
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 首頁
│   └── change-password/ # 修改密碼頁面
│       └── page.tsx
├── components/         # React 組件
│   ├── Home/           # 主頁組件
│   ├── ChangePassword/ # 修改密碼表單組件
│   └── LanguageSelector/ # 語言選擇器
├── config/             # 配置檔案
│   ├── ldap.config.ts  # LDAP 連線配置
│   └── ldap.config.test.ts # 配置單元測試
├── contexts/           # React Context
│   └── I18nContext.tsx # 多語系 Context
├── i18n/               # 多語系資源
│   ├── locales/        # 語言檔案 (YAML 格式)
│   │   ├── en.yaml     # 英文
│   │   ├── zh-TW.yaml  # 繁體中文
│   │   └── ja.yaml     # 日文
│   └── index.ts        # 多語系工具函數
├── services/           # API 服務
│   └── passwordService.ts # 密碼修改服務（前端）
├── styles/             # 全域樣式
│   └── global.css      # CSS Variables 和基礎樣式
├── utils/              # 工具函數
│   └── passwordValidation.ts # 密碼驗證邏輯
└── e2e/                # E2E 測試
    ├── home.spec.ts           # 主頁 E2E 測試
    ├── change-password.spec.ts # 修改密碼頁面 E2E 測試
    └── language-switch.spec.ts # 語系切換 E2E 測試
```

## 設計規範

- **主色調**: #1890FF
- **設計風格**: 現代化、簡潔、符合 Apple HIG 指南
- **響應式斷點**:
  - Mobile: < 480px
  - Tablet: 481px - 768px
  - Desktop: > 768px

## 密碼要求

- 至少 8 個字元
- 至少包含一個大寫字母
- 至少包含一個小寫字母
- 至少包含一個數字
- 至少包含一個特殊字元

## 開發規範

### 測試類型

- **單元測試**: 使用 Jest，測試 API 路由和配置模組
  - API 路由測試：`src/app/api/change-password/route.test.ts`
  - 配置測試：`src/config/ldap.config.test.ts`
- **E2E 測試**: 使用 Playwright，測試完整的用戶流程和跨瀏覽器兼容性

## 多語系管理

本專案使用 **YAML 檔案**管理多語系內容，所有語系檔案位於 `src/i18n/locales/` 目錄：

- `en.yaml` - 英文（預設語系）
- `zh-TW.yaml` - 繁體中文
- `ja.yaml` - 日文

### 新增或修改語系內容

1. 編輯對應的 YAML 檔案（例如 `src/i18n/locales/en.yaml`）
2. 確保所有語系檔案的結構一致
3. 重新啟動開發伺服器以載入變更

### YAML 檔案結構範例

```yaml
common:
  changePassword: 'Change Password'
  submit: 'Submit'

home:
  title: 'LDAP Password Change Portal'
  description: 'Change your LDAP password securely'
```

## LDAP 串接

### 架構說明

由於 `ldapts` 套件無法在瀏覽器環境中運行（需要 Node.js 的 `net`、`tls` 等模組），LDAP 操作必須在後端進行。

本專案使用 **Next.js API 路由**實作後端 LDAP 操作：

```
前端 (React) → Next.js API Route → LDAP 伺服器
```

### API 端點

**POST** `/api/change-password`

**請求格式**：

```json
{
  "account": "username",
  "currentPassword": "oldPassword123!",
  "newPassword": "newPassword123!"
}
```

**成功回應**（200）：

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**錯誤回應**：

- `400`: 參數錯誤或密碼策略違規
- `401`: 目前密碼錯誤（LDAP 錯誤碼 49）
- `500`: LDAP 操作失敗

### 前端配置

前端透過 `src/services/passwordService.ts` 呼叫後端 API：

```typescript
import { changePassword } from '@/services/passwordService';

await changePassword(account, currentPassword, newPassword);
```

環境變數配置（`.env` 檔案）：

```env
# 後端 API 端點 URL（Next.js API 路由）
NEXT_PUBLIC_API_URL=/api/change-password
```

### 後端實作

後端 API 路由位於 `src/app/api/change-password/route.ts`，使用 **ldapts** 套件進行 LDAP 操作：

1. **驗證目前密碼**：使用 `bind` 操作驗證使用者目前密碼
2. **修改密碼**：使用 `modify` 操作更新密碼

詳細的實作程式碼請參考 `src/app/api/change-password/route.ts`。

### LDAP 伺服器支援

- **OpenLDAP**: 使用 `userPassword` 屬性
- **Active Directory**: 使用 `unicodePwd` 屬性（需要 UTF-16LE 編碼）
- **其他 LDAP 伺服器**: 請根據實際情況調整密碼屬性名稱

### 後端環境變數配置

後端需要設定以下環境變數：

```env
# LDAP 連線配置
LDAP_URL=ldaps://ldap.example.com:636
LDAP_BASE_DN=dc=example,dc=com
LDAP_LOGIN_ATTRIBUTE=uid
LDAP_USER_DN_TEMPLATE=uid={username},ou=users,dc=example,dc=com
LDAP_REJECT_UNAUTHORIZED=true
```

### OpenLDAP Login Attribute 設定

在後端的 `.env` 檔案中設定 `LDAP_LOGIN_ATTRIBUTE`：

```env
# OpenLDAP 的登入屬性
# 常見值：uid, cn, mail
LDAP_LOGIN_ATTRIBUTE=uid
```

如果設定了 `LDAP_LOGIN_ATTRIBUTE`，系統會自動構建 DN 格式為：`{loginAttribute}={username},{baseDN}`

例如：`uid=john,dc=example,dc=com`

如果需要包含組織單位，可以明確指定 `LDAP_USER_DN_TEMPLATE`：

```env
LDAP_USER_DN_TEMPLATE=uid={username},ou=users,dc=example,dc=com
```

### LDAP 錯誤碼處理

- **49**: 認證失敗（目前密碼不正確）
- **53**: 密碼策略違規（新密碼不符合策略要求）
- **19**: 約束違規（例如：不能與舊密碼相同）

## 授權

MIT License

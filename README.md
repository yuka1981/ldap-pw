# LDAP Password Change Portal

一個符合現代 Web 設計標準的 LDAP 密碼修改入口網站，支援多語系（繁體中文、日文、英文）。

## 功能特色

- ✅ 響應式設計 (RWD)
- ✅ 多語系支援（繁體中文、日文、英文，預設英文）
- ✅ 符合蘋果人機界面指南的設計風格
- ✅ 現代化的 UI/UX 設計
- ✅ 完整的表單驗證
- ✅ 測試驅動開發 (TDD)

## 技術棧

- **React 18** + **TypeScript**
- **Vite** - 建置工具
- **React Router** - 路由管理
- **Vitest** + **React Testing Library** - 單元測試框架
- **Playwright** - E2E 測試框架
- **@rollup/plugin-yaml** - YAML 檔案支援（多語系管理）
- **CSS3** - 樣式（使用 CSS Variables）

## 開始使用

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動

### 執行測試

#### 單元測試

```bash
# 執行所有單元測試
npm test

# 執行測試並顯示 UI
npm run test:ui

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
├── components/          # React 組件
│   ├── Home/           # 主頁組件
│   ├── ChangePassword/ # 修改密碼表單組件
│   └── LanguageSelector/ # 語言選擇器
├── contexts/           # React Context
│   └── I18nContext.tsx # 多語系 Context
├── i18n/               # 多語系資源
│   ├── locales/        # 語言檔案 (YAML 格式)
│   │   ├── en.yaml     # 英文
│   │   ├── zh-TW.yaml  # 繁體中文
│   │   └── ja.yaml     # 日文
│   └── index.ts        # 多語系工具函數
├── services/           # API 服務
│   └── passwordService.ts # 密碼修改服務
├── styles/             # 全域樣式
│   └── global.css      # CSS Variables 和基礎樣式
├── utils/              # 工具函數
│   └── passwordValidation.ts # 密碼驗證邏輯
├── test/               # 單元測試設定
│   └── setup.ts        # 測試環境設定
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

本專案採用 **Test-Driven Development (TDD)** 開發方式：

1. 先撰寫測試案例
2. 執行測試（應該會失敗）
3. 實作功能以通過測試
4. 重構程式碼

所有組件和工具函數都包含對應的測試檔案。

### 測試類型

- **單元測試**: 使用 Vitest + React Testing Library，測試組件和工具函數
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

## 授權

MIT License

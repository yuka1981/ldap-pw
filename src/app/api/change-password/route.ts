/**
 * LDAP 密碼修改 API 路由
 * 
 * 此 API 端點處理 LDAP 密碼修改請求
 * POST /api/change-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Change, Attribute } from 'ldapts';
import { getLDAPConfig, buildUserDN } from '@/config/ldap.config';

export interface ChangePasswordRequest {
  account: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  code?: number;
}

/**
 * 處理 LDAP 密碼修改請求
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChangePasswordRequest = await request.json();
    const { account, currentPassword, newPassword } = body;

    // 參數驗證
    if (!account || !currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Account, current password and new password are required',
        },
        { status: 400 }
      );
    }

    // 取得 LDAP 配置
    const config = getLDAPConfig();
    const userDN = buildUserDN(account, config);

    // 建立 LDAP 客戶端
    const client = new Client({
      url: config.url,
      timeout: config.timeout || 10000,
      connectTimeout: config.timeout || 10000,
      tlsOptions: config.tlsOptions,
      strictDN: true,
    });

    try {
      // 步驟 1: 驗證目前密碼（bind 操作）
      try {
        await client.bind(userDN, currentPassword);
      } catch (bindError: any) {
        // LDAP 錯誤碼 49: 認證失敗（Invalid Credentials）
        if (bindError.code === 49) {
          return NextResponse.json(
            {
              success: false,
              message: 'Current password is incorrect',
              code: 49,
            },
            { status: 401 }
          );
        }
        throw bindError;
      }

      // 步驟 2: 修改密碼（modify 操作）
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
        // LDAP 錯誤碼 53: 密碼策略違規（Password Policy Violation）
        if (modifyError.code === 53) {
          return NextResponse.json(
            {
              success: false,
              message: 'Password does not meet policy requirements',
              code: 53,
            },
            { status: 400 }
          );
        }
        // LDAP 錯誤碼 19: 約束違規（例如：不能與舊密碼相同）
        if (modifyError.code === 19) {
          return NextResponse.json(
            {
              success: false,
              message: 'Password constraint violation',
              code: 19,
            },
            { status: 400 }
          );
        }
        throw modifyError;
      }

      // 成功回應
      return NextResponse.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error: any) {
      // 處理其他 LDAP 錯誤
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'LDAP operation failed',
          code: error.code,
        },
        { status: 500 }
      );
    } finally {
      // 確保關閉 LDAP 連線
      try {
        await client.unbind();
      } catch (unbindError) {
        console.warn('Failed to unbind LDAP connection:', unbindError);
      }
    }
  } catch (error: any) {
    // 處理 JSON 解析錯誤或其他請求錯誤
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Invalid request',
      },
      { status: 400 }
    );
  }
}


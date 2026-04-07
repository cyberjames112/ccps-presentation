import { Resend } from "resend";

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "cyberjames112@gmail.com";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured");
    return null;
  }
  return new Resend(apiKey);
}

export type BookingEmailData = {
  name: string;
  phone: string;
  tripDays: "3d2n" | "4d3n";
  tripDate: string | null;
  groupSize: number;
  totalAmount: number;
};

function formatTripDays(tripDays: string): string {
  return tripDays === "3d2n" ? "三天兩夜" : "四天三夜";
}

function formatCurrency(amount: number): string {
  return `NT$${amount.toLocaleString("zh-TW")}`;
}

function buildEmailHtml(data: BookingEmailData): string {
  const tripLabel = formatTripDays(data.tripDays);
  const totalFormatted = formatCurrency(data.totalAmount);
  const perPerson = formatCurrency(data.totalAmount / data.groupSize);
  const dateDisplay = data.tripDate || "待確認";

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Microsoft JhengHei','PingFang TC',sans-serif;">
  <div style="max-width:600px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a8a7d,#15756a);padding:28px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;letter-spacing:1px;">
        📋 新考察團報名通知
      </h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
        有新客戶完成報名，以下為完整資訊
      </p>
    </div>

    <!-- Content -->
    <div style="padding:28px 32px;">
      
      <!-- Info Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:12px 16px;background:#f8fffe;border-bottom:1px solid #e8f5f3;color:#666;font-size:14px;width:120px;">
            👤 姓名
          </td>
          <td style="padding:12px 16px;background:#f8fffe;border-bottom:1px solid #e8f5f3;font-size:15px;font-weight:700;color:#333;">
            ${data.name}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#666;font-size:14px;">
            📞 電話
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:15px;font-weight:700;color:#333;">
            ${data.phone}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fffe;border-bottom:1px solid #e8f5f3;color:#666;font-size:14px;">
            🗓️ 行程
          </td>
          <td style="padding:12px 16px;background:#f8fffe;border-bottom:1px solid #e8f5f3;font-size:15px;font-weight:700;color:#333;">
            ${tripLabel}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#666;font-size:14px;">
            📅 出團日期
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:15px;font-weight:700;color:#333;">
            ${dateDisplay}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fffe;border-bottom:1px solid #e8f5f3;color:#666;font-size:14px;">
            👥 同行人數
          </td>
          <td style="padding:12px 16px;background:#f8fffe;border-bottom:1px solid #e8f5f3;font-size:15px;font-weight:700;color:#333;">
            ${data.groupSize} 人
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#666;font-size:14px;">
            💰 每位費用
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:15px;font-weight:700;color:#333;">
            ${perPerson}
          </td>
        </tr>
      </table>

      <!-- Total -->
      <div style="background:linear-gradient(135deg,#fdf8ed,#fef3d6);border:2px solid #d4a843;border-radius:10px;padding:18px 24px;text-align:center;margin-bottom:20px;">
        <p style="margin:0 0 4px;color:#8a6d2b;font-size:13px;">預估總金額</p>
        <p style="margin:0;color:#d4a843;font-size:28px;font-weight:900;letter-spacing:1px;">
          ${totalFormatted}
        </p>
      </div>

      <!-- Timestamp -->
      <p style="color:#999;font-size:12px;text-align:center;margin:16px 0 0;">
        報名時間：${new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f8f8;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;color:#999;font-size:12px;">
        此郵件由 CCPS 家慶佳業 報名系統自動發送
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBookingNotification(
  data: BookingEmailData
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[Email] Cannot send notification: Resend client not available");
    return false;
  }

  const tripLabel = formatTripDays(data.tripDays);
  const totalFormatted = formatCurrency(data.totalAmount);

  try {
    const { error } = await resend.emails.send({
      from: "CCPS 家慶佳業 <jamespai@ccpsmy.com>",
      to: [NOTIFICATION_EMAIL],
      subject: `【新報名】${data.name} - ${tripLabel} ${data.groupSize}人 ${totalFormatted}`,
      html: buildEmailHtml(data),
    });

    if (error) {
      console.error("[Email] Failed to send notification:", error);
      return false;
    }

    console.log(`[Email] Booking notification sent for ${data.name}`);
    return true;
  } catch (err) {
    console.error("[Email] Error sending notification:", err);
    return false;
  }
}

/**
 * Validate that the Resend API key is working.
 * Note: The key may be restricted to send-only, so domains.list returns
 * a "restricted_api_key" error which still confirms the key is valid.
 */
export async function validateResendApiKey(): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  try {
    const { error } = await resend.domains.list();
    // No error = full access key, valid
    if (!error) return true;
    // restricted_api_key = send-only key, still valid for our purpose
    if (error.name === "restricted_api_key") return true;
    return false;
  } catch {
    return false;
  }
}

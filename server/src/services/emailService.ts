import nodemailer from 'nodemailer';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryAddress: string | null;
  preferredDate: string | Date;
  customerNotes?: string | null;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: Array<{
    quantity: number;
    productName: string;
    price: number;
    customization?: string;
  }>;
}

function formatEmailCustomization(raw?: string): string {
  if (!raw) return '';
  try {
    if (raw.startsWith('{') || raw.startsWith('[')) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        const parts: string[] = [];
        if (parsed.flavor) parts.push(`Flavor: ${parsed.flavor}`);
        if (parsed.size) parts.push(`Size: ${parsed.size}`);
        if (parsed.tier || parsed.tiers) parts.push(`Tiers: ${parsed.tier || parsed.tiers}`);
        if (parsed.message) parts.push(`Inscription: "${parsed.message}"`);
        if (parsed.dietary) parts.push(`Dietary: ${parsed.dietary}`);
        if (parsed.notes) parts.push(`Note: ${parsed.notes}`);
        return parts.length > 0 ? parts.join(' • ') : raw;
      }
    }
  } catch (e) {
    // fallback
  }
  return raw.replace(/[{}"]/g, '');
}

export function generateOrderEmailHtml(data: OrderEmailData): string {
  const formattedDate = new Date(data.preferredDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const itemsRows = data.items.map(item => {
    const formattedCust = formatEmailCustomization(item.customization);
    return `
    <tr style="border-bottom: 1px solid #F4EBE1;">
      <td style="padding: 12px 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2C1810; font-size: 14px;">
        <strong>${item.productName}</strong>
        ${formattedCust ? `<br/><span style="font-size: 12px; color: #8C6D4F;">• ${formattedCust}</span>` : ''}
      </td>
      <td style="padding: 12px 8px; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #4A3B32; font-size: 14px;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #721C24; font-weight: bold; font-size: 14px;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - The Velvet Cake Co.</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Georgia', serif, Arial;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8DFC8; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #21110C; padding: 35px 25px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #D4AF37; font-family: sans-serif; font-weight: bold; display: block; margin-bottom: 6px;">
                Manhattan's Bespoke Patisserie
              </span>
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 28px; color: #FFFFFF; letter-spacing: 1px;">
                The Velvet Cake Co.
              </h1>
              <p style="margin: 6px 0 0; color: #C9BAAF; font-size: 12px; font-family: sans-serif;">
                245 Lexington Ave, Manhattan, New York, NY 10016
              </p>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="padding: 30px 25px 20px; text-align: center;">
              <div style="display: inline-block; background-color: #E8F5E9; color: #2E7D32; font-family: sans-serif; font-size: 12px; font-weight: bold; padding: 6px 16px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                ✓ Order Confirmed & Paid
              </div>
              <h2 style="margin: 0 0 8px; font-family: 'Georgia', serif; font-size: 22px; color: #2C1810;">
                Thank you for your order, ${data.customerName}!
              </h2>
              <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #6E5A4E; line-height: 1.5;">
                We have received your order and our master bakers are preparing your artisanal cake selection.
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 10px 25px 25px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border: 1px solid #E8DFC8; border-radius: 12px; padding: 18px;">
                <tr>
                  <td style="font-family: sans-serif; font-size: 12px; color: #8C6D4F; text-transform: uppercase; letter-spacing: 1px;">
                    Order Reference:
                  </td>
                  <td style="text-align: right; font-family: 'Courier New', monospace; font-size: 15px; font-weight: bold; color: #721C24;">
                    ${data.orderNumber}
                  </td>
                </tr>
                <tr>
                  <td style="font-family: sans-serif; font-size: 12px; color: #8C6D4F; padding-top: 8px;">
                    Delivery Method:
                  </td>
                  <td style="text-align: right; font-family: sans-serif; font-size: 13px; font-weight: bold; color: #2C1810; padding-top: 8px;">
                    ${data.deliveryMethod.replace(/_/g, ' ')}
                  </td>
                </tr>
                <tr>
                  <td style="font-family: sans-serif; font-size: 12px; color: #8C6D4F; padding-top: 8px;">
                    Target Date:
                  </td>
                  <td style="text-align: right; font-family: sans-serif; font-size: 13px; font-weight: bold; color: #2C1810; padding-top: 8px;">
                    ${formattedDate}
                  </td>
                </tr>
                ${data.deliveryAddress ? `
                <tr>
                  <td style="font-family: sans-serif; font-size: 12px; color: #8C6D4F; padding-top: 8px;">
                    Delivery Destination:
                  </td>
                  <td style="text-align: right; font-family: sans-serif; font-size: 13px; color: #2C1810; padding-top: 8px;">
                    ${data.deliveryAddress}
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 25px 20px;">
              <h3 style="margin: 0 0 12px; font-family: 'Georgia', serif; font-size: 16px; color: #2C1810; border-bottom: 2px solid #F4EBE1; padding-bottom: 6px;">
                Ordered Delicacies
              </h3>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #E8DFC8;">
                    <th style="text-align: left; padding: 8px; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #8C6D4F;">Item</th>
                    <th style="text-align: center; padding: 8px; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #8C6D4F;">Qty</th>
                    <th style="text-align: right; padding: 8px; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #8C6D4F;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown -->
          <tr>
            <td style="padding: 0 25px 25px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="border-top: 2px solid #E8DFC8; padding-top: 12px;">
                <tr>
                  <td style="font-family: sans-serif; font-size: 13px; color: #6E5A4E;">Subtotal</td>
                  <td style="text-align: right; font-family: sans-serif; font-size: 13px; color: #2C1810;">$${data.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="font-family: sans-serif; font-size: 13px; color: #6E5A4E; padding-top: 6px;">Delivery Fee</td>
                  <td style="text-align: right; font-family: sans-serif; font-size: 13px; color: #2C1810; padding-top: 6px;">
                    ${data.deliveryFee === 0 ? '<span style="color: #2E7D32; font-weight: bold;">FREE</span>' : `$${data.deliveryFee.toFixed(2)}`}
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'Georgia', serif; font-size: 16px; font-weight: bold; color: #2C1810; padding-top: 12px; border-top: 1px dashed #E8DFC8;">Total Paid</td>
                  <td style="text-align: right; font-family: 'Georgia', serif; font-size: 18px; font-weight: bold; color: #721C24; padding-top: 12px; border-top: 1px dashed #E8DFC8;">
                    $${data.total.toFixed(2)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Support Footer -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 20px 25px; border-top: 1px solid #E8DFC8; text-align: center;">
              <p style="margin: 0 0 6px; font-family: sans-serif; font-size: 13px; font-weight: bold; color: #2C1810;">
                Need to modify your order or timing?
              </p>
              <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #6E5A4E; line-height: 1.5;">
                Call our direct patisserie line: <strong>+1 (212) 555-0187</strong> or reply to <strong>orders@thevelvetcakeco.com</strong><br/>
                Visit us: 245 Lexington Avenue, Murray Hill, Manhattan, NY 10016
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<{
  success: boolean;
  simulated: boolean;
  messageId?: string;
  error?: string;
  htmlContent: string;
}> {
  const htmlContent = generateOrderEmailHtml(data);
  const subject = `Order Confirmed: ${data.orderNumber} - The Velvet Cake Co.`;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const from = process.env.SMTP_FROM || '"The Velvet Cake Co." <orders@thevelvetcakeco.com>';

  // If SMTP is properly configured with credentials
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from,
        to: data.customerEmail,
        subject,
        html: htmlContent,
      });

      console.log(`[Email Service] Live confirmation email dispatched to ${data.customerEmail}. Message ID: ${info.messageId}`);
      return {
        success: true,
        simulated: false,
        messageId: info.messageId,
        htmlContent,
      };
    } catch (err: any) {
      console.warn(`[Email Service] SMTP send failed: ${err.message}. Falling back to digital receipt generation.`);
    }
  }

  // Graceful simulated logging when in sandbox/preview or when SMTP is not configured
  console.log('====================================================');
  console.log(`[EMAIL CONFIRMATION DISPATCHED (PREVIEW / SANDBOX)]`);
  console.log(`TO: ${data.customerEmail}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`ORDER REF: ${data.orderNumber}`);
  console.log(`TOTAL: $${data.total.toFixed(2)}`);
  console.log(`DELIVERY: ${data.deliveryMethod} on ${new Date(data.preferredDate).toDateString()}`);
  console.log('====================================================');

  return {
    success: true,
    simulated: true,
    htmlContent,
  };
}

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from .config import settings
import logging

# Set up the email config. Use suppress_send = True if no credentials are provided so it doesn't crash.
conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username or "test@example.com",
    MAIL_PASSWORD=settings.mail_password or "password",
    MAIL_FROM=settings.mail_from or "test@example.com",
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=bool(settings.mail_username),
    VALIDATE_CERTS=True,
    SUPPRESS_SEND=not bool(settings.mail_username)  # Don't try to actually send if credentials are empty
)

_ROW_COUNTER = [0]

def _detail_row(label: str, value: str) -> str:
    """Returns a styled, alternating-background HTML table row for an order detail."""
    _ROW_COUNTER[0] += 1
    bg = "#FAF6F3" if _ROW_COUNTER[0] % 2 == 0 else "#FDFAF7"
    return f"""
        <tr style="background-color:{bg};">
          <td style="padding:12px 22px;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#9A8478;width:42%;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;border-bottom:1px solid #EDE5E0;">{label}</td>
          <td style="padding:12px 22px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#2C1A1A;font-weight:600;border-bottom:1px solid #EDE5E0;">{value}</td>
        </tr>"""


async def send_order_confirmation(contact_info: str, customer_name: str, order_details: dict):
    _ROW_COUNTER[0] = 0  # reset alternating row counter per email

    if not settings.mail_username:
        logging.warning("Email credentials not configured. Skipping actual email send. Set MAIL_USERNAME in .env to enable.")

    # Determine if the contact info provided is an email address
    is_email = "@" in contact_info and "." in contact_info
    
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Blosoom Reverie Order</title>
    </head>
    <body style="margin:0;padding:0;background-color:#F5EDE8;font-family:Georgia,'Times New Roman',serif;">

      <!-- Outer wrapper -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F5EDE8;padding:40px 16px;">
        <tr><td align="center">

          <!-- Card -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:580px;background-color:#FDFAF7;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(44,26,26,0.12);">

            <!-- ══ HEADER BAND ══ -->
            <tr>
              <td align="center" style="background:linear-gradient(160deg,#2C1A1A 0%,#4A2C2C 60%,#6A3838 100%);padding:48px 40px 36px;">

                <!-- Petal art row -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <!-- Three decorative circles as petal clusters -->
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:0 6px;">
                            <div style="width:36px;height:36px;border-radius:50%;background:rgba(196,150,138,0.18);border:1px solid rgba(196,150,138,0.35);display:inline-block;line-height:36px;text-align:center;font-size:18px;">🌸</div>
                          </td>
                          <td style="padding:0 6px;">
                            <div style="width:48px;height:48px;border-radius:50%;background:rgba(196,150,138,0.25);border:1px solid rgba(196,150,138,0.5);display:inline-block;line-height:48px;text-align:center;font-size:24px;">🌸</div>
                          </td>
                          <td style="padding:0 6px;">
                            <div style="width:36px;height:36px;border-radius:50%;background:rgba(196,150,138,0.18);border:1px solid rgba(196,150,138,0.35);display:inline-block;line-height:36px;text-align:center;font-size:18px;">🌸</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:38px;color:#FDFAF7;margin:0;font-style:italic;font-weight:400;letter-spacing:0.02em;line-height:1.1;">Blosoom Reverie</h1>
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:5px;text-transform:uppercase;color:#C4968A;margin:14px 0 0 0;font-weight:600;">Order Confirmation</p>

                <!-- Rose divider line -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top:20px;">
                  <tr>
                    <td style="border-top:1px solid rgba(196,150,138,0.3);font-size:0;line-height:0;">&nbsp;</td>
                    <td width="24" align="center" style="padding:0 12px;color:#C4968A;font-size:14px;">✦</td>
                    <td style="border-top:1px solid rgba(196,150,138,0.3);font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- ══ GREETING ══ -->
            <tr>
              <td style="padding:40px 44px 0;">
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#5A4A44;line-height:1.9;margin:0 0 16px 0;font-weight:300;">
                  Dear <strong style="font-weight:600;color:#2C1A1A;">{customer_name}</strong>,
                </p>
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#6A5A54;line-height:1.9;margin:0;">
                  Thank you so much for choosing <strong style="font-weight:600;color:#2C1A1A;">Blosoom Reverie.</strong> We have received your custom order request and are absolutely thrilled to begin crafting something uniquely beautiful — made only for them. 🌸
                </p>
              </td>
            </tr>

            <!-- ══ ORDER DETAILS BOX ══ -->
            <tr>
              <td style="padding:28px 44px 0;">

                <!-- Box -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF6F3;border:1px solid #E8DDD7;border-radius:10px;overflow:hidden;">
                  <tr>
                    <td>

                      <!-- Box header -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="background:linear-gradient(90deg,#F0E6E0 0%,#FAF6F3 100%);padding:16px 22px;border-bottom:1px solid #E8DDD7;">
                            <p style="font-family:Helvetica,Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#8C4A40;margin:0;font-weight:700;">✦ &nbsp;Your Order Details</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Detail rows -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:8px 0;">

                        {_detail_row('Collection', order_details.get('collection_id') or 'Custom Signature')}
                        {_detail_row('Occasion', order_details.get('occasion') or 'Not specified')}
                        {_detail_row('Budget Range', order_details.get('budget_range') or 'Not specified')}
                        {_detail_row('Delivery Date', order_details.get('preferred_date') or 'Flexible')}
                        {_detail_row('Photos', str(order_details.get('photo_count') or '—'))}
                        {_detail_row('Email', contact_info)}
                        {_detail_row('WhatsApp / Mobile', order_details.get('phone') or 'Not provided')}

                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ WHAT'S NEXT ══ -->
            <tr>
              <td style="padding:32px 44px 0;">

                <!-- Ornament divider -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                  <tr>
                    <td style="border-top:1px solid #E8DDD7;font-size:0;line-height:0;">&nbsp;</td>
                    <td width="32" align="center" style="padding:0 10px;color:#C4968A;font-size:12px;font-family:Georgia,serif;">✦</td>
                    <td style="border-top:1px solid #E8DDD7;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>

                <p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8C4A40;margin:0 0 10px 0;font-weight:700;">What happens next?</p>
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#6A5A54;line-height:1.9;margin:0;">
                  We will carefully review your details and reach out to you via <strong style="color:#2C1A1A;font-weight:600;">email or WhatsApp within 24 hours</strong> to talk through your photos, refine your vision, and begin making something made for no one else but them.
                </p>
              </td>
            </tr>

            <!-- ══ CTA BUTTON ══ -->
            <tr>
              <td align="center" style="padding:32px 44px 0;">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color:#2C1A1A;border-radius:4px;">
                      <a href="https://blosoomreverie.com/collections" style="display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#FDFAF7;text-decoration:none;padding:14px 32px;font-weight:600;">
                        Browse Collections
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ══ SIGNATURE ══ -->
            <tr>
              <td style="padding:36px 44px 44px;">

                <!-- Thin divider -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:28px;">
                  <tr>
                    <td style="border-top:1px solid #E8DDD7;font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                </table>

                <p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#6A5A54;line-height:1.8;margin:0 0 4px 0;font-weight:300;">Warmest regards,</p>
                <p style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#C4968A;font-style:italic;margin:0;">The Blosoom Reverie Team</p>
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#B0A09A;margin:8px 0 0 0;letter-spacing:0.5px;">Handmade Gifting Studio · Pimpri, Maharashtra, India</p>
              </td>
            </tr>

            <!-- ══ FOOTER BAND ══ -->
            <tr>
              <td align="center" style="background-color:#2C1A1A;padding:22px 40px;">
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#7A6A66;margin:0;line-height:1.8;">
                  You're receiving this because you placed an order with Blosoom Reverie.<br>
                  <span style="color:#8C4A40;">🌸 &nbsp;blosoomreverie.com</span>
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>

    </body>
    </html>
    """

    recipients = []
    
    # Send to the customer if they provided an email
    if is_email:
        recipients.append(contact_info)
        
    # Always BCC the studio owner so they get an instant notification!
    if settings.mail_username:
        recipients.append(settings.mail_username)
        
    if not recipients:
        logging.info("No email recipients available. Customer provided phone number and no studio email configured.")
        return

    message = MessageSchema(
        subject="Your Blosoom Reverie Order Details",
        recipients=recipients,
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        logging.info(f"Order confirmation email initiated for {recipients}")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

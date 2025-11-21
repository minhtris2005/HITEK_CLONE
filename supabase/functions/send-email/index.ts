import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, message, customerEmail, customerName } = await req.json()

    console.log('📧 Sending emails...')

    // 1. GỬI EMAIL CHO CÔNG TY (thông báo có liên hệ mới)
    const companyEmailPromise = fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }], // Email công ty
          subject: `📩 LIÊN HỆ MỚI: ${subject}`
        }],
        from: { 
          email: 'phamnguyenminhtri249@gmail.com', // 👈 EMAIL ĐÃ VERIFY
          name: 'Hitek Clone Website' 
        },
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">📩 Có liên hệ mới từ website!</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>👤 Thông tin khách hàng:</h3>
                <p><strong>Họ tên:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Tiêu đề:</strong> ${subject}</p>
                
                <h3>📝 Nội dung:</h3>
                <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <p style="color: #64748b;">
                <em>Email được gửi tự động từ form liên hệ website Hitek Clone</em>
              </p>
            </div>
          `
        }]
      }),
    })

    // 2. GỬI EMAIL CHO KHÁCH HÀNG (xác nhận đã nhận)
    const customerEmailPromise = fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: customerEmail }], // Email khách hàng
          subject: `✅ Hitek Clone đã nhận liên hệ của bạn`
        }],
        from: { 
          email: 'phamnguyenminhtri249@gmail.com', // 👈 EMAIL ĐÃ VERIFY
          name: 'Hitek Clone' 
        },
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981;">✅ Cảm ơn bạn đã liên hệ với Hitek Clone!</h2>
              
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p>Xin chào <strong>${customerName}</strong>,</p>
                <p>Chúng tôi đã nhận được thông tin liên hệ của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <strong>Nội dung bạn đã gửi:</strong>
                  <div style="margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 4px;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b;">
                <p><strong>Hitek Clone</strong></p>
                <p>📞 Hotline: 0123.456.789</p>
                <p>📧 Email: contact@hitekclone.com</p>
              </div>
            </div>
          `
        }]
      }),
    })

    // CHỜ CẢ 2 EMAIL HOÀN THÀNH
    const [companyResponse, customerResponse] = await Promise.all([
      companyEmailPromise,
      customerEmailPromise
    ])

    // KIỂM TRA LỖI CHI TIẾT
    if (!companyResponse.ok) {
      const companyError = await companyResponse.text()
      console.error('❌ Company email error:', companyError)
      throw new Error(`Company email failed: ${companyResponse.status} - ${companyError}`)
    }

    if (!customerResponse.ok) {
      const customerError = await customerResponse.text()
      console.error('❌ Customer email error:', customerError)
      throw new Error(`Customer email failed: ${customerResponse.status} - ${customerError}`)
    }

    console.log('✅ Both emails sent successfully!')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent to both company and customer!'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    )

  } catch (error) {
    console.error('💥 Function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    )
  }
})
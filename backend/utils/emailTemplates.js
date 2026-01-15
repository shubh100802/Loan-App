// Signup / Email Verification OTP
export const signupOtpEmail = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;">
      
      <div style="background:#4f46e5; padding:20px; text-align:center;">
        <h2 style="color:#ffffff; margin:0;">🔐 Verify Your Email</h2>
      </div>

      <div style="padding:30px; color:#333;">
        <p>Hi <strong>${name}</strong> 👋,</p>

        <p>
          Welcome to <strong>MyLoanCredit</strong> 🎉<br/>
          To complete your registration, please verify your email address using the OTP below.
        </p>

        <div style="margin:25px 0; padding:20px; background:#f3f4f6; text-align:center; border-radius:8px;">
          <p style="margin:0; font-size:14px; color:#555;">Your Verification Code</p>
          <p style="margin:10px 0 0; font-size:32px; font-weight:bold; color:#4f46e5;">
            ${otp}
          </p>
        </div>

        <p>
          ⏳ This OTP is valid for <strong>5 minutes</strong>.<br/>
          Please do not share this code with anyone.
        </p>

        <p style="margin-top:25px;">
          If you did not try to create an account on MyLoanCredit, you can safely ignore this email.
        </p>

        <p style="margin-top:30px;">
          🤝 Regards,<br/>
          <strong>Team MyLoanCredit - Shubham Raj Sharma</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; font-size:12px; color:#666; text-align:center;">
        ⚠️ This is an automated email. Please do not reply.
      </div>

    </div>
  `;
};

export const welcomeApplauseEmail = ({ name }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;">
      
      <div style="background:#4f46e5; padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">Welcome to MyLoanCredit 🎉</h1>
      </div>

      <div style="padding:30px; color:#333;">
        <p>Hi <strong>${name}</strong>,</p>

        <p>
          🎉 <strong>Congratulations!</strong> Your MyLoanCredit account has been
          <strong>successfully verified</strong>.
        </p>

        <p>
          You can now explore loan offers, manage applications, and track your journey
          — all in one place.
        </p>

        <div style="margin:30px 0; text-align:center;">
          <a href="https://myloancredit.com/login.html"
            style="background:#4f46e5; color:#fff; padding:12px 22px;
                    text-decoration:none; border-radius:6px; font-weight:bold;">
            🚀 Go to Dashboard
          </a>
        </div>

        <p>
          Need help? Our support team is always ready to assist you.
        </p>

        <p style="margin-top:30px;">
          Cheers,<br />
          <strong>Team MyLoanCredit - Shubham Raj Sharma</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; font-size:12px; color:#666; text-align:center;">
        This is an automated email. Please do not reply.
      </div>

    </div>
  `;
};



export const passwordChangedEmail = ({ name }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;">
      
      <div style="background:#111827; padding:20px; text-align:center;">
        <h2 style="color:#ffffff; margin:0;">🔐 Password Changed Successfully</h2>
      </div>

      <div style="padding:30px; color:#333;">
        <p>Hi <strong>${name}</strong>,</p>

        <p>
          This is a confirmation that your <strong>MyLoanCredit account password</strong>
          was changed successfully.
        </p>

        <div style="margin:20px 0; padding:15px; background:#fef2f2; border-left:4px solid #ef4444;">
          <strong>Did not make this change?</strong><br/>
          Please contact our support team immediately to secure your account.
        </div>

        <div style="margin:30px 0; text-align:center;">
          <a href="https://myloancredit.com/login.html"
            style="background:#4f46e5; color:#fff; padding:12px 22px;
                    text-decoration:none; border-radius:6px; font-weight:bold;">
            🔑 Login to Account
          </a>
        </div>

        <p style="margin-top:30px;">
          Stay safe,<br />
          <strong>Team MyLoanCredit - Shubham Raj Sharma</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; font-size:12px; color:#666; text-align:center;">
        Security notification from MyLoanCredit
      </div>

    </div>
  `;
};

export const passwordResetEmail = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;">
      
      <div style="background:#111827; padding:20px; text-align:center;">
        <h2 style="color:#ffffff; margin:0;">🔐 Password Reset Request</h2>
      </div>

      <div style="padding:30px; color:#333;">
        <p>Hi <strong>${name}</strong>,</p>

        <p>
          You have requested to reset your MyLoanCredit account password.
        </p>

        <div style="margin:20px 0; padding:15px; background:#fef2f2; border-left:4px solid #ef4444;">
          <strong>Verification Code:</strong><br/>
          <strong style="font-size:24px; color:#4f46e5;">${otp}</strong>
        </div>

        <p>
          This code will expire in 5 minutes. If you did not request this, please ignore this email.
        </p>

        <p style="margin-top:30px;">
          Stay safe,<br />
          <strong>Team MyLoanCredit - Shubham Raj Sharma</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; font-size:12px; color:#666; text-align:center;">
        Security notification from MyLoanCredit
      </div>

    </div>
  `;
};


// Loan Application Submitted Email
export const loanApplicationSubmittedEmail = ({
  name,
  bankName,
  loanName,
  loanAmount,
  loanPurpose,
  applicationId,
  status,
  appliedAt
}) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; background:#ffffff;">
      
      <div style="background:#2563eb; padding:20px; text-align:center;">
        <h2 style="color:#ffffff; margin:0;">📨 Loan Application Submitted</h2>
      </div>

      <div style="padding:30px; color:#333;">
        <p>Hi <strong>${name}</strong> 👋,</p>

        <p>
          Thank you for applying for a loan on <strong>MyLoanCredit</strong> 💙.<br/>
          Your application has been <strong>successfully submitted</strong> ✅ and is currently under review 🔍.
        </p>

        <h3 style="margin-top:25px;">📄 Application Details</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;">🏦 Bank</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${bankName}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;">📌 Loan Type</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${loanName}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;">💰 Loan Amount</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">₹${loanAmount}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;">🎯 Purpose</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${loanPurpose}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;">🆔 Application ID</td>
            <td style="padding:8px; border:1px solid #e5e7eb;">${applicationId}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #e5e7eb;">📊 Status</td>
            <td style="padding:8px; border:1px solid #e5e7eb; text-transform:capitalize;">
              ${status}
            </td>
          </tr>
        </table>

        <p style="margin-top:20px;">
          📅 <strong>Submitted on:</strong> ${new Date(appliedAt).toLocaleString()}
        </p>

        <p style="margin-top:25px;">
          ⏳ Our team will review your application carefully.<br/>
          📢 If any additional information is required or if there is any update,
          we will notify you via email or phone.
        </p>

        <p style="margin-top:30px;">
          🤝 Regards,<br/>
          <strong>Team MyLoanCredit - Shubham Raj Sharma</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; font-size:12px; color:#666; text-align:center;">
        ⚠️ This is an automated email. Please do not reply.
      </div>

    </div>
  `;
};




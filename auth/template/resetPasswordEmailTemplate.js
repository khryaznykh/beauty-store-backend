module.exports = (token, port) => {
    const link = `${port}/refresh-password/${token}`;
    return
    `
    <div>
        <h1>Password Reset</h1>
        <p>Hi,</p>
        <p>We received a request to reset the password for your BeautyWorld's account.</p>
        <p>If you made this request, please click the link below to set a new password:</p>
        <a href="${link}"> Password reset</a>
        <p>If you did not request a password reset, you can safely ignore this email — your account will remain secure.</p>
        <p>Thank you,</p>
        <p>The BeautyWorld Team</p>
    </div>
    `
}
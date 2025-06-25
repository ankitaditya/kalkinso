/**
 * Generates a random OTP of specified length.
 * @param {number} length - The length of the OTP to generate. Default is 6.
 * @returns {string} The generated OTP.
 */
function generateOTP(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 9).toString();
    }
    return otp;
}

/**
 * Verifies if the provided OTP matches the expected OTP.
 * @param {string} providedOTP - The OTP provided by the user.
 * @param {string} expectedOTP - The OTP expected/stored on the server.
 * @returns {boolean} True if the OTPs match, false otherwise.
 */
function verifyOTP(providedOTP, expectedOTP) {
    return providedOTP === expectedOTP;
}

module.exports = { generateOTP, verifyOTP };
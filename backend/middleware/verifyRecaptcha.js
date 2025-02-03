import axios from 'axios';

export const verifyRecaptcha = async (req, res, next) => {
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) {
        return res.status(400).json({ error: 'Missing reCAPTCHA token' });
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET,
                response: recaptchaToken
            }
        });

        if (response.data.success) {
            next();
        } else {
            return res.status(400).json({ error: 'Invalid reCAPTCHA token' });
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return res.status(500).json({ error: 'Failed to verify reCAPTCHA' });
    }
};
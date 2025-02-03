import axios from 'axios';
import xml2js from 'xml2js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export const casCallback = async (req, res) => {
    const { ticket } = req.query;
    const serviceUrl = `${process.env.BACKEND}/api/cas/callback`;

    try {
        const response = await axios.get(`https://login.iiit.ac.in/cas/serviceValidate?ticket=${ticket}&service=${serviceUrl}`);
        const result = await xml2js.parseStringPromise(response.data);

        const email = result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
        if (!email) {
            return res.status(400).send('CAS login failed');
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
            await user.save();
            return res.redirect(`${process.env.FRONTEND}/complete-registration`);
        }

        const token = jwt.sign({ email: user.email, _id: user._id }, jwtSecret, {});
        res.cookie('token', token).redirect(`${process.env.FRONTEND}/search-items`);
    } catch (error) {
        console.error('Error verifying CAS login:', error);
        res.status(500).send('CAS login verification failed');
    }
};
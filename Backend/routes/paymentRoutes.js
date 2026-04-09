const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/crear', async (req, res) => {
    const { userId, monto, userToken } = req.body;

    if (!userId || !monto || !userToken) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const respuestaToka = await axios.post(`${process.env.TOKA_URL}/v1/payment/create`, {
            userId: userId,
            orderTitle: "Torneo Olimpia Arena",
            orderAmount: { 
                value: monto.toString(), 
                currency: "MXN" 
            }
        }, {
            headers: {
                'X-App-Id': process.env.X_APP_ID,
                'Alipay-MerchantCode': process.env.MERCHANT_CODE,
                'Authorization': `Bearer ${userToken}`
            }
        });

        res.json(respuestaToka.data);
    } catch (error) {
        console.error("Error en Toka:", error.response?.data || error.message);
        res.status(500).json({ 
            error: "Fallo al conectar con la pasarela",
            details: error.response?.data 
        });
    }
});

module.exports = router;
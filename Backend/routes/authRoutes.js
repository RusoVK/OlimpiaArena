const express = require('express');
const router = express.Router();
const axios = require('axios');

// 1. Intercambiar authCode por JWT token
router.post('/exchange-auth', async (req, res) => {
    const { authCode } = req.body;

    if (!authCode) {
        return res.status(400).json({ error: "authCode es requerido" });
    }

    try {
        console.log('[authRoutes] Intercambiando authCode:', authCode.substring(0, 10) + '...');
        
        const response = await axios.post(
            `${process.env.TOKA_BASE_URL}/v1/user/authenticate`,
            { authCode },
            {
                headers: {
                    'X-App-Id': process.env.VITE_TOKA_APP_ID || process.env.X_APP_ID,
                    'Alipay-MerchantCode': process.env.VITE_TOKA_MERCHANT_CODE || process.env.MERCHANT_CODE
                }
            }
        );

        console.log('[authRoutes] JWT obtenido:', response.data?.token?.substring(0, 20) + '...');
        res.json({ token: response.data?.token || response.data?.jwt });
    } catch (error) {
        console.error('[authRoutes] Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: "No se pudo intercambiar authCode",
            details: error.response?.data 
        });
    }
});

// 2. Obtener datos personales del usuario
router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Token requerido" });
    }

    try {
        console.log('[authRoutes] Obteniendo perfil del usuario...');
        
        const response = await axios.get(
            `${process.env.TOKA_BASE_URL}/v1/user/profile`,
            {
                headers: {
                    'X-App-Id': process.env.VITE_TOKA_APP_ID || process.env.X_APP_ID,
                    'Alipay-MerchantCode': process.env.VITE_TOKA_MERCHANT_CODE || process.env.MERCHANT_CODE,
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('[authRoutes] Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: "No se pudo obtener perfil",
            details: error.response?.data 
        });
    }
});

module.exports = router;

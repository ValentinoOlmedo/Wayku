import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5500', // Tu frontend
  credentials: true
}));
app.use(express.json());

// Configurar Mercado Pago con tu Access Token de prueba
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-3962266255631867-092011-73566a13c713c4d3d9cec01756c66d88-2698724971',
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
});

// Ruta para crear preferencia de pago
app.post('/api/pago/crear-preferencia', async (req, res) => {
  try {
    const { items } = req.body;
    
    // Validar items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items son requeridos' });
    }

    const preference = new Preference(client);

    const preferenceData = {
      items: items.map(item => ({
        id: item.id || '1',
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'ARS'
      })),
      back_urls: {
        success: 'https://httpbin.org/get?status=success',
        failure: 'https://httpbin.org/get?status=failure',
        pending: 'https://httpbin.org/get?status=pending'
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      notification_url: 'http://localhost:3000/webhook', // Para recibir notificaciones
      statement_descriptor: 'WAYKU'
    };

    const result = await preference.create({ body: preferenceData });
    
    console.log('Preferencia creada:', result.id);
    
    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });

  } catch (error) {
    console.error('Error creando preferencia:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// Webhook para recibir notificaciones de Mercado Pago
app.post('/webhook', async (req, res) => {
  try {
    console.log('Webhook recibido:', req.body);
    
    const { type, data } = req.body;
    
    if (type === 'payment') {
      console.log(`Pago actualizado: ${data.id}`);
      // Aquí puedes procesar el pago, actualizar tu base de datos, etc.
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Endpoint de preferencias: http://localhost:${PORT}/api/pago/crear-preferencia`);
});

export default app;

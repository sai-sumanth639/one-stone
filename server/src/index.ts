import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Marble ERP API is running');
});

import authRoutes from './routes/auth.routes';
import purchaseRoutes from './routes/purchase.routes';
import productionRoutes from './routes/production.routes';
import salesRoutes from './routes/sales.routes';
import dashboardRoutes from './routes/dashboard.routes';
import dispatchRoutes from './routes/dispatch.routes';
import accountingRoutes from './routes/accounting.routes';
import expenseRoutes from './routes/expense.routes';
import pnlRoutes from './routes/pnl.routes';
import adminRoutes from './routes/admin.routes';
import { openapiSpec } from './utils/openapi';

app.use('/api/auth', authRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/pnl', pnlRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

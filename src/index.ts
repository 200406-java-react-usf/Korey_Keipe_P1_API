import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { corsFilter } from './middleware/cors-filter.js';
import { UserRouter } from './routes/user-router.js';
import { sessionMiddleware } from './middleware/session-middleware'
import { AuthRouter } from './routes/auth-router.js';
import { ReimbRouter } from './routes/reimb-router.js';

dotenv.config();

export const connectionPool: Pool = new Pool({
	host: process.env['DB_HOST'],
	port: +process.env['DB_PORT'],
	database: process.env['DB_NAME'],
	user: process.env['DB_USERNAME'],
	password: process.env['DB_PASSWORD'],
	max: 5
});

let app = express();
const port = 8080;

app.use(corsFilter);
app.use(sessionMiddleware);
app.use('/', express.json());
app.use('/users', UserRouter);
app.use('/auth', AuthRouter);
app.use('/reimbursements', ReimbRouter);

app.get('/', (req,res) => {
	res.send('Korey Keipe Java-React-USF Project 1');
})

// Start Server
app.listen(port, () => {
	console.log(`Application is now running on port: ${port}`);
});

//KhkProject1Api-env.eba-pamzru3a.us-east-1.elasticbeanstalk.com 
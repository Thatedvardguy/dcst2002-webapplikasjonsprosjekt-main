import express from 'express';
import recipeRouter from './recipe-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', recipeRouter);

export default app;

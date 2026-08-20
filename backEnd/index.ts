import app from './src/server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor local corriendo en el puerto ${PORT}`);
});
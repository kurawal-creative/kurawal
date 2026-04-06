import 'dotenv/config';
import app from './app.js';

const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: http://localhost:${PORT}`);
});

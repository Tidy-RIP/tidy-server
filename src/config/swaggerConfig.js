import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = yamljs.load(path.resolve(__dirname, 'swagger.yaml'));

export { swaggerUi, swaggerDocument };

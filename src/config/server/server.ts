import * as express from 'express';

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import helmet from 'helmet';
import * as morgan from 'morgan';

interface BootstrapServer {
  port: number;
  message: string;
  routes: any;
}

const app = express();
export const router = express.Router();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
export const Server = app;

export function BootstrapServer({ message, port, routes }: BootstrapServer) {
  Server.use(routes);
  return Server.listen(port, () => {
    console.log(message);
  });
}

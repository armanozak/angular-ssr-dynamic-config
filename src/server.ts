import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { request } from 'https';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';

import { AppServerModule } from './main.server';

import { REMOTE_CONFIG } from './app/config';

let config: any;
const distFolder = join(process.cwd(), 'dist/example-app/browser');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: REMOTE_CONFIG, useValue: config },
      ],
    });
  });

  return server;
}

async function run(): Promise<void> {
  config = await fetchJson(process.env['CONFIG_URL']).catch(
    (err: ConfigUrlError | HttpsRequestError) => {
      const message =
        err instanceof HttpsRequestError
          ? `HTTP ${err.code}: ${err.message}`
          : err.message;

      console.error(`Failed to fetch remote config.\n${message}`);

      process.exit(1);

      // error can be handled more gracefully, this is just a PoC
    }
  );

  const port = process.env['PORT'] || 8000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

function fetchJson<T = any>(url?: string): Promise<T> {
  if (!url) {
    return Promise.reject(new ConfigUrlError());
  }

  return new Promise((resolve, reject) => {
    const req = request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    req.on('response', (response) => {
      const { statusCode, statusMessage } = response;
      if (statusCode !== 200) {
        reject(new HttpsRequestError(statusMessage, statusCode));
      }

      const data: any = [];
      response.on('data', (chunk) => {
        data.push(chunk);
      });

      response.on('end', () => {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

class ConfigUrlError extends Error {
  constructor() {
    super('Config URL not provided. Please check your environment variables.');
  }
}

class HttpsRequestError extends Error {
  constructor(message = 'Request failed.', public code?: number) {
    super(message);
  }
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './main.server';

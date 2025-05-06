import { register } from 'node:module';
import { pathToFileURL } from 'url';

register('ts-node/esm', pathToFileURL('./'));

import('./index.ts');
export * from './main'

import pick from 'lodash/pick';
import {JSDOM} from 'jsdom';

const dom = new JSDOM();
const browser_globals = pick(dom.window, ['document', 'Node', 'NodeList', 'HTMLCollection', 'XMLSerializer']);
Object.assign(globalThis, browser_globals);

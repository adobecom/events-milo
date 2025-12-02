import { render } from '../../scripts/deps/preact/index.js';
import AdobeMaxPlus from './AdobeMaxPlus.js';

export default function init(el) {
  render(AdobeMaxPlus(), el);
}

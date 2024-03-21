import { getLibs } from '../../scripts/utils.js';

const { html, render, useRef, useState } = await import(`${getLibs()}/deps/htm-preact.js`);

export default function init(el) {
  // Mock search function
  const mockSearch = () => new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '6c0ce564-3335-5d20-95f6-cb35ccee571b',
        styles: {
          typeOverride: 'event',
          backgroundImage: 'https://summit.adobe.com/_assets/images/home/speakers-promo@2x.jpg',
          mnemonic: '',
        },
        overlays: { videoButton: { url: '' } },
        arbitrary: [
          { key: 'promoId', value: 'splash-that|458926431' },
          { key: 'timezone', value: 'America/Los_Angeles' },
          { key: 'venue', value: 'La Costa Resort and Spa' },
          // Add more fields as necessary
        ],
        contentArea: {
          detailText: 'detail',
          title: 'TestTier3Event1',
          url: 'https://main--events-milo--adobecom.hlx.page/t3/event/03-12-2024/chicago/il/adobe-events-seminar',
          description: 'TestTier3Event1',
        },
        footer: [{
          divider: false,
          left: [],
          center: [],
          right: [{
            type: 'button',
            style: '',
            text: 'Read now',
            href: 'https://main--events-milo--adobecom.hlx.page/t3/event/03-12-2024/chicago/il/adobe-events-seminar',
          }],
        }],
      });
    }, 1000);
  });

  // DynamicForm Component
  const DynamicForm = ({ data }) => {
    const [speakers, setSpeakers] = useState([]);

    const handleSubmit = (event) => {
      event.preventDefault();
      console.log(event);
      // Handle form submission logic here
      console.log('Form submitted with updated data');
      alert('Check the console for submitted data.');
    };

    const addSpeaker = () => {
      setSpeakers([...speakers, { id: Math.random().toString(16).slice(2) }]);
    };

    const removeSpeaker = (id) => {
      setSpeakers((currentSpeakers) => currentSpeakers.filter((speaker) => speaker.id !== id));
    };

    const renderInputField = (name, value, label) => html`
      <div>
        <label for=${name}>${label}</label>
        <input type="text" id=${name} name=${name} value=${value} key=${name} />
      </div>
    `;

    const renderSpeakerInputs = (speaker) => html`
      <fieldset key=${speaker.id}>
        <legend>Speaker Details</legend>
        <div>
          <label for=${`firstName-${speaker.id}`}>First Name</label>
          <input type="text" id=${`firstName-${speaker.id}`} name=${`firstName-${speaker.id}`} placeholder="First Name" />
        </div>
        <div>
          <label for=${`lastName-${speaker.id}`}>Last Name</label>
          <input type="text" id=${`lastName-${speaker.id}`} name=${`lastName-${speaker.id}`} placeholder="Last Name" />
        </div>
        <div>
          <label for=${`title-${speaker.id}`}>Title</label>
          <input type="text" id=${`title-${speaker.id}`} name=${`title-${speaker.id}`} placeholder="Title" />
        </div>
        <div>
          <label for=${`img-${speaker.id}`}>Image</label>
          <input type="file" id=${`img-${speaker.id}`} name=${`img-${speaker.id}`} accept="image/*" />
        </div>
        <div>
          <label for=${`bio-${speaker.id}`}>Bio</label>
          <textarea id=${`bio-${speaker.id}`} name=${`bio-${speaker.id}`} placeholder="Short Bio"></textarea>
        </div>
        <button type="button" onClick=${() => removeSpeaker(speaker.id)} class="remove-speaker-btn">Remove Speaker</button>
      </fieldset>
    `;

    return html`
      <form onSubmit=${handleSubmit}>
        ${Object.entries(data).map(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return Object.entries(value).map(([subKey, subValue]) => renderInputField(`${key}.${subKey}`, subValue, `${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`));
    } if (typeof value === 'string') {
      return renderInputField(key, value, `${key.charAt(0).toUpperCase() + key.slice(1)}`);
    }

    return null;
  })}
        <div>
          ${speakers.map(renderSpeakerInputs)}
          <button type="button" onClick=${addSpeaker}>Add Speaker</button>
        </div>
        <button type="submit">Update</button>
      </form>
    `;
  };

  // App Component
  const App = () => {
    const [data, setData] = useState(null);
    const inputRef = useRef(null);

    const handleSubmit = async (event) => {
      event.preventDefault();
      const url = inputRef.current.value;
      const result = await mockSearch(url);
      setData(result);
    };

    return html`
      <div>
        ${!data ? html`
          <form onSubmit=${handleSubmit}>
            <input type="text" name="url" placeholder="Enter URL or Pathname" ref=${inputRef} required />
            <button type="submit">Submit</button>
          </form>
        ` : html`
          <${DynamicForm} data=${data} />
        `}
      </div>
    `;
  };

  // Render the App
  render(html`<${App} />`, el);
}

import { getLibs } from '../../scripts/utils.js';

const { createTag } = await import(`${getLibs()}/utils/utils.js`);

function getMetadata(name, doc = document) {
    const attr = name && name.includes(':') ? 'property' : 'name';
    const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
    return meta && meta.content;
  }

export default function init (el) {
    console.log('init executed');

    const partnersData = JSON.parse(getMetadata('partners')); 
    console.log('partners', partnersData);

    const eventPartnersSection = createTag('section', { class: 'event-partners images'})
    console.log('el', el);
    console.log('eventPartnersSection', eventPartnersSection);

    partnersData.forEach((partner) => {
        const aTag = createTag('a', {href: `${partner.externalLink}`});

        const article = createTag('article', { class: 'event-partners logo'});
        aTag.append(article);
        const img = createTag('img', {src: `${partner.imageUrl}`});
        article.append(img);
        console.log('partner.imageUrl', partner.imageUrl)
        eventPartnersSection.append(aTag);
    });


    el.append(eventPartnersSection);

}

export { init };
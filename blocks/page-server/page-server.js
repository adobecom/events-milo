import { getMetadata } from '../../utils/utils.js';
import fetchPageData, { flattenObject } from '../../utils/event-apis.js';
// import fetchPageData, { flattenObject, getAttendeeData } from '../../utils/event-apis.js';
import { getLibs } from '../../scripts/utils.js';

// data -> dom gills
export async function autoUpdateContent(parent, data, isStructured = false) {
  if (!parent) {
    window.lana?.log('page server block cannot find its parent element');
    return null;
  }

  if (!data) {
    document.body.style.display = 'none';
    window.location.replace('/404');
  }

  const res = isStructured ? flattenObject(data) : data;
  console.log('replacing content with:', res);
  const findRegexMatch = (_match, p1) => res[p1] || '';
  const allElements = parent.querySelectorAll('*');
  const reg = /\[\[(.*?)\]\]/g;

  allElements.forEach((element) => {
    if (element.childNodes.length) {
      element.childNodes.forEach((child) => {
        if (child.tagName === 'IMG' && child.nodeType === 1) {
          const parentPic = child.closest('picture');
          const originalAlt = child.alt;
          const replacedSrc = originalAlt.replace(reg, findRegexMatch);

          if (replacedSrc && parentPic && replacedSrc !== originalAlt) {
            parentPic.querySelectorAll('source').forEach((el) => {
              try {
                el.srcset = el.srcset.replace(/.*\?/, `${replacedSrc}?`);
              } catch (e) {
                window.lana?.log(`failed to convert optimized picture source from ${el} with dynamic data: ${e}`);
              }
            });

            parentPic.querySelectorAll('img').forEach((el) => {
              try {
                el.src = el.src.replace(/.*\?/, `${replacedSrc}?`);
              } catch (e) {
                window.lana?.log(`failed to convert optimized img from ${el} with dynamic data: ${e}`);
              }
            });
          } else if (originalAlt.match(reg)) {
            element.remove();
          }
        }

        if (child.nodeType === 3) {
          const originalText = child.nodeValue;
          const replacedText = originalText.replace(reg, findRegexMatch);
          if (replacedText !== originalText) child.nodeValue = replacedText;
        }
      });
    }
  });

  // handle link replacement
  parent.querySelectorAll('a[href*="#"]').forEach((a) => {
    try {
      let url = new URL(a.href);
      if (getMetadata(url.hash.replace('#', ''))) {
        a.href = getMetadata(url.hash.replace('#', ''));
        url = new URL(a.href);
      }
    } catch (e) {
      window.lana?.log(`Error while attempting to replace link ${a.href}: ${e}`);
    }
  });

  return res;
}

// async function handleRegisterCta(pd) {
//   const rsvpLink = document.querySelector('a[href$="#rsvp-form"]');
//   if (!rsvpLink) return;

//   const renderCtaState = (attendeeData, fbText) => {
//     if (attendeeData?.registered) {
//       rsvpLink.textContent = 'You are all set!';
//     } else {
//       rsvpLink.textContent = fbText;
//       rsvpLink.classList.remove('no-event');
//     }
//   };

//   rsvpLink.classList.add('no-event');
//   const currentCtaText = rsvpLink.textContent;
//   rsvpLink.textContent = 'Checking your RSVP status...';
//   const imsProfile = window.bm8tr.get('imsProfile');
//   if (imsProfile && !imsProfile.noProfile) {
//     const attendeeData = await getAttendeeData(imsProfile.email, pd.arbitrary.promoId);
//     renderCtaState(attendeeData, currentCtaText);
//   } else if (imsProfile?.noProfile) {
//     rsvpLink.textContent = currentCtaText;
//     rsvpLink.classList.remove('no-event');
//   } else {
//     window.bm8tr.subscribe('imsProfile', async ({ newValue }) => {
//       if (newValue.noProfile) {
//         rsvpLink.textContent = currentCtaText;
//         rsvpLink.classList.remove('no-event');
//       } else {
//         const attendeeData = await getAttendeeData(newValue.email, pd['arbitrary.promoId']);
//         renderCtaState(attendeeData, currentCtaText);
//       }
//     });
//   }
// }

export default async function init(el) {
  const { default: getUuid } = await import(`${getLibs()}/utils/getUuid.js`);
  const hash = await getUuid(window.location.pathname);
  await autoUpdateContent(el.closest('main'), await fetchPageData(hash), true);
  // const flatPD = await autoUpdateContent(el.closest('main'), await fetchPageData(hash), true);
  // handleRegisterCta(flatPD);
}

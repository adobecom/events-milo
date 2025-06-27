import { getIcon, getMetadata, miloReplaceKey } from './utils.js';

export function updateAnalyticTag(el, newVal) {
  const eventTitle = getMetadata('event-title');
  const newDaaLL = `${newVal}${eventTitle ? `|${eventTitle}` : ''}`;
  el.setAttribute('daa-ll', newDaaLL);
}

export async function setCtaState(targetState, rsvpBtn, miloLibs) {
  const checkRed = getIcon('check-circle-red');

  const enableBtn = () => {
    rsvpBtn.el.classList.remove('disabled');
    rsvpBtn.el.href = rsvpBtn.el.dataset.modalHash;
    rsvpBtn.el.setAttribute('tabindex', 0);
  };

  const disableBtn = () => {
    rsvpBtn.el.setAttribute('tabindex', -1);
    rsvpBtn.el.href = '';
    rsvpBtn.el.classList.add('disabled');
  };

  const stateTrigger = {
    registered: async () => {
      const registeredText = await miloReplaceKey(miloLibs, 'registered-cta-text');
      enableBtn();
      updateAnalyticTag(rsvpBtn.el, registeredText);
      rsvpBtn.el.textContent = registeredText;
      rsvpBtn.el.prepend(checkRed);
    },
    waitlisted: async () => {
      const waitlistedText = await miloReplaceKey(miloLibs, 'waitlisted-cta-text');
      enableBtn();
      updateAnalyticTag(rsvpBtn.el, waitlistedText);
      rsvpBtn.el.textContent = waitlistedText;
      rsvpBtn.el.prepend(checkRed);
    },
    toWaitlist: async () => {
      const waitlistText = await miloReplaceKey(miloLibs, 'waitlist-cta-text');
      enableBtn();
      updateAnalyticTag(rsvpBtn.el, waitlistText);
      rsvpBtn.el.textContent = waitlistText;
      checkRed.remove();
    },
    eventClosed: async () => {
      const closedText = await miloReplaceKey(miloLibs, 'event-full-cta-text');
      disableBtn();
      updateAnalyticTag(rsvpBtn.el, closedText);
      rsvpBtn.el.textContent = closedText;
      checkRed.remove();
    },
    default: async () => {
      enableBtn();
      updateAnalyticTag(rsvpBtn.el, rsvpBtn.originalText);
      rsvpBtn.el.textContent = rsvpBtn.originalText;
      checkRed.remove();
    },
  };

  await stateTrigger[targetState]();
}

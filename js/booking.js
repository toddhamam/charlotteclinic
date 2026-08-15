/* ============================================
   The Qi Collective - Practitioner Booking Flow
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  const bookingPortal = document.querySelector('.booking-portal');
  if (!bookingPortal) return;

  const progressSteps = Array.from(document.querySelectorAll('.booking-step'));
  const stepPanels = Array.from(document.querySelectorAll('.booking-panel'));
  const practitionerChoices = Array.from(document.querySelectorAll('[data-practitioner-choice]'));
  const practitionerServicePanels = Array.from(document.querySelectorAll('[data-practitioner-services]'));
  const backButtons = Array.from(document.querySelectorAll('[data-booking-back]'));

  function updateUrl(practitioner) {
    const url = new URL(window.location.href);

    if (practitioner) {
      url.searchParams.set('practitioner', practitioner);
    } else {
      url.searchParams.delete('practitioner');
    }

    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function showStep(stepNumber, practitioner, options = {}) {
    const { focus = true, scroll = true, updateAddress = true } = options;

    progressSteps.forEach(step => {
      const number = Number(step.dataset.step);
      step.classList.toggle('active', number === stepNumber);
      step.classList.toggle('completed', number < stepNumber);

      if (number === stepNumber) {
        step.setAttribute('aria-current', 'step');
      } else {
        step.removeAttribute('aria-current');
      }
    });

    stepPanels.forEach(panel => {
      panel.hidden = panel.id !== `step-${stepNumber}`;
    });

    practitionerServicePanels.forEach(panel => {
      panel.hidden = stepNumber !== 2 || panel.dataset.practitionerServices !== practitioner;
    });

    if (updateAddress) {
      updateUrl(stepNumber === 2 ? practitioner : null);
    }

    if (scroll) {
      bookingPortal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (focus) {
      const heading = stepNumber === 2
        ? document.querySelector(`[data-practitioner-services="${practitioner}"] h2`)
        : document.getElementById('practitioner-selection-title');

      if (heading) {
        window.setTimeout(() => heading.focus({ preventScroll: true }), 350);
      }
    }
  }

  practitionerChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      showStep(2, choice.dataset.practitionerChoice);
    });
  });

  backButtons.forEach(button => {
    button.addEventListener('click', () => showStep(1));
  });

  const requestedPractitioner = new URLSearchParams(window.location.search).get('practitioner');
  const requestedChoice = practitionerChoices.find(choice => (
    choice.dataset.practitionerChoice === requestedPractitioner && !choice.disabled
  ));

  if (requestedChoice) {
    showStep(2, requestedPractitioner, { focus: false, scroll: false, updateAddress: false });
  } else {
    showStep(1, null, { focus: false, scroll: false, updateAddress: Boolean(requestedPractitioner) });
  }
});

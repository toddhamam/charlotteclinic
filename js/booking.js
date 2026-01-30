/* ============================================
   Charlotte Clinic - Booking Portal JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Only run on booking page
  if (!document.querySelector('.booking-portal')) return;

  // ============================================
  // State Management
  // ============================================
  const bookingState = {
    currentStep: 1,
    service: null,
    selectedDate: null,
    selectedTime: null,
    serviceDetails: {
      'initial-consultation': { name: 'Initial Consultation', duration: '90 minutes', price: '$150' },
      'acupuncture': { name: 'Acupuncture Session', duration: '60 minutes', price: '$95' },
      'cupping': { name: 'Cupping Therapy', duration: '45 minutes', price: '$75' },
      'cosmetic': { name: 'Cosmetic Acupuncture', duration: '75 minutes', price: '$120' },
      'reiki': { name: 'Reiki / Universal Healing', duration: '60 minutes', price: '$85' },
      'herbal': { name: 'Herbal Consultation', duration: '45 minutes', price: '$70' }
    }
  };

  // ============================================
  // DOM Elements
  // ============================================
  const steps = document.querySelectorAll('.booking-step');
  const panels = document.querySelectorAll('.booking-panel');
  const serviceRadios = document.querySelectorAll('input[name="service"]');
  const toStep2Btn = document.getElementById('to-step-2');
  const toStep3Btn = document.getElementById('to-step-3');
  const toStep4Btn = document.getElementById('to-step-4');
  const backToStep1Btn = document.getElementById('back-to-step-1');
  const backToStep2Btn = document.getElementById('back-to-step-2');
  const backToStep3Btn = document.getElementById('back-to-step-3');
  const confirmBookingBtn = document.getElementById('confirm-booking');
  const calendarDays = document.getElementById('calendar-days');
  const calendarMonth = document.getElementById('calendar-month');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const timeSlotsGrid = document.getElementById('time-slots-grid');
  const selectedDateDisplay = document.getElementById('selected-date-display');

  // Calendar state
  let currentDate = new Date();
  let displayMonth = new Date();

  // ============================================
  // Step Navigation
  // ============================================
  function showStep(stepNumber) {
    bookingState.currentStep = stepNumber;

    // Update step indicators
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');
      if (stepNum === stepNumber) {
        step.classList.add('active');
      } else if (stepNum < stepNumber) {
        step.classList.add('completed');
      }
    });

    // Show/hide panels
    panels.forEach(panel => {
      panel.classList.add('hidden');
    });
    const activePanel = document.getElementById(`step-${stepNumber}`);
    if (activePanel) {
      activePanel.classList.remove('hidden');
    }

    // Scroll to top of booking section
    document.querySelector('.booking-portal').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ============================================
  // Service Selection
  // ============================================
  serviceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      bookingState.service = this.value;
      toStep2Btn.disabled = false;
    });
  });

  // ============================================
  // Calendar Functionality
  // ============================================
  function renderCalendar() {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();

    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonth.textContent = `${monthNames[month]} ${year}`;

    // Clear existing days
    calendarDays.innerHTML = '';

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Get starting day (Monday = 0, Sunday = 6)
    let startingDay = firstDay.getDay() - 1;
    if (startingDay < 0) startingDay = 6;

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
      const emptyDay = document.createElement('button');
      emptyDay.className = 'calendar__day calendar__day--empty';
      emptyDay.disabled = true;
      calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= totalDays; day++) {
      const dayBtn = document.createElement('button');
      dayBtn.className = 'calendar__day';
      dayBtn.textContent = day;

      const thisDate = new Date(year, month, day);

      // Disable past dates and weekends
      const dayOfWeek = thisDate.getDay();
      const isPast = thisDate < today;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isPast || isWeekend) {
        dayBtn.disabled = true;
      } else {
        dayBtn.addEventListener('click', () => selectDate(thisDate, dayBtn));
      }

      // Mark today
      if (thisDate.getTime() === today.getTime()) {
        dayBtn.classList.add('calendar__day--today');
      }

      // Mark selected date
      if (bookingState.selectedDate &&
          thisDate.getTime() === bookingState.selectedDate.getTime()) {
        dayBtn.classList.add('calendar__day--selected');
      }

      calendarDays.appendChild(dayBtn);
    }
  }

  function selectDate(date, dayBtn) {
    bookingState.selectedDate = date;

    // Update visual selection
    document.querySelectorAll('.calendar__day--selected').forEach(d => {
      d.classList.remove('calendar__day--selected');
    });
    dayBtn.classList.add('calendar__day--selected');

    // Update date display
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    selectedDateDisplay.textContent = date.toLocaleDateString('en-AU', options);

    // Generate time slots
    generateTimeSlots();
  }

  function generateTimeSlots() {
    timeSlotsGrid.innerHTML = '';
    bookingState.selectedTime = null;
    toStep3Btn.disabled = true;

    // Sample time slots (in production, these would come from a backend)
    const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                   '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
                   '4:00 PM', '4:30 PM'];

    // Randomly mark some slots as unavailable (simulating booked appointments)
    const unavailableSlots = new Set();
    const numUnavailable = Math.floor(Math.random() * 4) + 2;
    while (unavailableSlots.size < numUnavailable) {
      unavailableSlots.add(Math.floor(Math.random() * times.length));
    }

    times.forEach((time, index) => {
      const slotBtn = document.createElement('button');
      slotBtn.className = 'time-slot';
      slotBtn.textContent = time;

      if (unavailableSlots.has(index)) {
        slotBtn.disabled = true;
        slotBtn.title = 'Not available';
      } else {
        slotBtn.addEventListener('click', () => selectTime(time, slotBtn));
      }

      timeSlotsGrid.appendChild(slotBtn);
    });
  }

  function selectTime(time, slotBtn) {
    bookingState.selectedTime = time;

    // Update visual selection
    document.querySelectorAll('.time-slot.selected').forEach(s => {
      s.classList.remove('selected');
    });
    slotBtn.classList.add('selected');

    // Enable continue button
    toStep3Btn.disabled = false;
  }

  // Month navigation
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      displayMonth.setMonth(displayMonth.getMonth() - 1);
      // Don't allow navigating to past months
      const today = new Date();
      if (displayMonth < new Date(today.getFullYear(), today.getMonth(), 1)) {
        displayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      }
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      displayMonth.setMonth(displayMonth.getMonth() + 1);
      renderCalendar();
    });
  }

  // ============================================
  // Form Validation (Step 3)
  // ============================================
  const bookingForm = document.getElementById('booking-form');

  function validateForm() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();

    return firstName && lastName && email && phone;
  }

  // ============================================
  // Update Summary (Step 4)
  // ============================================
  function updateSummary() {
    const service = bookingState.serviceDetails[bookingState.service];

    document.getElementById('summary-service').textContent = service.name;

    if (bookingState.selectedDate) {
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      document.getElementById('summary-date').textContent =
        bookingState.selectedDate.toLocaleDateString('en-AU', options);
    }

    document.getElementById('summary-time').textContent = bookingState.selectedTime || '';
    document.getElementById('summary-duration').textContent = service.duration;
    document.getElementById('summary-price').textContent = service.price;
  }

  // ============================================
  // Button Event Listeners
  // ============================================
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', () => {
      if (bookingState.service) {
        showStep(2);
        renderCalendar();
      }
    });
  }

  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', () => {
      if (bookingState.selectedDate && bookingState.selectedTime) {
        showStep(3);
      }
    });
  }

  if (toStep4Btn) {
    toStep4Btn.addEventListener('click', () => {
      if (validateForm()) {
        updateSummary();
        showStep(4);
      } else {
        alert('Please fill in all required fields.');
      }
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => showStep(1));
  }

  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => showStep(2));
  }

  if (backToStep3Btn) {
    backToStep3Btn.addEventListener('click', () => showStep(3));
  }

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      // In production, this would submit to a backend
      // For now, show success screen
      panels.forEach(panel => panel.classList.add('hidden'));
      document.getElementById('booking-success').classList.remove('hidden');

      // Mark all steps as completed
      steps.forEach(step => {
        step.classList.remove('active');
        step.classList.add('completed');
      });

      // Scroll to success message
      document.querySelector('.booking-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Initialize calendar with current month
  renderCalendar();
});

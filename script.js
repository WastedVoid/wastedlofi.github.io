const openPopupBtn = document.getElementById('openPopup');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupBtn = document.getElementById('closePopup');

// Open the popup when the button is clicked
openPopupBtn.addEventListener('click', () => {
  popupOverlay.style.display = 'flex';
});

// Close the popup when the close icon is clicked
closePopupBtn.addEventListener('click', () => {
  popupOverlay.style.display = 'none';
});

// Optionally, close the popup when clicking outside the popup box
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) {
    popupOverlay.style.display = 'none';
  }
});

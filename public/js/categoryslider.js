const slider = document.querySelector(".slider");
let scrollAmount = 0;

function slide(direction) {
  const cardWidth = document.querySelector(".card").offsetWidth;
  const visibleCards = Math.floor(
    document.querySelector(".slider-container").offsetWidth / cardWidth
  );

  if (direction === "left") {
    scrollAmount += cardWidth * visibleCards;
  } else {
    scrollAmount -= cardWidth * visibleCards;
  }

  scrollAmount = Math.min(scrollAmount, 0);
  scrollAmount = Math.max(
    scrollAmount,
    -(slider.scrollWidth - slider.offsetWidth)
  );

  slider.style.transform = `translateX(${scrollAmount}px)`;
}

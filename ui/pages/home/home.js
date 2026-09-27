const sentinel = document.querySelector("#top-sentinel");
const banner = document.querySelector(".banner");

const observer = new IntersectionObserver(
  ([entry]) => {
    // Check if the sentinel has scrolled past the top of the browser window
    const isPastTop = entry.boundingClientRect.top < 0;

    // Instantly toggle the active class (true = add, false = remove)
    banner.classList.toggle("is-active", isPastTop);
  },
  {
    threshold: 0, // Triggers the exact pixel it crosses the line
  },
);

observer.observe(sentinel);

const sentinel = document.querySelector("#top-sentinel");
const banner = document.querySelector(".banner");
const navHome = document.getElementById("nav-home");
const navSchedule = document.getElementById("nav-schedule");

const observer = new IntersectionObserver(
  ([entry]) => {
    // Check if the sentinel has scrolled past the top of the browser window
    const isPastTop = entry.boundingClientRect.top < 0;

    // Instantly toggle the active class (true = add, false = remove)
    banner.classList.toggle("is-active", isPastTop);

    if (isPastTop) {
      navHome.classList.remove("nav-active");
      navSchedule.classList.add("nav-active");
    } else {
      navHome.classList.add("nav-active");
      navSchedule.classList.remove("nav-active");
    }
  },
  {
    threshold: 0, // Triggers the exact pixel it crosses the line
  },
);

observer.observe(sentinel);

document.addEventListener("DOMContentLoaded", (event) => {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      if (mobileMenuToggle.innerHTML.includes("span")) {
        mobileMenu.classList.toggle("active");
      } else {
        closePopup()
        mobileMenuToggle.innerHTML = `<span></span><span></span><span></span>`
      }
    });

    document.addEventListener("click", function (e) {
      if (
        !mobileMenuToggle.contains(e.target) &&
        !mobileMenu.contains(e.target)
      ) {
        mobileMenu.classList.remove("active");
      }
    });
  }
  fetch("http://192.168.1.116:1972/status")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // parse JSON
    })
    .then((data) => {
      if (data.status === 200) {
        console.log("Server Okay");
        fetch("http://192.168.1.116:1972/reviews")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json(); // parse JSON
          })
          .then((data) => {
            if (data.data) {
              const average = data.data.average;
              document.getElementById(
                "rating_average"
              ).innerHTML = `${average}/5.0`;
              const dictionary_ratings = data.data.reviews;
              const rating = document.getElementById("latestRating");
              rating.classList.add("fade-in-slide-up");

              let shownReviews = localStorage.getItem("shownRatings");
              shownReviews = shownReviews ? JSON.parse(shownReviews) : [];

              if (shownReviews.length === dictionary_ratings.length) {
                shownReviews = [];
              }

              let selectedReview;
              let selectedKey;
              do {
                selectedReview =
                  dictionary_ratings[
                  Math.floor(Math.random() * dictionary_ratings.length)
                  ];
                selectedKey =
                  selectedReview.name + "|" + selectedReview.review_gr; // unique key
              } while (shownReviews.includes(selectedKey));

              shownReviews.push(selectedKey);
              localStorage.setItem(
                "shownRatings",
                JSON.stringify(shownReviews)
              );

              //Show user's profile picture instead.
              //document.getElementById("rating_icon").innerHTML = `<img src="${selectedReview.profile_picture}">`
              rating.querySelector(".nameAndRating .name").innerText =
                selectedReview.name;
              rating.querySelector(".nameAndRating .rate").innerText =
                selectedReview.review_gr;
              rating.querySelector(".nameAndRating .rate").innerText =
                selectedReview.review_gr;
              rating.style.display = "flex";
            }
          })
          .catch((error) => {
            if (!sessionStorage.getItem("continueAnyway"))
              document.getElementById("evxWarning").style.display = "flex";
          });
      } else {
        if (!sessionStorage.getItem("continueAnyway"))
          document.getElementById("evxWarning").style.display = "flex";
      }
    })
    .catch((error) => {
      if (!sessionStorage.getItem("continueAnyway"))
        document.getElementById("evxWarning").style.display = "flex";
    });
});

function goTo(event, container) {
  const mobileMenu = document.querySelector(".mobile-menu");
  const clicked = event.target;
  if (clicked.className === "item" || clicked.className === "mobile-item") {
    const button = clicked.textContent.trim();
    if (button === "Αρχική") {
      document
        .querySelector(".section.first")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (button === "Βιογραφικό") {
      learnMore();
    } else if (button === "Υπηρεσίες") {
      document
        .querySelector(".section.services")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (button === "Επικοινωνία") {
    }
  } else if (clicked.className === "buttonExt book_appointment") {
    console.log("Book");
  }
  console.log("Κείμενο:", clicked.textContent.trim());
  console.log("Class:", clicked.className);
  if (clicked.className === "mobile-item") {
    mobileMenu.classList.remove("active");
  }
}

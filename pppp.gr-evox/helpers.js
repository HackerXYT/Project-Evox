function continueAnyway() {
  document.getElementById("evxWarning").style.display = "none";
  sessionStorage.setItem("continueAnyway", "true");
}

function learnMore() {
  const element = document.getElementById("scrollIndicator");
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function isMobileWidth() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function readMore(article) {
  const blog_title = document.getElementById("blog-title");
  const blog_content = document.getElementById("blog-content");
  const articles = {
    1: {
      page: "content-blog-1.html",
      title: "Ηλεκτρονευρογράφημα - Ηλεκτρομυογράφημα",
    },
    2: {
      page: "content-blog-2.html",
      title: "Υπερηχογραφία Νεύρων",
    },
    3: {
      page: "content-blog-3.html",
      title: "Εφαργμογές της αλλαντικής τοξίνης (Botox-Dysport) στη Νευρολογία",
    },
    4: {
      page: "content-blog-4.html",
      title: "Βελονισμός - Ηλεκτροβελονισμός - Ωτοβελονισμός",
    },
  };
  const popup_container = document.getElementById("popup_container");
  if (articles[article]) {
    const picked = articles[article];
    blog_title.innerHTML = picked.title;
    fetch(picked.page)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((innerHtml) => {
        blog_content.innerHTML = innerHtml;
        popup_container.querySelectorAll(".popup").forEach((element) => {
          element.style.transform = "translateY(100vh)";
        });
        popup_container.style.display = "flex";
        setTimeout(function () {
          popup_container.style.backdropFilter = "brightness(60%)";
          popup_container.querySelectorAll(".popup").forEach((element) => {
            element.style.transform = "translateY(0vh)";
          });
          if (isMobileWidth()) {
            const ham = document.getElementById("hamburger");
            ham.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                        <g>
                            <path d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#1d3a87" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                    </svg>`;
          }
        }, 100);
      })
      .catch((error) => {
        alert(`Error!: ${error}`);
      });
  }
}

function closePopup() {
  const popup_container = document.getElementById("popup_container");
  popup_container.querySelectorAll(".popup").forEach((element) => {
    element.style.transform = "translateY(100vh)";
  });
  popup_container.style.backdropFilter = "";
  setTimeout(function () {
    popup_container.style.display = "none";
  }, 300);
}

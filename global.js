console.log("IT’S ALIVE!");


function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

fetch("./global.json")
  .then(response => response.json())
  .then(pages => {
    const nav = document.createElement("nav");
    document.body.prepend(nav);

    pages.forEach(item => {
      let { url, title } = item;

      if (!ARE_WE_HOME && !url.startsWith("http")) {
        url = "../" + url;
      }

      nav.insertAdjacentHTML("beforeend", `<a href="${url}">${title}</a>`);
    });

    const navLinks = $$("nav a");
    const currentLink = navLinks.find(a =>
      a.host === location.host && a.pathname === location.pathname
    );
    if (currentLink) {
      currentLink.classList.add("current");
    }
  })
  .catch(err => {
    console.error("Error fetching global.json:", err);
  });

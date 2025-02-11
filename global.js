console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");

const pages = [
  { url: "",          title: "Home" },
  { url: "cv/",       title: "CV" },
  { url: "projects/", title: "Projects" },
  { url: "contact/",  title: "Contact" },
  { url: "https://github.com/aaaarf404", title: "GitHub" }
];

const nav = document.createElement("nav");
document.body.prepend(nav);

pages.forEach(item => {
  let { url, title } = item;
  if (!ARE_WE_HOME && !url.startsWith("http")) {
    url = "../" + url; 
  }

  const a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  nav.append(a);

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }
});

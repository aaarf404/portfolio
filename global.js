console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains("home");
document.body.insertAdjacentHTML( /* ADDED */
  'afterbegin',
  `
  <label class="color-scheme"> <!-- ADDED -->
    Theme:
    <select> <!-- ADDED -->
      <option value="light dark">Automatic</option> <!-- ADDED -->
      <option value="light">Light</option> <!-- ADDED -->
      <option value="dark">Dark</option> <!-- ADDED -->
    </select>
  </label>
`
); /* ADDED */

// ADDED: Listen for changes to the <select> and set color-scheme
const select = document.querySelector('.color-scheme select'); /* ADDED */
select.addEventListener('input', function (event) { /* ADDED */
  document.documentElement.style.setProperty('color-scheme', event.target.value); /* ADDED */
});


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

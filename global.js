document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url:'https://github.com/aaarf404', title: 'GitHub'},
];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/" 
  : "/portfolio/"; 

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in new tab
  a.toggleAttribute(
    'target',
    a.host !== location.host
  );

  nav.append(a);
}

//dark mode
let select = document.querySelector('.color-scheme select');
function setColorScheme(scheme) {
  if (scheme === 'light dark') {
    document.documentElement.style.removeProperty('color-scheme');
  } else {
    document.documentElement.style.setProperty('color-scheme', scheme);
  }

  localStorage.colorScheme = scheme;
  select.value = scheme;
}

if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
} else {
  setColorScheme('light dark'); 
}

select.addEventListener('input', (event) => {
  console.log('color scheme changed to', event.target.value);
  setColorScheme(event.target.value);
});


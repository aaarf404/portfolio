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
  : "/portfolio/"; // ✅ important!

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url.startsWith('http') ? p.url : BASE_PATH + p.url;
  let title = p.title;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // Highlight current page
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

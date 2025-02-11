console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// global.js
console.log("IT’S ALIVE!");

const navLinks = $$("nav a");

let currentLink = navLinks.find(a =>
  a.host === location.host && a.pathname === location.pathname
);

if (currentLink) {
  currentLink.classList.add("current");
}



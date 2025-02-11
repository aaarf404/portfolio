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

      // CHANGED: Create a real <a> element and set properties
      let a = document.createElement("a"); 
      a.href = url;                       
      a.textContent = title;               
      nav.append(a);                      

      // ADDED: Highlight the current link
      if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current"); 
      }

      // ADDED: Open external links in a new tab
      if (a.host !== location.host) {
        a.target = "_blank";   
      }
    });
  })
  .catch(err => {
    console.error("Error fetching global.json:", err);
  });

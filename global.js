console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
export async function fetchGitHubData(username) {
  // Just reuse fetchJSON with the GitHub API endpoint
  return fetchJSON(`https://api.github.com/users/${username}`);
}
const ARE_WE_HOME = document.documentElement.classList.contains("home");

// COLOR SCHEME SWITCHER
document.body.insertAdjacentHTML(/* EXISTING */
  "afterbegin",
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

const select = document.querySelector(".color-scheme select");
select.addEventListener("input", function (event) {
  document.documentElement.style.setProperty("color-scheme", event.target.value);
});

// DYNAMIC NAV
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

/* -----------------------------------------------------
   ADDED/CHANGED: Fetch + Render Functions for Projects
   ----------------------------------------------------- */
/**
 * Fetches JSON from a given URL and returns the parsed data.
 * - If response not ok, throws an error.
 */
export async function fetchJSON(url) { // ADDED
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching or parsing JSON data:", err);
  }
}

/**
 * Renders an array of project objects into a given container.
 * headingLevel is optional and defaults to "h2".
 */
export function renderProjects(projects, containerElement, headingLevel = "h2") { // ADDED
  if (!Array.isArray(projects) || !containerElement) return; // Basic safety checks
  containerElement.innerHTML = ""; // Clear existing content

  for (const project of projects) {
    const article = document.createElement("article");
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }
}

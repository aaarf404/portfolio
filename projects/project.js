import { fetchJSON, renderProjects } from "../global.js";

(async function() {
  const data = await fetchJSON("../projects.json");  // Up one level
  const container = document.querySelector(".projects");
  renderProjects(data, container, "h2");
})();

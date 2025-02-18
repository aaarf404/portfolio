// File: index.js

// CHANGED: Import from global.js (adjust path if needed)
import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js"; // ADDED

(async function () {
  // Step 2: Display the first 3 projects on the home page
  // ADDED: Fetch your projects from JSON
  const allProjects = await fetchJSON("./projects.json"); // ADJUST path if needed
  const latestProjects = allProjects.slice(0, 3);         // ADDED
  const projectsContainer = document.querySelector(".projects"); // ADDED

  // ADDED: Render the first 3 projects
  renderProjects(latestProjects, projectsContainer, "h2");  

  // Step 3: Fetch data from GitHub
  // ADDED: Call the fetchGitHubData function, passing your GH username
  const githubData = await fetchGitHubData("aaaarf404"); // REPLACE with your actual username
  const profileStats = document.querySelector("#profile-stats"); // ADDED

  // ADDED: If container exists, inject some stats
  if (profileStats && githubData) {
    profileStats.innerHTML = `
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  }
})();

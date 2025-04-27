import { fetchJSON, renderProjects } from '../global.js';

const projectsContainer = document.querySelector('.projects');

async function init() {
  const projects = await fetchJSON('portfolio/lib/projects.json');
  renderProjects(projects, projectsContainer, 'h2');
  const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `${projects.length} Projects`;
}

init();
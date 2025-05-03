import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let query = '';
let projects = [];

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

function renderPieChart(projectsGiven) {
  d3.select('#projects-pie-plot').selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);

  arcData.forEach((arc, idx) => {
    d3.select('#projects-pie-plot')
      .append('path')
      .attr('d', arcGenerator(arc))
      .attr('fill', colors(idx));
  });

  data.forEach((d, idx) => {
    d3.select('.legend')
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  const filteredProjects = projects.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

async function init() {
  projects = await fetchJSON('/portfolio/lib/projects.json');

  renderProjects(projects, projectsContainer, 'h2');
  document.querySelector('.projects-title').textContent = `${projects.length} Projects`;

  renderPieChart(projects);
}

init();

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let query = '';
let projects = [];
const searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  const filteredProjects = projects.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderProjects(filteredProjects, projectsContainer, 'h2');
});

const projectsContainer = document.querySelector('.projects');

async function init() {
  const projects = await fetchJSON('/portfolio/lib/projects.json');
  renderProjects(projects, projectsContainer, 'h2');

  const titleElement = document.querySelector('.projects-title');
  titleElement.textContent = `${projects.length} Projects`;

  let rolledData = d3.rollups(
    projects,
    v => v.length,
    d => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value(d => d.value);
  let arcData = sliceGenerator(data);

  arcData.forEach((arc, idx) => {
    d3.select('#projects-pie-plot')
      .append('path')
      .attr('d', arcGenerator(arc))
      .attr('fill', colors(idx));
  });

  const legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

init();

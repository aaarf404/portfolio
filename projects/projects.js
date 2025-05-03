import { fetchJSON, renderProjects } from '../global.js';

const projectsContainer = document.querySelector('.projects');

async function init() {
  const projects = await fetchJSON('/portfolio/lib/projects.json');
  renderProjects(projects, projectsContainer, 'h2');
  const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `${projects.length} Projects`;
}

init();

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let data = [1, 2, 3, 4, 5];
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie();

let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

arcs.forEach((arc, idx) => {
  d3.select('svg')
    .append('path')
    .attr('d', arc)
    .attr('fill', colors[idx]);
});

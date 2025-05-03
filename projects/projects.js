import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let query = '';
let projects = [];
let selectedYear = null;
let pieData = [];

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updateFilteredAndRender();
});

function updateFilteredAndRender() {
  const filteredCards = getFilteredProjects();
  renderProjects(filteredCards, projectsContainer, 'h2');
  renderPieChart(projects);
}

function getFilteredProjects() {
  let result = projects;

  if (selectedYear !== null) {
    result = result.filter(p => String(p.year) === String(selectedYear));
  }

  if (query.trim() !== '') {
    const lowerQuery = query.toLowerCase();
    result = result.filter(p =>
      Object.values(p).join('\n').toLowerCase().includes(lowerQuery)
    );
  }

  return result;
}

function renderPieChart(fullProjects) {
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  const rolledData = d3.rollups(
    fullProjects,
    v => v.length,
    d => d.year
  );

  pieData = rolledData.map(([year, count]) => ({ label: year, value: count }));

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(pieData);

  svg
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (_, i) => colors(i))
    .attr('class', (d) => d.data.label === selectedYear ? 'selected' : '')
    .on('click', (event, d) => {
      const clickedYear = d.data.label;
      selectedYear = (selectedYear === clickedYear) ? null : clickedYear;
      updateFilteredAndRender();
    });

  legend
    .selectAll('li')
    .data(pieData)
    .enter()
    .append('li')
    .attr('style', (_, i) => `--color:${colors(i)}`)
    .attr('class', (d) => d.label === selectedYear ? 'selected' : '')
    .html((d, i) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (event, d) => {
      const clickedYear = d.label;
      selectedYear = (selectedYear === clickedYear) ? null : clickedYear;
      updateFilteredAndRender();
    });
}

async function init() {
  projects = await fetchJSON('/portfolio/lib/projects.json');
  document.querySelector('.projects-title').textContent = `${projects.length} Projects`;
  updateFilteredAndRender();
}

init();
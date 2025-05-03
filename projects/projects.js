import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let query = '';
let projects = [];
let selectedIndex = -1;

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updateFilteredAndRender();
});

function updateFilteredAndRender() {
  const filteredProjects = projects.filter((project) => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  const selectedYear = selectedIndex !== -1 ? getYearByIndex(selectedIndex) : null;
  const finalProjects = selectedYear
    ? filteredProjects.filter((p) => p.year == selectedYear)
    : filteredProjects;

  renderProjects(finalProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
}

function getYearByIndex(index) {
  const rolledData = d3.rollups(
    projects,
    v => v.length,
    d => d.year
  );
  return rolledData.map(([year]) => year)[index];
}

function renderPieChart(projectsGiven) {
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );
  const data = rolledData.map(([year, count]) => ({ label: year, value: count }));
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);

  svg
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (_, i) => colors(i))
    .attr('style', 'cursor: pointer; transition: 300ms')
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''))
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateFilteredAndRender();
    });

  legend
    .selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .attr('style', (_, i) => `--color:${colors(i)}`)
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''))
    .html((d, i) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateFilteredAndRender();
    });
}

async function init() {
  projects = await fetchJSON('/portfolio/lib/projects.json');
  document.querySelector('.projects-title').textContent = `${projects.length} Projects`;
  updateFilteredAndRender();
}

init();

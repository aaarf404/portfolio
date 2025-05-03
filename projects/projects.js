import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let query = '';
let projects = [];
let selectedYear = null;
let pieData = [];
let colorScale;

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updateFilteredAndRender();
});

function getSearchFilteredProjects() {
  let result = projects;
  if (query.trim() !== '') {
    const lowerQuery = query.toLowerCase();
    result = result.filter(p => 
      Object.values(p).join('\n').toLowerCase().includes(lowerQuery)
    );
  }
  return result;
}

function getFilteredProjects() {
  let result = getSearchFilteredProjects();
  if (selectedYear !== null) {
    result = result.filter(p => String(p.year) === String(selectedYear));
  }
  return result;
}

function updateFilteredAndRender() {
  const filteredCards = getFilteredProjects();
  renderProjects(filteredCards, projectsContainer, 'h2');
  renderPieChart(getSearchFilteredProjects());
}

function renderPieChart(filteredProjects) {
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  const rolledData = d3.rollups(
    filteredProjects,
    v => v.length,
    d => d.year
  );
  pieData = rolledData.map(([year, count]) => ({ label: year, value: count }));

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(pieData);

  svg
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', d => colorScale(d.data.label))
    .attr('class', (d) => d.data.label === selectedYear ? 'selected' : '')
    .on('click', (event, d) => {
      selectedYear = (selectedYear === d.data.label) ? null : d.data.label;
      updateFilteredAndRender();
    });

  legend
    .selectAll('li')
    .data(pieData)
    .enter()
    .append('li')
    .attr('style', d => `--color:${colorScale(d.label)}`)
    .attr('class', (d) => d.label === selectedYear ? 'selected' : '')
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (event, d) => {
      selectedYear = (selectedYear === d.label) ? null : d.label;
      updateFilteredAndRender();
    });
}

async function init() {
  projects = await fetchJSON('/portfolio/lib/projects.json');
  document.querySelector('.projects-title').textContent = `${projects.length} Projects`;
  
  const years = Array.from(new Set(projects.map(p => p.year)));
  colorScale = d3.scaleOrdinal()
    .domain(years)
    .range(d3.schemeTableau10);
  
  updateFilteredAndRender();
}

init();
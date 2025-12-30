async function loadData() {
  const response = await fetch("2025.json");
  if (!response.ok) {
    throw new Error(`無法載入資料：${response.status}`);
  }
  return response.json();
}

const width = 900;
const height = 520;
const margin = { top: 24, right: 24, bottom: 32, left: 140 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const svg = d3
  .select("#chart")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().range([0, innerWidth]);
const y = d3.scaleBand().range([0, innerHeight]).padding(0.2);
const color = d3.scaleOrdinal(d3.schemeSet2);

let root;
let currentNode;

const breadcrumbEl = document.getElementById("breadcrumb");
const backButton = document.getElementById("back-button");
const legendList = document.getElementById("legend-list");

function formatValue(value) {
  return new Intl.NumberFormat("zh-Hant", { maximumFractionDigits: 0 }).format(value);
}

function updateLegend(nodes) {
  legendList.innerHTML = "";
  nodes.forEach((node, idx) => {
    const li = document.createElement("li");
    li.className = "legend-item";
    li.innerHTML = `
      <span class="legend-swatch" style="background:${color(idx)}"></span>
      <span>${node.data.name} — ${formatValue(node.value)} 戶</span>
    `;
    legendList.appendChild(li);
  });
}

function updateBreadcrumb(node) {
  const names = node.ancestors().reverse().map((n) => n.data.name);
  breadcrumbEl.textContent = names.join(" / ");
  backButton.disabled = node === root;
}

function render(node) {
  currentNode = node;
  const children = node.children || [];

  x.domain([0, d3.max(children, (d) => d.value) || 1]);
  y.domain(children.map((d) => d.data.name));

  const groups = chart.selectAll(".bar").data(children, (d) => d.data.name);

  const groupsEnter = groups
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d) => `translate(0, ${y(d.data.name)})`)
    .style("opacity", 0);

  groupsEnter
    .append("rect")
    .attr("height", y.bandwidth())
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("fill", (_, i) => color(i))
    .attr("width", 0)
    .on("click", (event, d) => {
      if (d.children && d.children.length) {
        render(d);
      }
    });

  groupsEnter
    .append("text")
    .attr("class", "name")
    .attr("x", 10)
    .attr("y", y.bandwidth() / 2 - 4)
    .text((d) => d.data.name);

  groupsEnter
    .append("text")
    .attr("class", "value")
    .attr("x", 10)
    .attr("y", y.bandwidth() / 2 + 14)
    .text((d) => `${formatValue(d.value)} 戶`);

  groupsEnter
    .merge(groups)
    .transition()
    .duration(450)
    .style("opacity", 1)
    .attr("transform", (d) => `translate(0, ${y(d.data.name)})`)
    .select("rect")
    .attr("width", (d) => x(d.value));

  groups
    .exit()
    .transition()
    .duration(200)
    .style("opacity", 0)
    .remove();

  updateLegend(children);
  updateBreadcrumb(node);
}

backButton.addEventListener("click", () => {
  if (currentNode && currentNode.parent) {
    render(currentNode.parent);
  }
});

loadData()
  .then((data) => {
    root = d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => d3.descending(a.value, b.value));

    render(root);
  })
  .catch((error) => {
    console.error(error);
    breadcrumbEl.textContent = "資料載入失敗";
    backButton.disabled = true;

    chart
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#b00020")
      .text("無法載入 2025.json 資料");
  });

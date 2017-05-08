function fakeData(datumCount) {
  data = [];
  var min, max;
  for (i=0; i < datumCount; i++) {
    min = Math.random() * 0.75;
    max = Math.min( 1.0, min + Math.random() * 0.5);
    data.push(
      {
        'tag': 'tag' + i,
        'min': min,
        'max': max,
      }
    )
  }
  return data;
}

document.addEventListener('DOMContentLoaded', function () {
  this.data = fakeData(100);
  this.state = {};
  this.state.sort = 'highest';
  addControlListeners();
  render(this.data, this.state);
}.bind(this));

function render(data, state) {
  var rows = d3.select('#viz-table')
    .selectAll('.row')
    .data(data, function(d,i) { return d.tag });

  enterRows(rows);
  updateRows(rows);
}

function updateRows(rows) { 
  rows.selectAll('.bar')
    .transition()
    .attr('width', function(d){
      return (100 * (d.max - d.min)) + '%';
    })
    .attr('x', function(d){
      return (100 * d.min) + '%';
    })
    .attr('opacity', function(d){
      return Math.pow((1.0 - d.max + d.min), 2)
    });

  rows.sort(function(a, b) {
    if (state.sort == 'lowest') {
      return (a.max + a.min) * 0.5 - (b.max + b.min) * 0.5;
    } else if (this.state.sort == 'highest') {
      return (b.max + b.min) * 0.5 - (a.max + a.min) * 0.5;
    }
  });
}

function enterRows(rows) {
  rows.selectAll('.tag')
    .text(function(d) {
      return d.tag;
    });
  rows.selectAll('.min')
    .text(function(d) {
      return d.min.toFixed(2);
    });
  rows.selectAll('.max')
    .text(function(d) {
      return d.max.toFixed(2);
    });  

  var rowsEnter = rows
    .enter()
    .append('tr')
    .classed('row', true)
  rowsEnter.append('td')
    .classed('tag', true)
  rowsEnter.append('td')
    .classed('min', true)
  rowsEnter.append('td')
    .classed('max', true)

  var vizEnter = rowsEnter.append('td')
    .append('svg')

  bar = vizEnter.append('rect')
    .classed('bar', true)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('opacity', 1.0)
    .attr('x', '0%')
    .attr('fill', '#606');

  rowsEnter.merge(rows);

  rows.exit()
    .remove();
}

function addControlListeners() {
  var buttons = document.querySelectorAll("#controls button");  
  buttons.forEach(function(button) {
    button.addEventListener('click', handleClick.bind(this))
  });
}

function handleClick(event){
  this.state.sort = event.target.dataset.sort;
  render(this.data, this.state);
}


function confidenceInterval(up, dn){
  var lower = ((up + 1.9208) / (up + dn) - 1.96 * Math.sqrt((up *  dn) / (up +  dn) + 0.9604) / (up +  dn)) / (1 + 3.8416 / (up +  dn));
  var upper = ((up + 1.9208) / (up + dn) + 1.96 * Math.sqrt((up *  dn) / (up +  dn) + 0.9604) / (up +  dn)) / (1 + 3.8416 / (up +  dn));
  return [lower, upper];
}

function fakeData(datumCount) {
  data = [];
  var min, max;
  for (i=0; i < datumCount; i++) {
    upvotes = Math.round(Math.random() * 100);
    downvotes = Math.round(Math.random() * 100);
    bounds = confidenceInterval(upvotes, downvotes);
    max = Math.min( 1.0, min + Math.random() * 0.5);
    data.push(
      {
        'tag': 'tag' + i,
        'upvotes': upvotes,
        'downvotes': downvotes,
        'min': bounds[0],
        'max': bounds[1],
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
  enterRows();
  updateRows();
}

function updateRows(rows) { 
  var rows = d3.select('#viz-table')
    .selectAll('.row')
    .data(data, function(d,i) { return d.tag });

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

  rows.selectAll('.tag')
    .text(function(d) {
      return d.tag;
    });
  rows.selectAll('.upvotes')
    .text(function(d) {
      return d.upvotes;
    });
  rows.selectAll('.downvotes')
    .text(function(d) {
      return d.downvotes;
    });
  rows.selectAll('.min')
    .text(function(d) {
      return d.min.toFixed(2);
    });
  rows.selectAll('.max')
    .text(function(d) {
      return d.max.toFixed(2);
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
  var rows = d3.select('#viz-table')
    .selectAll('.row')
    .data(data, function(d,i) { return d.tag });

  var header = d3.select('#viz-table')
    .append('tr')
  
  header.append('th')
    .text('id');
  header.append('th')
    .text('upvotes');
  header.append('th')
    .text('downvotes');
  header.append('th')
    .text('lower');
  header.append('th')
    .text('upper');
  header.append('th')
    .text('viz');

  var rowsEnter = rows
    .enter()
    .append('tr')
    .classed('row', true)
  rowsEnter.append('td')
    .classed('tag', true)
  rowsEnter.append('td')
    .classed('upvotes', true)
  rowsEnter.append('td')
    .classed('downvotes', true)
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

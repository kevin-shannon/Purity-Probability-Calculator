classes = ["aquatic","beast","bird","bug","plant","reptile"]

items = document.getElementsByClassName("dropdown-item");

function buildDropDown(values, menu) {
  let contents = []
  for(let name of values) {
    contents.push('<input type="button" class="dropdown-item" value="' + name + '"/>')
  }
  $(menu).append(contents.join(""))
}

$('#classItems').on('click', '.dropdown-item', function() {
  $('#dropdown-class').text($(this)[0].value);
  $("#dropdown-class").dropdown('toggle');
})

buildDropDown(classes, '#classItems')

$(document).ready(function() {
  $("#calcButton").click(function(ImageSwap) {
    axies = {}
    getAxie($('#dad-ID').val(), setDadImg);
    getAxie($('#mom-ID').val(), setMomImg);
    var pmf = poissonBinomial(genPartProbs($('#dropdown-class').text(), parseInt($('#dad-ID').val()), parseInt($('#mom-ID').val())));
    buildTable(pmf, "prob-table");
    makeChart(pmf, $('#dropdown-class').text());
  });
});

function setDadImg() {
  document.getElementById("dadImg").src = axies[parseInt($('#dad-ID').val())].image;
}

function setMomImg() {
  document.getElementById("momImg").src = axies[parseInt($('#mom-ID').val())].image;
}

function buildTable(pmf, name) {
  $("#" + name + " tr").remove();
  tbl = document.getElementById(name);
  var thed = document.createElement('thead');
  var tbdy = document.createElement('tbody');
  var tr = document.createElement('tr');
  var td = document.createElement('td');
  var th = document.createElement('th')
  th.scope = "col";
  th.appendChild(document.createTextNode("#"));
  tr.appendChild(th);
  th = document.createElement('th')
  th.scope = "col";
  th.appendChild(document.createTextNode("Probability"));
  tr.appendChild(th);
  thed.appendChild(tr);
  tbl.appendChild(thed);
  for(var i = 0; i < pmf.length; i++) {
    tr = document.createElement('tr');
    td = document.createElement('td');
    th = document.createElement('th');
    th.scope = "row";
    th.appendChild(document.createTextNode(i));
    if(pmf[i] > 0 && parseFloat(pmf[i].toFixed(5)) == 0) {
      td.appendChild(document.createTextNode("~0%"));
    } else {
      td.appendChild(document.createTextNode(parseFloat((pmf[i]*100).toFixed(5))+"%"));
    }
    tr.appendChild(th);
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
}

function makeChart(pmf, cls) {
  var ctx = document.getElementById("myChart").getContext('2d');
  ctx.canvas.width = $("#infographics")[0].offsetWidth/1.8;
  ctx.canvas.height = $("#infographics")[0].offsetHeight;
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["0", "1", "2", "3", "4", "5", "6"],
      datasets: [{
        data: [parseFloat((pmf[0]*100).toFixed(5)),
        parseFloat((pmf[1]*100).toFixed(5)),
        parseFloat((pmf[2]*100).toFixed(5)),
        parseFloat((pmf[3]*100).toFixed(5)),
        parseFloat((pmf[4]*100).toFixed(5)),
        parseFloat((pmf[5]*100).toFixed(5)),
        parseFloat((pmf[6]*100).toFixed(5))],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Probability Distribution of Purity for " + cls.charAt(0).toUpperCase() + cls.slice(1) + " Parts"
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Number of Parts'
          },
          gridLines: {
            display:false
          }
        }],
        yAxes: [{
          ticks: {
             callback: function(value) {
               return value + "%"
             }
           },
        }]
      }
    }
  });
}

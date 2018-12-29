classes = ["aquatic","beast","bird","bug","plant","reptile"]

items = document.getElementsByClassName("dropdown-item");

jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};

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
  if($(this)[0].value == "aquatic") {
    $('#dropdown-class').removeClass().addClass('btn btn-aquatic dropdown-toggle btn-space')
  } else if($(this)[0].value == "beast") {
    $('#dropdown-class').removeClass().addClass('btn btn-beast dropdown-toggle btn-space')
  } else if($(this)[0].value == "bird") {
    $('#dropdown-class').removeClass().addClass('btn btn-bird dropdown-toggle btn-space')
  } else if($(this)[0].value == "bug") {
    $('#dropdown-class').removeClass().addClass('btn btn-bug dropdown-toggle btn-space')
  } else if($(this)[0].value == "plant") {
    $('#dropdown-class').removeClass().addClass('btn btn-plant dropdown-toggle btn-space')
  } else if($(this)[0].value == "reptile") {
    $('#dropdown-class').removeClass().addClass('btn btn-reptile dropdown-toggle btn-space')
  }
})

buildDropDown(classes, '#classItems')

$(document).ready(function() {
  $("#calcButton").click(function(ImageSwap) {
    if($('#dropdown-class').text() == "Class") {
      $('.alert').visible();
      return;
    }
    $('.alert').invisible();
    $('#infographics').show();
    $('#expected-val').show();
    axies = {}
    getAxie($('#dad-ID').val(), setDadImg);
    getAxie($('#mom-ID').val(), setMomImg);
    var pmf = poissonBinomial(genPartProbs($('#dropdown-class').text(), parseInt($('#dad-ID').val()), parseInt($('#mom-ID').val())));
    buildTable(pmf, "prob-table");
    makeChart(pmf, $('#dropdown-class').text());
    showExpectedValue(pmf);
  });
});

function setDadImg() {
  document.getElementById("dadImg").src = axies[parseInt($('#dad-ID').val())].image;
}

function setMomImg() {
  document.getElementById("momImg").src = axies[parseInt($('#mom-ID').val())].image;
}

function reset(id) {
  $('#infographics').hide();
  $('#expected-val').hide();
  resetImg(id);
}

function resetImg(id) {
  if(parseInt($('#dad-ID').val()) == id || id == "") {
    document.getElementById("dadImg").src = 'img/emptyaxie.png';
  } if(parseInt($('#mom-ID').val()) == id || id == "") {
    document.getElementById("momImg").src = 'img/emptyaxie.png';
  }
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
  $("canvas#myChart").remove();
  $("div.chart-container").append('<canvas id="myChart"></canvas>');
  $('iframe.chartjs-hidden-iframe').remove();
  var ctx = document.getElementById("myChart").getContext('2d');
  ctx.canvas.width = $("#infographics")[0].offsetWidth/1.8;
  ctx.canvas.height = $("#infographics")[0].offsetHeight;
  var colcolor;
  if(cls == "aquatic") {
    colcolor = 'rgba(0, 190, 196, 0.5)'
  } else if(cls == "beast") {
    colcolor = 'rgba(255, 183, 5, 0.5)'
  } else if(cls == "bird") {
    colcolor = 'rgba(253, 146, 190, 0.5)'
  } else if(cls == "bug") {
    colcolor = 'rgba(240, 90, 65, 0.5)'
  } else if(cls == "plant") {
    colcolor = 'rgba(107, 194, 0, 0.5)'
  } else {
    colcolor = 'rgba(201, 136, 220, 0.5)'
  }
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
          colcolor,
          colcolor,
          colcolor,
          colcolor,
          colcolor,
          colcolor,
          colcolor
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

function showExpectedValue(pmf) {
  var i;
  var E = 0;
  for(i = 1; i < pmf.length; i++) {
    E += i*pmf[i];
  }
  document.getElementById("expected-val").innerHTML = "Average Purity: " + E.toFixed(5);
}

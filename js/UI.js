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
      td.appendChild(document.createTextNode("nearly impossible"));
    } else {
      td.appendChild(document.createTextNode(parseFloat((pmf[i]*100).toFixed(7))+"%"));
    }
    tr.appendChild(th);
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
}

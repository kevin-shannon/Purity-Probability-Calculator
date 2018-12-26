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
    poissonBinomial(genPartProbs($('#dropdown-class').text(), parseInt($('#dad-ID').val()), parseInt($('#mom-ID').val())));
  });
});

function setDadImg() {
  document.getElementById("dadImg").src = axies[parseInt($('#dad-ID').val())].image;
}

function setMomImg() {
  document.getElementById("momImg").src = axies[parseInt($('#mom-ID').val())].image;
}

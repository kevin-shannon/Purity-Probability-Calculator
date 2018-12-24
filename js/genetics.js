const classGeneMap = {"0000": "beast", "0001": "bug", "0010": "bird", "0011": "plant", "0100": "aquatic", "0101": "reptile"};

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost/index.html"));
}
var BigNumber = web3.utils.BN;
axies = {}

function strMul(str, num) {
  var s = "";
  for (var i = 0; i < num; i++) {
    s += str;
  }
  return s;
}

function genesToBin(genes) {
  var genesString = genes.toString(2);
  genesString = strMul("0", 256 - genesString.length) + genesString
  return genesString;
}

function getGenes(genes) {
  var groups = [genes.slice(64, 96), genes.slice(96, 128), genes.slice(128, 160), genes.slice(160, 192), genes.slice(192, 224), genes.slice(224, 256)];
  let eyes = getGenesFromGroup("eyes", groups[0]);
  let mouth = getGenesFromGroup("mouth", groups[1]);
  let ears = getGenesFromGroup("ears", groups[2]);
  let horn = getGenesFromGroup("horn", groups[3]);
  let back = getGenesFromGroup("back", groups[4]);
  let tail = getGenesFromGroup("tail", groups[5]);
  return {eyes: eyes, mouth: mouth, ears: ears, horn: horn, back: back, tail: tail};
}

function getGenesFromGroup(part, group, region) {
  let dClass = classGeneMap[group.slice(2, 6)];
  let r1Class = classGeneMap[group.slice(12, 16)];
  let r2Class = classGeneMap[group.slice(22, 26)];
  return {dClass: dClass, r1Class: r1Class, r2Class: r2Class};
}

function getAxie(id, callback) {
  $.ajax({
     async: false,
     type: 'GET',
     url: "https://api.axieinfinity.com/v1/axies/" + parseInt(id),
     success: function(data) {
       if (data.stage < 3) {
         return;
       }
       axies[data.id] = {"id": data.id, "genes": genesToBin(new BigNumber(data.genes))};
       let axie = axies[data.id];
       console.log(0)
       axie.image = data.figure.static.idle;
       axie.traits = getGenes(axie.genes);
       callback();
     }
  });
}

function clearAxies() {
  axies = {}
}

function generateProbabilities() {

}

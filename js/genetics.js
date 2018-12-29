const classGeneMap = {"0000": "beast", "0001": "bug", "0010": "bird", "0011": "plant", "0100": "aquatic", "0101": "reptile"};
const partNames = ["eyes","ears","mouth","horn","back","tail"];

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
        reset(id);
        return;
      }
      axies[data.id] = {"id": data.id, "genes": genesToBin(new BigNumber(data.genes))};
      let axie = axies[data.id];
      axie.image = data.figure.static.idle;
      axie.traits = getGenes(axie.genes);
      callback();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      reset(id);
   }
  });
}

function genPartProbs(desire, dadID, momID) {
  partProbsList = [0,0,0,0,0,0];
  for(parts in classes) {
    if(eval("axies[dadID].traits." + partNames[parts] + ".dClass;") == desire) {
      partProbsList[parts] += .375;
    }
    if(eval("axies[momID].traits." + partNames[parts] + ".dClass;") == desire) {
      partProbsList[parts] += .375;
    }
    if(eval("axies[dadID].traits." + partNames[parts] + ".r1Class;") == desire) {
      partProbsList[parts] += .09375;
    }
    if(eval("axies[momID].traits." + partNames[parts] + ".r1Class;") == desire) {
      partProbsList[parts] += .09375;
    }
    if(eval("axies[dadID].traits." + partNames[parts] + ".r2Class;") == desire) {
      partProbsList[parts] += .03125;
    }
    if(eval("axies[momID].traits." + partNames[parts] + ".r2Class;") == desire) {
      partProbsList[parts] += .03125;
    }
    if(partProbsList[parts] == 1) {
      partProbsList[parts] -= .01 //recursive poisson bimnomial cannot have probability of an event equal to 1
    }
  }
  return partProbsList;
}

function poissonBinomial(s) {
  n = s.length;
  pmf = new Array(n+1).fill(0);

  //Case K = 0
  pmf[0] = prod(invert(s));

  //find T(i)
  T = new Array(n).fill(0);
  var k;
  for(k = 0; k < n; k++) {
    T[k] = sumT(s, k+1);
  }

  //Case k > 0
  for(k = 1; k <= n; k++) {
    var u;
    for(u = 1; u <= k; u++) {
      pmf[k] = pmf[k] + (Math.pow(-1,(u-1))*pmf[k-u]*T[u-1]);
    }
    pmf[k] = pmf[k]/k;
  }
  return pmf;
}

function prod(list) {
  var product = 1;
  var i;
  for(i = 0; i < list.length; i++) {
    product *= list[i];
  }
  return product;
}

function invert(list) {
  var i;
  inv = new Array(list.length).fill(0);
  for(i = 0; i < list.length; i++) {
    inv[i] = 1 - list[i];
  }
  return inv;
}

function sumT(list, k) {
  var i;
  var sum = 0;
  for(i = 0; i < list.length; i++) {
    sum += Math.pow(list[i]/(1 - list[[i]]),k);
  }
  return sum;
}

function div(list, val) {
  var i;
  for(i = 0; i < list.length; i++) {
    list[k] /= val;
  }
  return list;
}

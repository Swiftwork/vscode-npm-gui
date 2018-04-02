module.exports = function (type, long) {
  long = typeof long === 'boolean' ? long : false;
  switch (type) {
    default:
    case 0: return long ? 'Production' : 'Prod';
    case 1: return long ? 'Development' : 'Dev';
    case 2: return 'Peer';
    case 3: return long ? 'Optional' : 'Opt';
  }
};

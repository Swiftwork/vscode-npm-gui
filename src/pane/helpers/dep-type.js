module.exports = function (type, long) {
  long = typeof long === 'boolean' ? long : false;
  switch (type) {
    default:
    case 'dependencies': return long ? 'Production' : 'Prod';
    case 'devDependencies': return long ? 'Development' : 'Dev';
    case 'peerDependencies': return 'Peer';
    case 'optionalDependencies': return long ? 'Optional' : 'Opt';
  }
};

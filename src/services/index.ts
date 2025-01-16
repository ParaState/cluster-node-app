import * as info from './info';
import * as user from './user';
import * as claim from './claim';
import * as operator from './operator';
import * as validator from './validator';
import * as beaconcha from './beaconcha';
import * as clusterNode from './clusterNode';

const services = {
  clusterNode,
  operator,
  validator,
  info,
  claim,
  user,
  beaconcha,
};

export default services;

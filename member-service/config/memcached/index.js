

const memjs = require('memjs');
const mc = memjs.Client.create(`memcached-19348.c1.asia-northeast1-1.gce.cloud.redislabs.com:19348`, {
  username: `phongvt2004`,
  password: `SsyG8QdIAvHV6N9t8GAeKnaUGBsaUxsv`
});

module.exports = mc
const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment().format('LL')
  },
}

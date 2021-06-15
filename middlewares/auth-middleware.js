module.exports = {
  authenticatedOnly: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')
    }
  },
  guestOnly: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/dashboard')
    }
  },
}

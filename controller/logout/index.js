exports.logout = (req, res) => {
    res.clearCookie('auth')
    res.send("logout")
}
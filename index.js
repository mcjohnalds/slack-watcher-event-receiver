exports.handshake = (req, res) => {
  res.send(req.body.message);
}

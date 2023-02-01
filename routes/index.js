var express = require('express');
var router = express.Router();
const carbo = require('cbor')
var crypto = require("crypto");

/* GET home page. */
router.post("/attest", function (req, res, next) {
  const clientDataBuffer = req.clientDataBuffer;
  const assertionBuffer = req.assertionBuffer;
  try {
    let assert = carbo.decodeAllSync(assertionBuffer)[0];
    let authData = assert.authenticatorData; // buffer
    let signature = assert.signature; // buffer
    // compute client Data Hash
    let clientDataHash = crypto
      .createHash("sha256")
      .update(clientDataBuffer)
      .digest("base64");
    let clientDataHashBuffer = Buffer.from(clientDataHash, "base64");
    // compute composite hash
    let compositeBuffer = Buffer.concat([authData, clientDataHashBuffer]);
    let nonce = crypto
      .createHash("sha256")
      .update(compositeBuffer)
      .digest("base64"); // base64 string
    let nonceBuffer = Buffer.from(nonce, "base64");
    // load public key
    let keyObj = crypto.createPublicKey(k_publicKeyPem);
    // verify signature
    let verifier = crypto.createVerify("sha256").update(nonceBuffer);
    let sign_verify = verifier.verify(keyObj, signature);
    console.log("sign_verify: ", sign_verify);
    res.send({"sign_verify":sign_verify});
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;

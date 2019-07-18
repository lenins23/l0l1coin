const Sha256 = require('./sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
class Transaccion {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now();

    }

    calculateHash() {
        return Sha256.hash(this.fromAddress + this.toAddress + this.amount + this.timestamp)
            .toString();
    }
    signTransaction(signingKey) {
        // Solo puede enviar una transacción desde la billetera que está vinculada a su
        // llave. Así que aquí comprobamos si la dirección coincide con su clave pública

        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('No puedes firmar transacciones para otras carteras!');
        }

        // Calcule el hash de esta transacción, firme con la clave 
        // y guárdelo dentro del objeto de transacción
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }
    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('Sin firma en esta transacción');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports = Transaccion
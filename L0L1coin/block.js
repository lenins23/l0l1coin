const Sha256 = require('./sha256')
const Transaccion = require('./transaccion')
class Block {
    constructor(timestamp, Transacciones, hashPrevio = '') {
        this.timestamp = timestamp
        this.Transacciones = Transacciones
        this.hashPrevio = hashPrevio
        this.hash = this.calcularHash()
        this.nonce = 0
    }

    calcularHash() {
        return Sha256.hash(this.timestamp + this.hashPrevio + JSON.stringify(this.data) + this.nonce).toString()
    }

    minarBloque(dificultad) {
        while (this.hash.substring(0, dificultad) !== Array(dificultad + 1).join('0')) {
            this.nonce++
                this.hash = this.calcularHash()
        }
        console.log('Bloque minado:' + this.hash)
    }

    hasValidTransactions() {
        for (const tx of this.Transacciones) {
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Block
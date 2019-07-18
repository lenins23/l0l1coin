const Block = require('./block')
const Transaction = require('./transaccion')

class BlockChain {
    constructor() {
        this.chain = [this.crearBloqueGenesis()]
        this.dificultad = 3
        this.TransaccionesPendientes = []
        this.RecompensaMinado = 100
    }

    crearBloqueGenesis() {
        return new Block('19/07/2019', 'Bloque Genesis', '0')
    }
    getUltimoBloque() {
        return this.chain[this.chain.length - 1]
    }

    /*
    agregarBloque(nuevoBloque) {
        nuevoBloque.hashPrevio = this.getUltimoBloque().hash
        nuevoBloque.minarBloque(this.dificultad)
        this.chain.push(nuevoBloque)
    }*/

    agregarTransaccion(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Tiene que contener un destinatario y un remitente');
        }

        // Verificacion de la transaccion
        if (!transaction.isValid()) {
            throw new Error('No se puede agregar una transacción no válida a la cadena');
        }

        if (transaction.amount <= 0) {
            throw new Error('El monto de la transacción debe ser mayor que 0');
        }

        this.TransaccionesPendientes.push(transaction)
    }
    minarTransaccionesPendientes(addressMinero) {
        const rewardTx = new Transaction(null, addressMinero, this.RecompensaMinado);
        this.TransaccionesPendientes.push(rewardTx);

        let block = new Block(Date.now(), this.TransaccionesPendientes)
        block.hashPrevio = this.getUltimoBloque().hash
        block.minarBloque(this.dificultad)
        console.log('Se ha minado Correctamente el Bloque')
        this.chain.push(block)

        this.TransaccionesPendientes = [];

    }

    getBalanceOfAddress(address) {
        let balance = 0
        for (const block of this.chain) {
            for (const trans of block.Transacciones) {
                if (trans.fromAddress == address) {
                    balance -= trans.amount
                }

                if (trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }
        return balance
    }

    getAllTransactionsForWallet(address) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.Transacciones) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }

        return txs;
    }

    validarChain() {
        const realGenesis = JSON.stringify(this.crearBloqueGenesis());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }
        for (let i = 1; i < this.chain.length; i++) {
            const bloqueActual = this.chain[i]
            const bloqueAnterior = this.chain[i - 1]

            if (bloqueActual.hash != bloqueActual.calcularHash()) {
                return false
            }

            if (bloqueActual.hashPrevio != bloqueAnterior.hash) {
                return false
            }
        }
        return true
    }
}

module.exports = BlockChain
const solanaWeb3 = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key')
const nacl = require('tweetnacl');
const rl = require('readline-sync')
const fs = require('fs')

/*
    Solana Wallet Generator
    Created by Viloid ( github.com/vsec7 )
*/

async function createWallet(){
	const mnemonic = bip39.generateMnemonic(256);
	const x = derivePath("m/44'/501'/0'/0'", bip39.mnemonicToSeedSync(mnemonic)).key;
	const pk = nacl.sign.keyPair.fromSeed(x).secretKey;
	const acc = new solanaWeb3.Account(pk);
	return {
		'address': acc.publicKey.toBase58(), 
		'pk': pk,
		'mnemonic': mnemonic
	}
}

async function generateWallet( n, o){
	for (var i = 1; i <= n; i++) {
		const wallet = await createWallet()
		const data = `Address : ${wallet.address}\nPrivateKey: [${wallet.pk}]\nMnemonic: ${wallet.mnemonic}\n`;
		if(o){
			fs.appendFile( o, data+'\n', (err) => { if(err) throw err; })
		}
		console.log(data)
	}
}

(async () => {
	console.log(`
+-----------------------------------------+
|
| 	Solana Wallet Generator
| Crafted by Viloid ( github.com/vsec7 )
|
+-----------------------------------------+
		`)
	const n = rl.question('[?] How Many Wallet: ')
	const o = rl.question('[?] Output (just enter if you dont need backup to file): ')
	console.log('\n')
	await generateWallet( n, o)
})();

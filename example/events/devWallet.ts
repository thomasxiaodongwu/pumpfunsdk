const { Connection, PublicKey } = require('@solana/web3.js');

// 配置连接到 Solana 网络
const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=98347d3d-111e-437f-97b2-0d0acc953b2d');

// 合约和事件的地址（通常是 mint 地址）
const contractAddress = new PublicKey('Df6bWLPHM9AsuhAUG9MuDi7hDCJwN3bHsY1kNttJDFLi');

// 每页获取的签名数量
const limit = 100;

function reverseArray<T>(arr: T[]): T[] {
    return arr.slice().reverse();
}

const startTime = new Date('2024-10-01').getTime() / 1000;
const endTime = new Date('2024-10-10').getTime() / 1000;

async function fetchEventsInRange() {
    let allSignatures = [];
    let before: string | null = null;

    while (true) {
        const signatures = await connection.getSignaturesForAddress(contractAddress, {
            limit,
            before
        });

        if (signatures.length === 0) {
            break;
        }

        for (let signatureInfo of signatures) {
            const blockTime = signatureInfo.blockTime || 0;
            if (blockTime >= startTime && blockTime <= endTime) {
                // @ts-ignore
                allSignatures.push(signatureInfo);
            }
        }

        before = signatures[signatures.length - 1].signature;
    }

    for (let signatureInfo of allSignatures) {
        const transaction = await connection.getTransaction(signatureInfo.signature);

        if (transaction && transaction.meta && transaction.meta.logMessages) {
            for (let log of transaction.meta.logMessages) {
                if (log.includes('Create')) {
                    console.log('Event found:', log);
                }
            }
        }
    }
}


fetchEventsInRange().catch(err => {
    console.error(err);
});
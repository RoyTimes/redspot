import { Account, getAddressOf } from './account';
import type BN from 'bn.js';

export interface BalanceChangeOptions {
  includeFee?: boolean;
}

export function getAddresses(accounts: Account[]) {
  return Promise.all(accounts.map((account) => getAddressOf(account)));
}

export async function getBalances(
  accounts: Account[],
  blockNumber?: string | number | BigInt | BN
) {
  return Promise.all(
    accounts.map((account) => getBalance(account, blockNumber))
  );
}

export async function getBalance(
  account: Account,
  blockNumber?: string | number | BigInt | BN
) {
  if (!account.api) {
    throw new TypeError('Api not found');
  }
  const address = await getAddressOf(account);

  if (blockNumber === undefined) {
    const accountInfo = await account.api.query.system.account(address);
    return accountInfo.data.free;
  } else {
    const hash = await account.api.rpc.chain.getBlockHash(blockNumber);
    const accountInfo = await account.api.query.system.account.at(
      hash,
      address
    );
    return accountInfo.data.free;
  }
}

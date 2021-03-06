import BN from 'bn.js';
import { isU8a, u8aEq } from '@polkadot/util';
export function supportEq(
  Assertion: Chai.AssertionStatic,
  utils: Chai.ChaiUtils
) {
  Assertion.overwriteMethod('equal', override(utils));
  Assertion.overwriteMethod('eq', override(utils));
}

function override(utils: Chai.ChaiUtils) {
  return (_super: (...args: any[]) => any) =>
    overwriteBigNumberFunction(_super, utils);
}

function overwriteBigNumberFunction(
  _super: (...args: any[]) => any,
  chaiUtils: Chai.ChaiUtils
) {
  return function (this: Chai.AssertionStatic, ...args: any[]) {
    const [actual] = args;

    const expected = chaiUtils.flag(this, 'object');

    if (BN.isBN(expected) || BN.isBN(actual)) {
      this.assert(
        new BN(expected).eq(actual),
        `Expected "${expected}" to be equal ${actual}`,
        `Expected "${expected}" NOT to be equal ${actual}`,
        expected,
        actual
      );
    } else if (expected && typeof expected === 'object' && expected.eq) {
      this.assert(
        expected.eq(actual),
        `Expected "${expected}" to be equal ${actual}`,
        `Expected "${expected}" NOT to be equal ${actual}`,
        expected,
        actual
      );
    } else if (isU8a(expected) || isU8a(actual)) {
      this.assert(
        u8aEq(expected, actual),
        `Expected "${expected}" to be equal ${actual}`,
        `Expected "${expected}" NOT to be equal ${actual}`,
        expected,
        actual
      );
    } else {
      _super.apply(this, args);
    }
  };
}

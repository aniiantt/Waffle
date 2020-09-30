import {AssertionError, expect} from 'chai';
import {MockProvider} from '@ethereum-waffle/provider';
import {Contract} from 'ethers';

describe('INTEGRATION: changeBalances matcher', () => {
  const provider = new MockProvider();
  const [sender, receiver] = provider.getWallets();
  const contract = new Contract(receiver.address, [], provider);

  describe('Transaction Callback', () => {
    describe('Change balances, one account, one contract', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: contract.address,
            gasPrice: 0,
            value: 200
          })
        ).to.changeBalances([sender, contract], [-200, 200]);
      });
    });

    describe('Change balance, multiple accounts', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).to.changeBalances([sender, receiver], ['-200', 200]);
      });

      it('Should pass when negated and numbers don\'t match', async () => {
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).to.not.changeBalances([sender, receiver], [-201, 200]);
        await expect(() =>
          sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
        ).to.not.changeBalances([sender, receiver], [-200, 201]);
      });

      it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: 0,
              value: 200
            })
          ).to.changeBalances([sender, receiver], [-200, 201])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
            'to change balance by -200,201 wei, but it has changed by -200,200 wei'
        );
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: 0,
              value: 200
            })
          ).to.changeBalances([sender, receiver], [-201, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
            'to change balance by -201,200 wei, but it has changed by -200,200 wei'
        );
      });

      it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
        await expect(
          expect(() =>
            sender.sendTransaction({
              to: receiver.address,
              gasPrice: 0,
              value: 200
            })
          ).to.not.changeBalances([sender, receiver], [-200, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
            'to not change balance by -200,200 wei'
        );
      });
    });
  });

  describe('Transaction Response', () => {
    describe('Change balances, one account, one contract', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(await sender.sendTransaction({
          to: contract.address,
          gasPrice: 0,
          value: 200
        })
        ).to.changeBalances([sender, contract], [-200, 200]);
      });
    });

    describe('Change balance, multiple accounts', () => {
      it('Should pass when all expected balance changes are equal to actual values', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
        ).to.changeBalances([sender, receiver], ['-200', 200]);
      });

      it('Should pass when negated and numbers don\'t match', async () => {
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
        ).to.not.changeBalances([sender, receiver], [-201, 200]);
        await expect(await sender.sendTransaction({
          to: receiver.address,
          gasPrice: 0,
          value: 200
        })
        ).to.not.changeBalances([sender, receiver], [-200, 201]);
      });

      it('Should throw when expected balance change value was different from an actual for any wallet', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
          ).to.changeBalances([sender, receiver], [-200, 201])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
            'to change balance by -200,201 wei, but it has changed by -200,200 wei'
        );
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
          ).to.changeBalances([sender, receiver], [-201, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
            'to change balance by -201,200 wei, but it has changed by -200,200 wei'
        );
      });

      it('Should throw in negative case when expected balance changes value were equal to an actual', async () => {
        await expect(
          expect(await sender.sendTransaction({
            to: receiver.address,
            gasPrice: 0,
            value: 200
          })
          ).to.not.changeBalances([sender, receiver], [-200, 200])
        ).to.be.eventually.rejectedWith(
          AssertionError,
          'Expected 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff,0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 ' +
            'to not change balance by -200,200 wei'
        );
      });
    });
  });
});

import { ethers } from 'ethers';

export const connectWallet = async () => {
  if (!window.ethereum) {
    console.warn('No crypto wallet found. Simulating connection for UI purposes.');
    // Return a mock simulated wallet to keep the UI engaging
    return new Promise((resolve) => setTimeout(() => resolve({
      address: '0xWeb3SimulatedAddressOnly' + Math.floor(Math.random() * 10000),
      balance: (Math.random() * 5).toFixed(4)
    }), 800));
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    const balance = await provider.getBalance(address);
    const formattedBalance = ethers.formatEther(balance);

    return {
      address,
      balance: formattedBalance
    };
  } catch (err) {
    console.error('Wallet connection failed:', err);
    throw err;
  }
};

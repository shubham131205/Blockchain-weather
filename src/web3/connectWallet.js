import { ethers } from 'ethers';

/**
 * Connects the user to a Web3 wallet like MetaMask.
 * Falls back to simulation if no extension exists.
 */
export async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      return {
        success: true,
        address: address,
        shortAddress: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        message: 'Connected to Web3'
      };
    } catch (error) {
      console.error('User rejected connection:', error);
      return { success: false, message: 'Connection rejected by user.', address: null };
    }
  } else {
    console.warn('No Web3 provider detected. Simulating connection.');
    const mockAddress = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    return {
      success: true,
      address: mockAddress,
      shortAddress: `${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`,
      message: 'Simulated Web3 Connection (No Extension)',
      isSimulated: true
    };
  }
}

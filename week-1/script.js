import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.1/dist/ethers.min.js";

const CONTRACT_ADDRESS = "0x046b40ae0Ac38119DD07ea87Cd9Fb726924886Aa";
const ABI = [
  "function store(uint256 _value)",
  "function retrieve() view returns (uint256)",
];

let provider, signer, contract;

async function init() {
  provider = new ethers.BrowserProvider(window.ethereum);
  try {
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    console.log("Connected:", await signer.getAddress());
    await loadValue();
  } catch (error) {
    console.error("Connection failed:", error);
  }

  window.ethereum.on("accountsChanged", init);
  window.ethereum.on("chainChanged", () => window.location.reload());
}

async function setValue() {
  const input = document.getElementById("numberInput");
  const value = parseInt(input.value);
  if (isNaN(value)) return alert("Invalid number");

  const button = document.getElementById("submitBtn");
  button.disabled = true;
  button.textContent = "Setting...";

  try {
    const tx = await contract.store(value);
    await tx.wait();
    console.log("Tx Hash:", tx.hash);
    await loadValue();
  } catch (error) {
    console.error("Tx failed:", error);
    alert("Transaction failed — check gas/funds");
  } finally {
    button.disabled = false;
    button.textContent = "Submit to Blockchain";
    input.value = "";
  }
}

async function loadValue() {
  try {
    console.log("Loading value...");
    const value = await contract.retrieve();
    document.getElementById(
      "storedValue"
    ).textContent = `Stored Value: ${value.toString()}`;
  } catch (error) {
    console.error("Read failed:", error);
    document.getElementById("storedValue").textContent = "Error loading value";
  }
}

// Event listeners
document.getElementById("submitBtn").addEventListener("click", setValue);
window.addEventListener("load", init); // Auto-connect on load

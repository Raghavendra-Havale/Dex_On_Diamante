(async () => {
  const { default: fetch } = await import("node-fetch");
  const DiamSdk = require("diamnet-sdk");
  const server = new DiamSdk.Aurora.Server(
    "https://diamtestnet.diamcircle.io/"
  );

  // Initialize accounts and asset
  const issuerKeypair = DiamSdk.Keypair.random();
  const distributorKeypair = DiamSdk.Keypair.random();
  const buyerKeypair = DiamSdk.Keypair.random();
  const customAsset = new DiamSdk.Asset(
    "TradeToken",
    issuerKeypair.publicKey()
  );
  let liquidityPoolId = "<LiquidityPoolID>"; // Placeholder for actual pool ID

  console.log("Issuer Public Key:", issuerKeypair.publicKey());
  console.log("Distributor Public Key:", distributorKeypair.publicKey());
  console.log("Buyer Public Key:", buyerKeypair.publicKey());

  // Helper function to fund accounts using Friendbot
  const fundAccount = async (keypair) => {
    try {
      const response = await fetch(
        `https://friendbot.diamcircle.io?addr=${keypair.publicKey()}`
      );
      if (response.ok) {
        console.log(`Account ${keypair.publicKey()} funded.`);
      } else {
        console.error(
          `Error funding account ${keypair.publicKey()}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Error funding account ${keypair.publicKey()}:`, error);
    }
  };

  // Establish dynamic trustline for any account
  const establishTrustline = async (secret) => {
    try {
      const accountKeypair = DiamSdk.Keypair.fromSecret(secret);
      const account = await server.loadAccount(accountKeypair.publicKey());
      const transaction = new DiamSdk.TransactionBuilder(account, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.changeTrust({
            asset: customAsset,
            limit: "1000",
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(accountKeypair);
      const response = await server.submitTransaction(transaction);
      console.log(`Trustline established for ${accountKeypair.publicKey()}.`);
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error(
        "Error establishing trustline:",
        error.response?.data || error
      );
    }
  };

  // Issue custom asset to the Distributor
  const issueAsset = async () => {
    try {
      const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());
      const transaction = new DiamSdk.TransactionBuilder(issuerAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.payment({
            destination: distributorKeypair.publicKey(),
            asset: customAsset,
            amount: "500",
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(issuerKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Asset issued to distributor.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error("Error issuing asset:", error.response?.data || error);
    }
  };

  // Create a sell offer for the custom asset
  const createSellOffer = async () => {
    try {
      const distributorAccount = await server.loadAccount(
        distributorKeypair.publicKey()
      );
      const transaction = new DiamSdk.TransactionBuilder(distributorAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.manageSellOffer({
            selling: customAsset,
            buying: DiamSdk.Asset.native(),
            amount: "100",
            price: "0.5",
            offerId: "0",
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(distributorKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Sell offer created.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error(
        "Error creating sell offer:",
        error.response?.data || error
      );
    }
  };

  // Create a buy offer for the custom asset
  const createBuyOffer = async () => {
    try {
      await fundAccount(buyerKeypair);
      await establishTrustline(buyerKeypair.secret()); // Establish trustline for buyer before buy offer

      const buyerAccount = await server.loadAccount(buyerKeypair.publicKey());
      const transaction = new DiamSdk.TransactionBuilder(buyerAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.manageBuyOffer({
            selling: DiamSdk.Asset.native(),
            buying: customAsset,
            buyAmount: "10",
            price: "0.5",
            offerId: "0",
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(buyerKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Buy offer created.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error("Error creating buy offer:", error.response?.data || error);
    }
  };

  // Liquidity Pool Deposit (placeholder, requires actual LiquidityPoolID)
  const liquidityPoolDeposit = async () => {
    try {
      const distributorAccount = await server.loadAccount(
        distributorKeypair.publicKey()
      );
      const transaction = new DiamSdk.TransactionBuilder(distributorAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.liquidityPoolDeposit({
            liquidityPoolId, // Use the actual liquidity pool ID
            maxAmountA: "50",
            maxAmountB: "100",
            minPrice: { numerator: 1, denominator: 2 },
            maxPrice: { numerator: 2, denominator: 1 },
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(distributorKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Liquidity deposited.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error(
        "Error during liquidity pool deposit:",
        error.response?.data || error
      );
    }
  };

  // Liquidity Pool Withdraw (placeholder, requires actual LiquidityPoolID)
  const liquidityPoolWithdraw = async () => {
    try {
      const distributorAccount = await server.loadAccount(
        distributorKeypair.publicKey()
      );
      const transaction = new DiamSdk.TransactionBuilder(distributorAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.liquidityPoolWithdraw({
            liquidityPoolId, // Use the actual liquidity pool ID
            amount: "10", // LP tokens to burn
            minAmountA: "10",
            minAmountB: "20",
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(distributorKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Liquidity withdrawn.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error(
        "Error during liquidity pool withdrawal:",
        error.response?.data || error
      );
    }
  };

  // Path Payment Strict Send
  const pathPaymentStrictSend = async () => {
    try {
      const buyerAccount = await server.loadAccount(buyerKeypair.publicKey());
      const transaction = new DiamSdk.TransactionBuilder(buyerAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.pathPaymentStrictSend({
            sendAsset: DiamSdk.Asset.native(),
            sendAmount: "10",
            destination: distributorKeypair.publicKey(),
            destAsset: customAsset,
            destMin: "5",
            path: [DiamSdk.Asset.native(), customAsset],
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(buyerKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Path Payment Strict Send executed.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error(
        "Error during path payment (strict send):",
        error.response?.data || error
      );
    }
  };

  // Path Payment Strict Receive
  const pathPaymentStrictReceive = async () => {
    try {
      const buyerAccount = await server.loadAccount(buyerKeypair.publicKey());
      const transaction = new DiamSdk.TransactionBuilder(buyerAccount, {
        fee: DiamSdk.BASE_FEE,
        networkPassphrase: DiamSdk.Networks.TESTNET,
      })
        .addOperation(
          DiamSdk.Operation.pathPaymentStrictReceive({
            sendAsset: DiamSdk.Asset.native(),
            sendMax: "15",
            destination: distributorKeypair.publicKey(),
            destAsset: customAsset,
            destAmount: "10",
            path: [DiamSdk.Asset.native(), customAsset],
          })
        )
        .setTimeout(100)
        .build();

      transaction.sign(buyerKeypair);
      const response = await server.submitTransaction(transaction);
      console.log("Path Payment Strict Receive executed.");
      console.log("Transaction Hash:", response.hash);
    } catch (error) {
      console.error(
        "Error during path payment (strict receive):",
        error.response?.data || error
      );
    }
  };

  // Execute the entire flow
  await fundAccount(issuerKeypair);
  await fundAccount(distributorKeypair);
  await establishTrustline(distributorKeypair.secret());
  await issueAsset();
  await createSellOffer();
  await createBuyOffer();
  await pathPaymentStrictSend();
  await pathPaymentStrictReceive();

  console.log("DEX flow executed successfully.");
})();

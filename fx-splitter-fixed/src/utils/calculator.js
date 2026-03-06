export function generateRandomRate(min, max) {
  return Math.random() * (max - min) + min
}

export function calculateTransactions(totalUSD, numTransactions, minRate, maxRate) {
  // Split the total USD amount evenly across transactions
  const usdPerTransaction = totalUSD / numTransactions

  const transactions = []
  let totalAUD = 0

  for (let i = 0; i < numTransactions; i++) {
    const rate = parseFloat(generateRandomRate(minRate, maxRate).toFixed(4))
    const usdAmount = parseFloat(usdPerTransaction.toFixed(2))
    const audAmount = usdAmount * rate

    transactions.push({
      usdAmount,
      rate,
      audAmount
    })

    totalAUD += audAmount
  }

  return {
    transactions,
    totalAUD: parseFloat(totalAUD.toFixed(2))
  }
}

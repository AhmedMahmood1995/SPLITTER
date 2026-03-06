import React, { useState, useEffect } from 'react'
import './App.css'

const DEFAULT_AUD_LIMIT = 999.99
const MIN_AUD = 10

function pickRandomAUD(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function calculateTransactions(totalUSD, totalAUD, minRate, maxRate, audLimit = DEFAULT_AUD_LIMIT) {
  // Calculate the actual rate from user input
  const actualRate = totalAUD / totalUSD

  const transactions = []
  let remainingAUD = totalAUD
  let txIndex = 1

  // Keep creating transactions until all AUD is distributed
  while (remainingAUD > 0.01) {
    let aud

    if (remainingAUD <= audLimit) {
      // Last transaction gets remaining AUD (which is under limit)
      aud = Math.round(remainingAUD * 100) / 100
    } else {
      // Random between MIN_AUD and audLimit
      aud = pickRandomAUD(MIN_AUD, audLimit)
      aud = Math.min(audLimit, aud)
      aud = Math.round(aud * 100) / 100
    }

    // Calculate USD from AUD using the actual rate
    const usd = Math.round(aud / actualRate)

    transactions.push({ index: txIndex, usdAmount: usd, audAmount: aud, rate: actualRate })
    txIndex++

    remainingAUD -= aud
  }

  // Recalculate actual rates from AUD / USD (so displayed rate is accurate)
  transactions.forEach((tx) => {
    if (tx.usdAmount > 0) {
      tx.rate = Math.round((tx.audAmount / tx.usdAmount) * 10000) / 10000
    }
  })

  // Calculate actual totals
  const actualTotalUSD = Math.round(
    transactions.reduce((acc, tx) => acc + tx.usdAmount, 0)
  )
  const actualTotalAUD = Math.round(
    transactions.reduce((acc, tx) => acc + tx.audAmount, 0) * 100
  ) / 100

  return {
    transactions,
    totalUSD: actualTotalUSD,
    totalAUD: actualTotalAUD,
    minRate,
    maxRate,
    numTransactions: transactions.length
  }
}

function generateCSV(result) {
  const lines = []

  // Header with metadata
  lines.push('FX Splitter — Transaction Export')
  lines.push(`Generated: ${new Date(result.timestamp).toLocaleString()}`)
  lines.push(`Rate Range: ${result.minRate} – ${result.maxRate}`)
  lines.push('')

  // Summary section
  lines.push('SUMMARY')
  lines.push(`Total USD,${result.totalUSD}`)
  lines.push(`Total AUD,${result.totalAUD}`)
  lines.push(`Transactions,${result.transactions.length}`)
  lines.push('')

  // Transactions header
  lines.push('TRANSACTIONS')
  lines.push('Transaction #,USD,Rate,AUD')

  // Transaction rows
  result.transactions.forEach((tx) => {
    lines.push(`${tx.index},${tx.usdAmount},${tx.rate.toFixed(4)},${tx.audAmount.toFixed(2)}`)
  })

  return lines.join('\n')
}

export default function App() {
  const [minRate, setMinRate] = useState(1.45)
  const [maxRate, setMaxRate] = useState(1.55)
  const [totalUSD, setTotalUSD] = useState(5900)
  const [totalAUD, setTotalAUDInput] = useState(8438)
  const [audLimit, setAudLimit] = useState(DEFAULT_AUD_LIMIT)
  const [audLimitInput, setAudLimitInput] = useState(String(DEFAULT_AUD_LIMIT))
  const [transactions, setTransactions] = useState([])
  const [calculatedTotalAUD, setCalculatedTotalAUD] = useState(0)
  const [calculatedTotalUSD, setCalculatedTotalUSD] = useState(0)
  const [numTransactions, setNumTransactions] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fxSplitterTransactions')
    if (saved) {
      const data = JSON.parse(saved)
      setTransactions(data.transactions || [])
      setCalculatedTotalAUD(data.totalAUD || 0)
      setCalculatedTotalUSD(data.totalUSD || 0)
      setNumTransactions(data.numTransactions || 0)
    }

    const savedAudLimit = localStorage.getItem('audLimit')
    if (savedAudLimit) {
      const limit = parseFloat(savedAudLimit)
      setAudLimit(limit)
      setAudLimitInput(String(limit))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('fxSplitterTransactions', JSON.stringify({
      transactions,
      totalAUD: calculatedTotalAUD,
      totalUSD: calculatedTotalUSD,
      numTransactions
    }))
  }, [transactions, calculatedTotalAUD, calculatedTotalUSD, numTransactions])

  const handleSaveAudLimit = () => {
    const limit = parseFloat(audLimitInput)

    if (isNaN(limit) || limit <= 0) {
      alert('Please enter a positive number')
      return
    }

    if (limit < 100) {
      alert('AUD limit should be at least $100 to allow meaningful transactions')
      return
    }

    if (limit > 10000) {
      alert('AUD limit should not exceed $10,000 per transaction')
      return
    }

    setAudLimit(limit)
    localStorage.setItem('audLimit', String(limit))
    setShowSettings(false)
    alert('AUD limit saved successfully')
  }

  const handleResetAudLimit = () => {
    setAudLimit(DEFAULT_AUD_LIMIT)
    setAudLimitInput(String(DEFAULT_AUD_LIMIT))
    localStorage.setItem('audLimit', String(DEFAULT_AUD_LIMIT))
    alert('AUD limit reset to default')
  }

  const handleCalculate = () => {
    if (minRate >= maxRate) {
      alert('Min Rate must be less than Max Rate')
      return
    }
    if (totalUSD <= 0 || totalAUD <= 0) {
      alert('Please enter valid USD and AUD amounts')
      return
    }

    const result = calculateTransactions(
      totalUSD,
      totalAUD,
      minRate,
      maxRate,
      audLimit
    )
    setTransactions(result.transactions)
    setCalculatedTotalAUD(result.totalAUD)
    setCalculatedTotalUSD(result.totalUSD)
    setNumTransactions(result.numTransactions)
  }

  const handleRegenerateRates = () => {
    if (transactions.length === 0) {
      alert('Please calculate transactions first')
      return
    }

    // Recalculate with same logic - each transaction's rate is AUD/USD
    const updatedTransactions = transactions.map(txn => ({
      ...txn,
      rate: Math.round((txn.audAmount / txn.usdAmount) * 10000) / 10000
    }))

    setTransactions(updatedTransactions)
  }

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export')
      return
    }

    const result = {
      transactions,
      totalUSD: calculatedTotalUSD,
      totalAUD: calculatedTotalAUD,
      minRate,
      maxRate,
      timestamp: Date.now()
    }

    const csv = generateCSV(result)
    const filename = `fx-splitter-${new Date().toISOString().split('T')[0]}.csv`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setTransactions([])
    setCalculatedTotalAUD(0)
    setCalculatedTotalUSD(0)
    setMinRate(1.45)
    setMaxRate(1.55)
    setTotalUSD(5900)
    setTotalAUDInput(8438)
    setNumTransactions(0)
  }

  const hasResults = transactions.length > 0

  return (
    <div className="app-container-mobile">
      <div className="app-header">
        <div className="header-logo">%</div>
        <div className="header-content">
          <h1 className="header-title">FX Splitter</h1>
          <p className="header-subtitle">Random AUD & rate per transaction</p>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h2 className="settings-title">Settings</h2>
          <div className="settings-section">
            <h3 className="settings-label">Per-Transaction AUD Limit</h3>
            <p className="settings-description">
              Set the maximum AUD amount for each transaction. The calculator will split your total into transactions under this limit.
            </p>

            <div className="settings-input-group">
              <label>Amount (A$)</label>
              <div className="settings-input-wrapper">
                <span className="settings-currency">A$</span>
                <input
                  type="number"
                  step="0.01"
                  value={audLimitInput}
                  onChange={(e) => setAudLimitInput(e.target.value)}
                  placeholder="999.99"
                />
              </div>
            </div>

            <div className="settings-current-value">
              <span className="settings-current-label">Current Limit</span>
              <span className="settings-current-amount">A${audLimit.toFixed(2)}</span>
            </div>

            <div className="settings-buttons">
              <button className="btn btn-primary" onClick={handleSaveAudLimit}>
                Save Limit
              </button>
              <button className="btn btn-secondary" onClick={handleResetAudLimit}>
                Reset to Default
              </button>
            </div>

            <div className="settings-info">
              <p className="settings-info-title">ℹ️ Recommended Limits</p>
              <ul className="settings-info-list">
                <li>Minimum: $100 (to ensure meaningful transactions)</li>
                <li>Default: $999.99 (standard for most use cases)</li>
                <li>Maximum: $10,000 (to avoid excessive per-transaction amounts)</li>
              </ul>
            </div>

            <button className="close-settings-btn" onClick={() => setShowSettings(false)}>
              Close Settings
            </button>
          </div>
        </div>
      )}

      <div className="calculator-container">
        <div className="calc-section">
          <h3 className="calc-section-title">EXCHANGE RATE RANGE</h3>
          <div className="rate-inputs">
            <div className="rate-input-group">
              <label>Min Rate</label>
              <div className="input-wrapper">
                <span className="currency-prefix">1</span>
                <input
                  type="number"
                  step="0.0001"
                  value={minRate}
                  onChange={(e) => setMinRate(parseFloat(e.target.value))}
                  placeholder="1.4500"
                />
                <span className="currency-suffix">USD</span>
              </div>
            </div>
            <span className="rate-separator">—</span>
            <div className="rate-input-group">
              <label>Max Rate</label>
              <div className="input-wrapper">
                <span className="currency-prefix">1</span>
                <input
                  type="number"
                  step="0.0001"
                  value={maxRate}
                  onChange={(e) => setMaxRate(parseFloat(e.target.value))}
                  placeholder="1.5500"
                />
                <span className="currency-suffix">USD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="calc-section">
          <h3 className="calc-section-title">TOTAL AMOUNTS</h3>
          
          <div className="amount-group">
            <label>Total USD</label>
            <div className="amount-input-wrapper">
              <span className="amount-symbol">$</span>
              <input
                type="number"
                step="0.01"
                value={totalUSD}
                onChange={(e) => setTotalUSD(parseFloat(e.target.value))}
                placeholder="5900.00"
              />
              <span className="amount-currency">USD</span>
            </div>
          </div>

          <div className="amount-group">
            <label>Total AUD</label>
            <div className="amount-input-wrapper">
              <span className="amount-symbol">A$</span>
              <input
                type="number"
                step="0.01"
                value={totalAUD}
                onChange={(e) => setTotalAUDInput(parseFloat(e.target.value))}
                placeholder="8438.00"
              />
              <span className="amount-currency">AUD</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary btn-large" onClick={handleCalculate}>
            Calculate Transactions
          </button>
          <button className="btn btn-secondary btn-large" onClick={handleReset}>
            Clear
          </button>
        </div>
      </div>

      <div className="results-panel-mobile">
        {hasResults && (
          <>
            <h2 className="results-title">Transaction Results</h2>

            <div className="results-actions-mobile">
              <button className="btn btn-primary" onClick={handleRegenerateRates}>
                Regenerate Rates
              </button>
              <button className="btn btn-primary" onClick={handleExportCSV}>
                Export CSV
              </button>
            </div>

            <div className="transactions-list">
              {transactions.map((txn, idx) => (
                <div key={idx} className="transaction-card">
                  <div className="transaction-header">
                    <span className="transaction-number">Transaction {txn.index}</span>
                    <span className="transaction-rate">(Rate: {txn.rate.toFixed(4)})</span>
                  </div>
                  <div className="transaction-amounts">
                    <div className="amount-row">
                      <span className="amount-label">USD:</span>
                      <span className="amount-value">${txn.usdAmount.toFixed(2)}</span>
                    </div>
                    <div className="amount-row">
                      <span className="amount-label">AUD:</span>
                      <span className="amount-value">A${txn.audAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-aud-footer">
              <div className="total-row">
                <span className="total-label">TOTAL USD AMOUNT:</span>
                <span className="total-amount">${calculatedTotalUSD.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">TOTAL AUD AMOUNT:</span>
                <span className="total-amount">A${calculatedTotalAUD.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {!hasResults && (
          <div className="empty-state-mobile">
            <p>Enter your exchange rates and amounts above, then click "Calculate Transactions" to see results here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

import React from 'react'

export default function Calculator({
  minRate,
  maxRate,
  totalUSD,
  totalAUD,
  numTransactions,
  onMinRateChange,
  onMaxRateChange,
  onTotalUSDChange,
  onTotalAUDChange,
  onNumTransactionsChange,
  onCalculate,
  onReset
}) {
  return (
    <div className="calculator-container">
      {/* Exchange Rate Range Section */}
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
                onChange={(e) => onMinRateChange(parseFloat(e.target.value))}
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
                onChange={(e) => onMaxRateChange(parseFloat(e.target.value))}
                placeholder="1.5500"
              />
              <span className="currency-suffix">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Amounts Section */}
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
              onChange={(e) => onTotalUSDChange(parseFloat(e.target.value))}
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
              onChange={(e) => onTotalAUDChange(parseFloat(e.target.value))}
              placeholder="8438.00"
            />
            <span className="amount-currency">AUD</span>
          </div>
        </div>

        <div className="amount-group">
          <label>Number of Transactions</label>
          <div className="amount-input-wrapper">
            <input
              type="number"
              step="1"
              min="1"
              value={numTransactions}
              onChange={(e) => onNumTransactionsChange(parseInt(e.target.value))}
              placeholder="10"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <button className="btn btn-primary btn-large" onClick={onCalculate}>
          Calculate Transactions
        </button>
        <button className="btn btn-secondary btn-large" onClick={onReset}>
          Clear
        </button>
      </div>
    </div>
  )
}

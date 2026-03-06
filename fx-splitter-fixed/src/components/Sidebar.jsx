import React from 'react'

export default function Sidebar({
  minRate,
  maxRate,
  totalUSD,
  numTransactions,
  onMinRateChange,
  onMaxRateChange,
  onTotalUSDChange,
  onNumTransactionsChange,
  onCalculate,
  onReset
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">%</div>
        <div className="sidebar-title">FX Splitter</div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Exchange Rate Range</div>
        <div className="form-group">
          <label>Min Rate (USD to AUD)</label>
          <input
            type="number"
            step="0.0001"
            value={minRate}
            onChange={(e) => onMinRateChange(parseFloat(e.target.value))}
            placeholder="e.g., 1.4500"
          />
        </div>
        <div className="form-group">
          <label>Max Rate (USD to AUD)</label>
          <input
            type="number"
            step="0.0001"
            value={maxRate}
            onChange={(e) => onMaxRateChange(parseFloat(e.target.value))}
            placeholder="e.g., 1.5500"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Total Amounts</div>
        <div className="form-group">
          <label>Total USD Amount</label>
          <input
            type="number"
            step="0.01"
            value={totalUSD}
            onChange={(e) => onTotalUSDChange(parseFloat(e.target.value))}
            placeholder="e.g., 100000.00"
          />
        </div>
        <div className="form-group">
          <label>Number of Transactions</label>
          <input
            type="number"
            step="1"
            min="1"
            value={numTransactions}
            onChange={(e) => onNumTransactionsChange(parseInt(e.target.value))}
            placeholder="e.g., 10"
          />
        </div>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={onCalculate}>
          📊 Calculate Split
        </button>
        <button className="btn btn-secondary" onClick={onReset}>
          Reset Form
        </button>
      </div>
    </div>
  )
}

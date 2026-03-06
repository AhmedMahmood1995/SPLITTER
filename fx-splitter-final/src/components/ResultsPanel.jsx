import React from 'react'

export default function ResultsPanel({
  transactions,
  totalUSD,
  totalAUD,
  minRate,
  maxRate,
  onRegenerateRates,
  onExportCSV
}) {
  const hasResults = transactions.length > 0

  return (
    <div className="results-panel-mobile">
      {hasResults && (
        <>
          <h2 className="results-title">Transaction Results</h2>

          <div className="results-actions-mobile">
            <button className="btn btn-primary" onClick={onRegenerateRates}>
              Regenerate Rates
            </button>
            <button className="btn btn-primary" onClick={onExportCSV}>
              Export CSV
            </button>
          </div>

          <div className="transactions-list">
            {transactions.map((txn, idx) => (
              <div key={idx} className="transaction-card">
                <div className="transaction-header">
                  <span className="transaction-number">Transaction {idx + 1}</span>
                  <span className="transaction-rate">(Rate: {txn.rate.toFixed(4)})</span>
                </div>
                <div className="transaction-amounts">
                  <div className="amount-row">
                    <span className="amount-label">USD:</span>
                    <span className="amount-value">${txn.usdAmount.toFixed(2)}</span>
                  </div>
                  <div className="amount-row">
                    <span className="amount-label">AUD:</span>
                    <span className="amount-value">A${(txn.usdAmount * txn.rate).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-aud-footer">
            <span className="total-label">TOTAL AUD AMOUNT:</span>
            <span className="total-amount">A${totalAUD.toFixed(2)}</span>
          </div>
        </>
      )}

      {!hasResults && (
        <div className="empty-state-mobile">
          <p>Enter your exchange rates and amounts above, then click "Calculate Transactions" to see results here.</p>
        </div>
      )}
    </div>
  )
}

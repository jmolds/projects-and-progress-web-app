// components/FeaturedTable.js

import React from 'react';

const FeaturedTable = ({ signalData, signalLabel, color }) => {
  if (!signalData) {
    return <div>Loading...</div>;
  }

  const { signal, baseline, enhanced } = signalData.featuredTable || {};
  const forecastWeeksN = signalData.featuredTable["Forecast Weeks N"];
  const lastWeekStartDate = signalData.featuredTable["Last Week Date"];
  const currentWeekStartDate = signalData.featuredTable["Current Week Date"];

  const trunTwoDec = (num) =>
    num !== null && num !== undefined ? num.toFixed(2) : "N/A";
  const formatPercentage = (num) =>
    num !== null && num !== undefined ? `${(num * 100).toFixed(2)}%` : "N/A";

  // Function to render a row for the table
  const renderRow = (label, data, opacity) => (
    <tr>
      <td>
        <svg width="10" height="10">
          <circle cx="5" cy="5" r="5" fill="white" opacity={opacity} />
        </svg>
        {label}
      </td>
      <td>{data ? `RMSE: ${trunTwoDec(data["rmse"])}` : ""}</td>
      <td>{data ? trunTwoDec(data["Running Mean"]) : ""}</td>
      <td>
        {data
          ? formatPercentage(data["% diff [Running Mean vs 3-week Rolling Mean]"])
          : ""}
      </td>
      <td>{data ? trunTwoDec(data["3-Week Rolling Mean"]) : ""}</td>
      <td>
        {data
          ? formatPercentage(data["% diff [3-week Rolling Mean vs t-1]"])
          : ""}
      </td>
      <td>{data ? trunTwoDec(data["Last Week t-1"]) : ""}</td>
      <td>{data ? trunTwoDec(data["Current Week"]) : ""}</td>
    </tr>
  );

  return (
    <div>
      <table className="dashboard-stats-table">
        <thead>
          <tr>
            <th></th>
            <th>Forecast Weeks N={forecastWeeksN}</th>
            <th>Running Avg</th>
            <th>% Diff</th>
            <th>3-Week Avg</th>
            <th>% Diff</th>
            <th>{lastWeekStartDate} Last Week</th>
            <th>{currentWeekStartDate} Current Week</th>
          </tr>
        </thead>
        <tbody>
          {/* Signal Row */}
          <tr>
            <td>
              <svg width="10" height="10">
                <circle cx="5" cy="5" r="5" fill={color} />
              </svg>
              {signalLabel || "Signal"}
            </td>
            <td>SD: {trunTwoDec(signal["sd"])}</td>
            <td>{trunTwoDec(signal["Running Mean"])}</td>
            <td>
              {formatPercentage(
                signal["% diff [Running Mean vs 3-week Rolling Mean]"]
              )}
            </td>
            <td>{trunTwoDec(signal["3-Week Rolling Mean"])}</td>
            <td>
              {formatPercentage(
                signal["% diff [3-week Rolling Mean vs t-1]"]
              )}
            </td>
            <td>{trunTwoDec(signal["Last Week t-1"])}</td>
            <td>{trunTwoDec(signal["Current Week"])}</td>
          </tr>

          {/* Baseline Forecasts Row */}
          {renderRow("Baseline Forecasts", baseline, 0.5)}

          {/* Enhanced Forecasts Row */}
          {renderRow("Enhanced Forecasts", enhanced, 0.8)}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturedTable;

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { useDashboard } from '../context/DashboardContext';
import type { MetricType } from '../types';

const LineChart = () => {
  const { groupedData, filters } = useDashboard();

  const chartData = useMemo(() => {
    const metricsToShow: MetricType[] = filters.metrics.length > 0 
      ? filters.metrics 
      : ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'];

    const metricLabels: Record<MetricType, string> = {
      mySpend: 'My Spend',
      sameStoreSpend: 'Same Store Spend',
      newStoreSpend: 'New Store Spend',
      lostStoreSpend: 'Lost Store Spend'
    };

    return metricsToShow.map(metric => ({
      id: metricLabels[metric],
      data: Object.entries(groupedData).map(([group, metrics]) => ({
        x: group,
        y: metrics[metric]?.current || 0
      }))
    }));
  }, [groupedData, filters]);

  return (
    <Box sx={{ width: '100%', height: 450, overflow: 'visible', position: 'relative' }}>
      {chartData.length && chartData[0].data.length ? (
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear', stacked: false }}
          axisBottom={{
            tickRotation: 0,
            tickPadding: 8,
            legend: 'Group',
            legendOffset: 35,
            legendPosition: 'middle',
            format: (value: string) => value.split(' - ')[0]
          }}
          axisLeft={{
            tickPadding: 5,
            legend: 'Amount',
            legendOffset: -50,
            legendPosition: 'middle',
            format: value =>
              new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(Number(value))
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          useMesh={true}
          tooltip={({ point }) => (
            <div
              style={{
                padding: '6px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                color: '#000'
              }}
            >
              <div><strong style={{ color: '#000' }}>{point.serieId}</strong></div>
              <div><strong style={{ color: '#000' }}>Amount:</strong> {point.data.yFormatted}</div>
              <div><strong style={{ color: '#000' }}>Group:</strong> {point.data.xFormatted}</div>
            </div>
          )}

          theme={{
            axis: {
              ticks: {
                text: {
                  fontWeight: 700,
                  fill: '#000'
                }
              },
              legend: {
                text: {
                  fontWeight: 700,
                  fill: '#000'
                }
              }
            }
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 63,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 12,
              itemsSpacing: 20
            }
          ]}
        />
      ) : (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for chart
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LineChart;

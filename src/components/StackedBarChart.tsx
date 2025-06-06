import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useDashboard } from '../context/DashboardContext';
import type { MetricType } from '../types';

interface ChartDataItem {
  group: string;
  [metricLabel: string]: string | number;
}

const StackedBarChart = () => {
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

    return Object.entries(groupedData).map(([group, metrics]) => {
      const total = metricsToShow.reduce(
        (sum, metric) => sum + (metrics[metric]?.current ?? 0),
        0
      );

      const data: ChartDataItem = { group };
      metricsToShow.forEach(metric => {
        const label = metricLabels[metric];
        data[label] = total > 0 ? +(((metrics[metric]?.current ?? 0) / total) * 100).toFixed(1) : 0;
      });

      return data;
    });
  }, [groupedData, filters]);

  const chartKeys = useMemo(() => {
    const metricsToShow: MetricType[] = filters.metrics.length > 0
      ? filters.metrics
      : ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'];

    const metricLabels: Record<MetricType, string> = {
      mySpend: 'My Spend',
      sameStoreSpend: 'Same Store Spend',
      newStoreSpend: 'New Store Spend',
      lostStoreSpend: 'Lost Store Spend'
    };

    return metricsToShow.map(metric => metricLabels[metric]);
  }, [filters]);

  const barColors: Record<string, string> = {
    'My Spend': '#70c1b3',
    'Same Store Spend': '#247ba0',
    'New Store Spend': '#ffb347',
    'Lost Store Spend': '#ff5c5c'
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {chartData.length > 0 ? (
        <Box sx={{ height: 500, width: '100%' }}>
          <ResponsiveBar
            data={chartData}
            keys={chartKeys}
            indexBy="group"
            margin={{ top: 20, right: 20, bottom: 80, left: 60 }}
            padding={0.4}
            groupMode="stacked"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ id }) => barColors[id as string] || '#ccc'}
            borderRadius={2}
            borderWidth={1}
            borderColor="#fff"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Group',
              legendPosition: 'middle',
              legendOffset: 45 
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: v => `${v}%`,
              legend: 'Share (%)',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            enableLabel={true}
            labelSkipWidth={10}
            labelSkipHeight={10}
            labelTextColor="#fff"
            label={(bar) => `${(bar.value ?? 0).toFixed(1)}%`}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateY: 80, 
                itemsSpacing: 20,
                itemWidth: 120,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 16,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            theme={{
              background: '#ffffff',
              axis: {
                ticks: {
                  text: { fontSize: 12, fill: '#555' }
                },
                legend: {
                  text: { fontSize: 13, fontWeight: 600, fill: '#333' }
                }
              },
              labels: {
                text: { fontSize: 11, fontWeight: 600 }
              },
              tooltip: {
                container: {
                  background: '#fff',
                  color: '#333',
                  fontSize: 13,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: '6px 10px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }
              }
            }}

            role="application"
            ariaLabel="Percentage stacked bar chart"
            barAriaLabel={e => `${e.id}: ${e.formattedValue}% in group: ${e.indexValue}`}
          />
        </Box>
      ) : (
        <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for chart
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default StackedBarChart;

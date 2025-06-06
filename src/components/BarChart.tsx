import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useDashboard } from '../context/DashboardContext';
import type { MetricType } from '../types';

interface ChartDataItem {
  group: string;
  [metricLabel: string]: string | number;
}

const BarChart = () => {
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
      const data: ChartDataItem = { group };

      metricsToShow.forEach((metric) => {
        if (metrics[metric]) {
          data[metricLabels[metric]] = metrics[metric].current;
        }
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

  return (
    <Box sx={{ height: 500 }}>
      {chartData.length > 0 ? (
        <Box sx={{ height: 450, bgcolor: '#f9fafb', borderRadius: 2, p: 2 }}>
          <ResponsiveBar
            data={chartData}
            keys={chartKeys}
            indexBy="group"
            margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
            padding={0.35}
            innerPadding={6}
            groupMode="grouped"
            colors={{ scheme: 'set2' }}
            borderRadius={4}
            enableLabel={false}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
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
              tickSize: 6,
              tickPadding: 8,
              tickRotation: 0,
              legend: 'Amount',
              legendPosition: 'middle',
              legendOffset: -55,
              format: value =>
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(Number(value))
            }}
            gridYValues={5}
            // gridX={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            theme={{
              axis: {
                ticks: {
                  line: {
                    stroke: '#ccc',
                    strokeWidth: 1
                  },
                  text: {
                    fontSize: 12,
                    fill: '#555'
                  }
                },
                legend: {
                  text: {
                    fontSize: 14,
                    fill: '#333'
                  }
                }
              },
              legends: {
                text: {
                  fontSize: 12,
                  fill: '#444'
                }
              },
              tooltip: {
                container: {
                  fontSize: '13px'
                }
              }
            }}
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
            motionConfig="gentle"
            role="application"
            ariaLabel="Spend by group bar chart"
            barAriaLabel={e => `${e.id}: ${e.formattedValue} in group: ${e.indexValue}`}
          />
        </Box>
      ) : (
        <Box sx={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No data available for chart
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BarChart;

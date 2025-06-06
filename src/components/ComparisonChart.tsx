import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { useDashboard } from '../context/DashboardContext';
import type { MetricType } from '../types';
import type { BarDatum } from '@nivo/bar';

interface ChartDataItem extends BarDatum {
  group: string;
  [key: string]: number | string;
}

const ComparisonChart = () => {
  const { groupedData, filters } = useDashboard();

  const metricLabels: Record<MetricType, string> = {
    mySpend: 'My Spend',
    sameStoreSpend: 'Same Store Spend',
    newStoreSpend: 'New Store Spend',
    lostStoreSpend: 'Lost Store Spend',
  };

  const metricsToShow: MetricType[] = filters.metrics.length > 0
    ? filters.metrics
    : ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'];

  const chartKeys = useMemo(() => {
    return metricsToShow.map(metric => `${metricLabels[metric]} %`);
  }, [filters]);

  const chartData: ChartDataItem[] = useMemo(() => {
    return Object.entries(groupedData).map(([group, metrics]) => {
      const data: ChartDataItem = { group };
      metricsToShow.forEach(metric => {
        if (metrics[metric]) {
          data[`${metricLabels[metric]} %`] = Math.round(metrics[metric].percentChange);
        }
      });
      return data;
    });
  }, [groupedData, filters]);

  const [minY, maxY] = useMemo(() => {
    let min = 0;
    let max = 0;

    chartData.forEach(item => {
      let positive = 0;
      let negative = 0;

      chartKeys.forEach(key => {
        const value = typeof item[key] === 'number' ? (item[key] as number) : 0;
        if (value >= 0) positive += value;
        else negative += value;
      });

      if (positive > max) max = positive;
      if (negative < min) min = negative;
    });

    return [
      Math.floor(min / 10) * 10,
      Math.ceil(max / 10) * 10,
    ];
  }, [chartData, chartKeys]);

  return (
    <Box sx={{ width: '100%', height: 450, overflow: 'visible', position: 'relative' }}>
      {chartData.length > 0 ? (
        <ResponsiveBar
          data={chartData}
          keys={chartKeys}
          indexBy="group"
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          padding={0.25}
          groupMode="stacked"
          valueScale={{ type: 'linear', min: minY, max: maxY }}
          colors={({ id }) => {
            const colorPalette = [
              '#4C5B61',
              '#6C7A89',
              '#95A5A6',
              '#BDC3C7',
              '#7F8C8D',
              '#34495E',
            ];
            const index = chartKeys.findIndex(key => key === id);
            return colorPalette[index % colorPalette.length];
          }}
          axisBottom={{
            tickRotation: 0,
            tickPadding: 8,
            legend: 'Reference',
            legendOffset: 35,
            legendPosition: 'middle',
            format: (value: string) => value.split(' - ')[0],
          }}
          axisLeft={{
            tickPadding: 5,
            legend: 'Percentage Change',
            legendOffset: -50,
            legendPosition: 'middle',
            tickValues: [minY, minY / 2, 0, maxY / 2, maxY],
            format: value => `${value}%`,
          }}
          labelSkipWidth={16}
          labelSkipHeight={16}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
          tooltip={({ id, value, indexValue }) => (
            <div
              style={{
                padding: '6px 12px',
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                color: '#000',
              }}
            >
              <div>
                <strong style={{ color: '#000' }}>{id}:</strong> {value}%
              </div>
              <div>
                <strong style={{ color: '#000' }}>Group:</strong> {indexValue}
              </div>
            </div>
          )}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#000',
                  fontWeight: 700,
                },
              },
              legend: {
                text: {
                  fill: '#000',
                  fontWeight: 700,
                },
              },
            },
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom',
              direction: 'row',
              translateY: 63,
              itemWidth: 100,
              itemHeight: 20,
              symbolSize: 14,
              itemsSpacing: 30,
            },
          ]}
          role="application"
          ariaLabel="Percentage Change Chart"
          barAriaLabel={e =>
            `${e.id}: ${e.formattedValue}% in group ${e.indexValue}`
          }
        />
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No data available for chart
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ComparisonChart;

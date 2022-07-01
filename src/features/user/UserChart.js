import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';
import { useCallback, useEffect, useState } from 'react';

import './UserChart.scss';

function getPopulationPercentage(users, population) {
  return population / users.length; // The cart component will multiply this value by 100 for the %.
}

function getDataPieces(users) {
  const population = {};
  users?.forEach(user => {
    population[user.location.country] = population[user.location.country] || 0;
    ++population[user.location.country];
  });
  const sortedCountries = Object.keys(population).sort((a, b) => population[b] - population[a]);
  const sortedByPopulation = sortedCountries.map(label => ({ id: label, label, value: population[label] }));
  let [a, b, c, d, e, ...other] = sortedByPopulation;
  other = other.length > 0 ? { id: 'Other', label: 'Other', value: other.reduce((sum, curr) => sum + curr.value, 0) } : undefined;
  return [a, b, c, d, e, other].filter(d => d !== undefined);
}

function UserChart({ users }) {
  const [data, setData] = useState([]);

  const setUpData = useCallback(() => {
    if (!users || users.length === 0) return;

    const _data = getDataPieces(users);
    setData(_data.map(d => {
      const label = d.label === 'Other' ? 'Other' : d.label;
      return { id: label, label, value: getPopulationPercentage(users, d.value) };
    }));
  }, [users]);

  useEffect(() => {
    setUpData();
  }, [setUpData]);

  return (
    <div className='user-chart-container'>
      <h3 className='user-chart--label'>Where are they located?</h3>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        valueFormat=" >-.2%"
        activeOuterRadiusOffset={8}
        borderWidth={1}
        colors={{ scheme: 'set3' }}
        borderColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              0.2
            ]
          ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              2
            ]
          ]
        }}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={data.map(_d => ({
          match: { id: _d.id },
          id: _d.id,
        }))}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 5,
            itemWidth: 60,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'top-to-bottom',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </div>
  )
}

export default UserChart;

UserChart.propTypes = {
  users: PropTypes.array,
};

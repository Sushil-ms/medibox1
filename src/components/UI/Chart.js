import { ResponsiveLine } from '@nivo/line';
import React from 'react';

const Chart = ({ data }) => {
  console.log({ data });
  var ids = [];
  data.map((d) => ids.push(d.id));

  console.log(ids);
  //   order = {};
  //   data.sort(function (a, b) {
  //     return order[a.id] - order[b.id];
  // });
  var order = {};

  ids.forEach(function (a, i) {
    order[a] = i;
  });

  data.sort(function (a, b) {
    return order[a.id] - order[b.id];
  });
  data.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.date) - new Date(a.date);
  });
  console.log(data);
  return (
    <div style={{ height: 500, margin: '2rem' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 0, bottom: 60, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false,
        }}
        yFormat=' >-.2f'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Time',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Temprature',
          legendOffset: -30,
          legendPosition: 'middle',
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  );
};

export default Chart;

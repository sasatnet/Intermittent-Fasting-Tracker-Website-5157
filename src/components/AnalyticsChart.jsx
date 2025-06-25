import React from 'react';
import ReactECharts from 'echarts-for-react';

const AnalyticsChart = ({ data, type, title, height = '300px' }) => {
  const getChartOption = () => {
    const baseOption = {
      title: {
        text: title,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#374151'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#374151'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      }
    };

    switch (type) {
      case 'weight':
        return {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            formatter: function(params) {
              const point = params[0];
              return `اليوم ${point.data[0]}: ${point.data[1].toFixed(1)} كجم`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'الأيام',
            nameLocation: 'middle',
            nameGap: 30,
            min: 1,
            max: 20
          },
          yAxis: {
            type: 'value',
            name: 'الوزن (كجم)',
            nameLocation: 'middle',
            nameGap: 50
          },
          series: [
            {
              name: 'الوزن الفعلي',
              data: data.map(d => [d.day, d.weight]),
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                color: '#0ea5e9',
                width: 3
              },
              itemStyle: {
                color: '#0ea5e9'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(14,165,233,0.3)' },
                    { offset: 1, color: 'rgba(14,165,233,0.05)' }
                  ]
                }
              }
            },
            {
              name: 'الهدف',
              data: data.map(d => [d.day, d.target]),
              type: 'line',
              lineStyle: {
                color: '#22c55e',
                width: 2,
                type: 'dashed'
              },
              itemStyle: {
                color: '#22c55e'
              },
              symbol: 'none'
            }
          ]
        };

      case 'fasting':
        return {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            formatter: function(params) {
              const point = params[0];
              const completed = data[point.dataIndex].completed ? 'مكتمل' : 'غير مكتمل';
              return `اليوم ${point.data[0]}: ${point.data[1].toFixed(1)} ساعة (${completed})`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'الأيام',
            nameLocation: 'middle',
            nameGap: 30,
            min: 1,
            max: 20
          },
          yAxis: {
            type: 'value',
            name: 'ساعات الصيام',
            nameLocation: 'middle',
            nameGap: 50
          },
          series: [
            {
              name: 'الصيام الفعلي',
              data: data.map(d => [d.day, d.duration]),
              type: 'bar',
              itemStyle: {
                color: function(params) {
                  const completed = data[params.dataIndex].completed;
                  return completed ? '#22c55e' : '#ef4444';
                }
              },
              barWidth: '60%'
            },
            {
              name: 'الهدف المخطط',
              data: data.map(d => [d.day, d.planned]),
              type: 'line',
              lineStyle: {
                color: '#f59e0b',
                width: 2,
                type: 'dashed'
              },
              itemStyle: {
                color: '#f59e0b'
              },
              symbol: 'circle',
              symbolSize: 4
            }
          ]
        };

      case 'water':
        return {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            formatter: function(params) {
              const point = params[0];
              return `اليوم ${point.data[0]}: ${point.data[1]} أكواب`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'الأيام',
            nameLocation: 'middle',
            nameGap: 30,
            min: 1,
            max: 20
          },
          yAxis: {
            type: 'value',
            name: 'أكواب الماء',
            nameLocation: 'middle',
            nameGap: 50
          },
          series: [
            {
              name: 'شرب الماء',
              data: data.map(d => [d.day, d.intake]),
              type: 'bar',
              itemStyle: {
                color: function(params) {
                  const intake = data[params.dataIndex].intake;
                  const goal = data[params.dataIndex].goal;
                  return intake >= goal ? '#0ea5e9' : '#94a3b8';
                }
              },
              barWidth: '60%'
            },
            {
              name: 'الهدف اليومي',
              data: data.map(d => [d.day, d.goal]),
              type: 'line',
              lineStyle: {
                color: '#22c55e',
                width: 2,
                type: 'dashed'
              },
              itemStyle: {
                color: '#22c55e'
              },
              symbol: 'none'
            }
          ]
        };

      case 'mood':
        return {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            formatter: function(params) {
              const point = params[0];
              const moodLabels = ['سيء جداً', 'سيء', 'متوسط', 'جيد', 'ممتاز'];
              return `اليوم ${point.data[0]}: ${moodLabels[Math.round(point.data[1]) - 1]}`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'الأيام',
            nameLocation: 'middle',
            nameGap: 30,
            min: 1,
            max: 20
          },
          yAxis: {
            type: 'value',
            name: 'المزاج',
            nameLocation: 'middle',
            nameGap: 50,
            min: 1,
            max: 5,
            axisLabel: {
              formatter: function(value) {
                const labels = ['سيء', 'متوسط', 'جيد', 'ممتاز'];
                return labels[value - 1] || '';
              }
            }
          },
          series: [
            {
              name: 'المزاج',
              data: data.map(d => [d.day, d.mood]),
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              lineStyle: {
                color: '#8b5cf6',
                width: 3
              },
              itemStyle: {
                color: '#8b5cf6'
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(139,92,246,0.3)' },
                    { offset: 1, color: 'rgba(139,92,246,0.05)' }
                  ]
                }
              }
            }
          ]
        };

      case 'weeklySuccess':
        return {
          ...baseOption,
          tooltip: {
            ...baseOption.tooltip,
            formatter: function(params) {
              const point = params[0];
              const weekData = data[params.dataIndex];
              return `الأسبوع ${point.data[0]}: ${point.data[1].toFixed(0)}%<br/>
                      (${weekData.completed}/${weekData.total} أيام)`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'الأسبوع',
            nameLocation: 'middle',
            nameGap: 30,
            min: 1,
            max: Math.ceil(20 / 7)
          },
          yAxis: {
            type: 'value',
            name: 'معدل النجاح (%)',
            nameLocation: 'middle',
            nameGap: 50,
            min: 0,
            max: 100
          },
          series: [
            {
              name: 'معدل النجاح',
              data: data.map(d => [d.week, d.success]),
              type: 'bar',
              itemStyle: {
                color: function(params) {
                  const success = params.data[1];
                  if (success >= 80) return '#22c55e';
                  if (success >= 60) return '#f59e0b';
                  return '#ef4444';
                }
              },
              barWidth: '60%'
            }
          ]
        };

      default:
        return baseOption;
    }
  };

  return (
    <ReactECharts
      option={getChartOption()}
      style={{ height }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default AnalyticsChart;
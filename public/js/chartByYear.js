document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signChart');
  if (!canvas) return;

  const stats = JSON.parse(canvas.getAttribute('data-stats') || '[]');
  const year = canvas.getAttribute('data-year') || 'N/A';
  const ctx = canvas.getContext('2d');

  try {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.map(item => `Tháng ${item.month}`),
        datasets: [{
          label: `Số lượng ký trong năm ${year}`,
          data: stats.map(item => item.count),
          backgroundColor: 'rgba(249, 115, 22, 0.6)',
          borderColor: 'rgba(249, 115, 22, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...stats.map(item => item.count)) * 1.1, // Add 10% padding above max value
            ticks: {
              stepSize: 20000, // Set tick interval to 20,000
              callback: function(value) {
                return Number(value).toLocaleString();
              }
            },
            title: { display: true, text: 'Số lượng ký' }
          },
          x: {
            title: { display: true, text: 'Tháng' }
          }
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: value => value.toLocaleString(),
            display: function(context) {
              return context.dataset.data[context.dataIndex] > 0;
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } catch (error) {
    console.error('Error rendering chart:', error);
    document.getElementById('chartError').classList.remove('hidden');
  }
});
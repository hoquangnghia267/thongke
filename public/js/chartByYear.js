document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signChart');
  if (!canvas) return;

  const stats = JSON.parse(canvas.getAttribute('data-stats') || '[]');
  const year = canvas.getAttribute('data-year') || 'N/A';
  const ctx = canvas.getContext('2d');

  // Đăng ký plugin ChartDataLabels
  Chart.register(ChartDataLabels);

  // Tìm 3 giá trị lớn nhất
  const sortedCounts = [...stats.map(item => item.count)].sort((a, b) => b - a);
  const top3Threshold = sortedCounts[2] || 0; // Giá trị nhỏ nhất trong top 3 (hoặc 0 nếu không đủ 3 giá trị)

  try {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.map(item => `Tháng ${item.month}`),
        datasets: [{
          label: `BIỂU ĐỒ THỐNG KÊ SỐ LƯỢNG KÝ TRONG NĂM ${year}`,
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
            title: { display: true, text: 'SỐ LƯỢNG KÝ' }
          },
          x: {
            title: { display: true, text: 'THÁNG' }
          }
        },
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: value => value.toLocaleString(),
            display: function(context) {
              // Chỉ hiển thị nhãn nếu giá trị nằm trong top 3
              return context.dataset.data[context.dataIndex] >= top3Threshold;
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
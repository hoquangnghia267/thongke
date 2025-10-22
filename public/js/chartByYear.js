document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signChart');
  if (!canvas) return;

  const stats = JSON.parse(canvas.getAttribute('data-stats') || '[]');
  const year = canvas.getAttribute('data-year') || 'N/A';
  const ctx = canvas.getContext('2d');

  // Đăng ký plugin ChartDataLabels
  if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels);

  try {
    const values = stats.map(item => item.count);

    // Tìm top 3
    const sortedCounts = [...values].sort((a, b) => b - a);
    const top3Threshold = sortedCounts[2] || 0;

    // Gradient màu cam
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.9)');
    gradient.addColorStop(1, 'rgba(249, 168, 37, 0.6)');

    // Đổi màu top 3
    const barColors = values.map(v =>
      v >= top3Threshold ? 'rgba(33, 150, 243, 0.85)' : gradient
    );

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats.map(item => `Tháng ${item.month}`),
        datasets: [{
          data: values,
          backgroundColor: barColors,
          borderColor: '#F97316',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 32,
          hoverBackgroundColor: 'rgba(33, 150, 243, 1)',
          hoverBorderColor: '#1E88E5',
          hoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...values) * 1.1,
            ticks: {
              callback: value => Number(value).toLocaleString(),
              font: { size: 13 }
            },
            title: { display: true, text: 'SỐ LƯỢNG KÝ', font: { size: 16, weight: 'bold' } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            title: { display: true, text: 'THÁNG', font: { size: 16, weight: 'bold' } },
            ticks: { font: { size: 13 } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `📊 THỐNG KÊ SỐ LƯỢNG KÝ TRONG NĂM ${year}`,
            font: { size: 20, weight: 'bold' },
            padding: { top: 10, bottom: 30 }
          },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: context => ` ${context.formattedValue}`
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: value => value.toLocaleString(),
            display: context => context.dataset.data[context.dataIndex] >= top3Threshold
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        },
        hover: {
          mode: 'nearest',
          animationDuration: 400
        },
        elements: {
          bar: {
            borderRadius: 6,
            hoverBorderColor: '#1E88E5',
            hoverBorderWidth: 2
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering chart:', error);
    document.getElementById('chartError')?.classList.remove('hidden');
  }
});

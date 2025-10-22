document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signChart');
  if (!canvas) return;

  if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels);

  try {
    const stats = JSON.parse(canvas.dataset.stats || '[]');
    const month = canvas.dataset.month || 'N/A';
    const year = canvas.dataset.year || 'N/A';

    if (!Array.isArray(stats) || stats.length === 0) {
      throw new Error('Dữ liệu thống kê không hợp lệ');
    }

    const days = stats.map(row => `${row.day}/${month}`);
    const counts = stats.map(row => Number(row.count) || 0);

    // Top 5
    const top5Values = counts.slice().sort((a, b) => b - a).slice(0, 5);

    // Gradient màu
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 112, 67, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 179, 71, 0.6)');

    // Màu đặc biệt cho top5
    const barColors = counts.map(v =>
      top5Values.includes(v) ? 'rgba(33, 150, 243, 0.85)' : gradient
    );

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          data: counts, // bỏ label để không hiện trong legend
          backgroundColor: barColors,
          borderColor: '#EF6C00',
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 24,
          hoverBackgroundColor: 'rgba(33, 150, 243, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Số lượng ký', font: { size: 16, weight: 'bold' } },
            ticks: { font: { size: 13 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: {
            title: { display: true, text: 'Ngày trong tháng', font: { size: 16, weight: 'bold' } },
            ticks: { font: { size: 13 } },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false }, // Ẩn legend luôn
          title: {
            display: true,
            text: `📊 THỐNG KÊ SỐ LƯỢNG KÝ - ${month}/${year}`,
            font: { size: 20, weight: 'bold' },
            padding: { top: 10, bottom: 50 }
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
            display: context => top5Values.includes(context.dataset.data[context.dataIndex]),
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: { weight: 'bold', size: 12 }
          }
        },
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khởi tạo biểu đồ:', error.message);
    document.getElementById('chartError')?.classList.remove('hidden');
  }
});

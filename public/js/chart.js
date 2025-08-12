document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signChart');
  if (!canvas) return;

  // Đăng ký plugin (nếu cần)
  if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels);

  try {
    const stats = JSON.parse(canvas.dataset.stats || '[]');
    console.log('Stats:', stats);
    const month = canvas.dataset.month || 'N/A';
    const year = canvas.dataset.year || 'N/A';

    if (!Array.isArray(stats) || stats.length === 0) {
      throw new Error('Dữ liệu thống kê không hợp lệ');
    }

    const days = stats.map(row => `${row.day}/${month}`);
    const counts = stats.map(row => Number(row.count) || 0);
    console.log('Counts:', counts);
    const top5Values = counts.slice().sort((a, b) => b - a).slice(0, 5);
    console.log('Top 5 values:', top5Values);

    new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Số lượng ký',
          data: counts,
          backgroundColor: 'rgba(255, 112, 67, 0.8)',
          borderColor: '#EF6C00',
          borderWidth: 1,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Số lượng ký', font: { size: 16, weight: 'bold' } }, ticks: { font: { size: 14 } } },
          x: { title: { display: true, text: 'Ngày trong tháng', font: { size: 16, weight: 'bold' } }, ticks: { font: { size: 14 } } }
        },
        plugins: {
          legend: { display: true, position: 'top', labels: { font: { size: 16, weight: 'bold' } } },
          title: { display: true, text: `Thống kê số lượng ký tháng ${month}/${year}`, font: { size: 18, weight: 'bold' } },
          datalabels: {
            display: context => top5Values.includes(context.dataset.data[context.dataIndex]),
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: { weight: 'bold', size: 12 },
            formatter: value => value
          }
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khởi tạo biểu đồ:', error.message);
    document.getElementById('chartError')?.classList.remove('hidden');
    new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['1', '2', '3'],
        datasets: [{ label: 'Dữ liệu mẫu', data: [0, 0, 0], backgroundColor: 'rgba(255, 112, 67, 0.8)', borderColor: '#EF6C00', borderWidth: 1, barThickness: 20 }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Số lượng ký', font: { size: 16, weight: 'bold' } } }, x: { title: { display: true, text: 'Ngày trong tháng', font: { size: 16, weight: 'bold' } } } },
        plugins: { legend: { display: true, position: 'top', labels: { font: { size: 16, weight: 'bold' } } }, title: { display: true, text: 'Biểu đồ mẫu (lỗi dữ liệu)', font: { size: 18, weight: 'bold' } } }
      }
    });
  }
});
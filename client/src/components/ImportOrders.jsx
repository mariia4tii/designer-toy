import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ImportOrders = () => {
  const [chartData, setChartData] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const designers = [...new Set(json.map(row => row.Designer))];
      const collections = [...new Set(json.map(row => row.Collection))];

      const designerSales = designers.map(designer => {
        return {
          designer,
          collections: collections.map(collection => {
            const sales = json.filter(row => row.Designer === designer && row.Collection === collection)
              .reduce((acc, row) => acc + parseFloat(row.Sales), 0);
            return { collection, sales };
          })
        };
      });

      setJsonData(json);

      const labels = collections;
      const datasets = designers.map((designer, idx) => {
        const data = collections.map(collection => {
          const designerData = designerSales.find(d => d.designer === designer);
          const collectionData = designerData.collections.find(c => c.collection === collection);
          return collectionData ? collectionData.sales : 0;
        });

        return {
          label: designer,
          data,
          backgroundColor: getColor(idx),
          borderRadius: 6
        };
      });

      setChartData({ labels, datasets });
    };

    reader.readAsArrayBuffer(file);
  };

  const getColor = (i) => {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#98AEFA', '#4BC0C0'];
    return colors[i % colors.length];
  };

  const handleExport = () => {
    if (!jsonData) return;
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');
    XLSX.writeFile(wb, 'sales_data.xlsx');
  };

  const loadFromApi = async () => {
    try {
      const res = await axios.get('http://localhost:5002/api/order-stats/designer');
      const data = res.data;
      console.log('Сырые данные от API:', data);
  
      const designers = [...new Set(data.map(d => d.designer_name))];
      const collections = [...new Set(data.map(d => d.collection_name))];
  

      console.log('Дизайнеры:', designers);
    console.log('Коллекции:', collections);
      const datasets = designers.map((designer, idx) => {
        const values = collections.map(collection => {
          const record = data.find(r => r.designer_name === designer && r.collection_name === collection);
          const value = record ? Number(record.total_quantity) : 0;
          return isNaN(value) ? 0 : value;
        });
        console.log(`Дизайнер: ${designer}, данные:`, values);
        return {
          label: designer,
          data: values,
          backgroundColor: getColor(idx),
          borderRadius: 6
        };
      });
  
      const chart = { labels: collections, datasets };
      console.log('ChartData:', chart);
      setChartData(chart);
    } catch (err) {
      console.error('Ошибка при загрузке данных с API', err);
    }
  };
  
  

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <h2>Загрузка Excel или получение данных с сервера</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <button onClick={loadFromApi} style={{ backgroundColor: '#36A2EB', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>
          Загрузить с сервера
        </button>
        <button onClick={handleExport} style={{ backgroundColor: '#FF734D', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>
          Экспортировать
        </button>
      </div>

      {chartData ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <Bar data={chartData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Диаграмма продаж по дизайнерам'
              },
              legend: { position: 'top' }
            }
          }} />
        </div>
      ): (
        <p>Загружаем данные...</p>
    )}
    </div>
  );
};

export default ImportOrders;

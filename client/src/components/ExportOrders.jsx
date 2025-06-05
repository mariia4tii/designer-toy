// import React from 'react';

// const ExportOrders = () => {
//     const handleExport = async () => {
//         try {
//             const response = await fetch('http://localhost:5002/export', {
//                 method: 'GET',
//             });

//             if (!response.ok) {
//                 throw new Error(`Ошибка сети: ${response.statusText}`);
//             }

//             const blob = await response.blob(); // Получаем данные в формате Blob

//             // Проверяем поддержку для создания ссылки на скачивание
//             if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//                 // Для Internet Explorer и Edge (старые версии)
//                 window.navigator.msSaveOrOpenBlob(blob, 'orders.csv');
//             } else {
//                 // Для остальных браузеров
//                 const url = window.URL.createObjectURL(blob);
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.setAttribute('download', 'orders.csv');
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove(); // Удаляем ссылку после скачивания
//                 window.URL.revokeObjectURL(url); // Очищаем память
//             }
//         } catch (error) {
//             console.error('Ошибка экспорта:', error);
//             alert('Ошибка экспорта данных!');
//         }
//     };

//     return (
//         <div>
//             <h2>Экспортировать заказы</h2>
//             <button onClick={handleExport}>Экспортировать</button>
//         </div>
//     );
// };

// export default ExportOrders;

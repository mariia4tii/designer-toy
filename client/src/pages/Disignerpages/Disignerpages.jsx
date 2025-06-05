import React, { useState } from 'react';
import axios from 'axios';
import { $authHost } from "../../http/index";

const DesignerUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Пожалуйста, выберите файл.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('designer_id', localStorage.getItem('id'));

        setIsLoading(true); // Показываем индикатор загрузки

        try {
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
              }
              
            await $authHost.post('/api/design/upload-design', formData);
            setMessage('Файл успешно загружен.');
        } catch (error) {
            console.error(error);
            setMessage('Ошибка при загрузке файла.');
        } finally {
            setIsLoading(false); // Прячем индикатор загрузки
        }
    };

    return (
        <div style={{ padding: '220px', minHeight: '100vh', backgroundColor: '#EFEAE0' }}>
            <h2 style={{ textAlign: 'center', color: '#181818', fontFamily: 'UnlimitedPie, sans-serif' }}>Загрузка дизайна</h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center',fontFamily: 'Neucha, cursive'}}>
                <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChange}
                    style={{
                        padding: '10px',
                        fontSize: '24px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        width: '250px'
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button 
                    onClick={handleUpload} 
                    style={{
                        backgroundColor: '#EFEAE0',
                        color: 'white',
                        padding: '12px 20px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'background-color 0.3s ease'
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Загружается...' : 'Загрузить'}
                </button>
            </div>

            {message && (
                <div style={{ textAlign: 'center', color: message.includes('успешно') ? 'green' : 'red', fontSize: '16px' }}>
                    {message}
                </div>
            )}

            {/* При необходимости добавить стили для текста */}
        </div>
    );
};

export default DesignerUpload;

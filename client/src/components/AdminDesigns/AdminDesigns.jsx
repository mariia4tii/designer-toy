import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDesigns.css';
import { $authHost } from "../../http/index";

const AdminDesigns = () => {
    const [designs, setDesigns] = useState([]);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await $authHost.get('/api/design/design-uploads');
                setDesigns(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке дизайнов:', error);
            }
        };
        fetchDesigns();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await $authHost.put(`/api/design/design-uploads/${id}`, { status });
            setDesigns((prev) =>
                prev.map((design) =>
                    design.id === id ? { ...design, status } : design
                )
            );
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    };

    return (
        <div className="admin-designs-container">
            <h2 className="title">Загруженные дизайны</h2>
            <div className="table-wrapper">
                <table className="designs-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Дизайнер</th>
                            <th>Файл</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {designs.map((design) => (
                            <tr key={design.id}>
                                <td>{design.id}</td>
                                <td>{design.designer_id}</td>
                                <td>
                                    <a
                                        href={`/${design.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {design.file_name}
                                    </a>
                                </td>
                                <td>
                                    <span
                                        className={`status-label ${
                                            design.status === 'approved'
                                                ? 'approved'
                                                : design.status === 'rejected'
                                                ? 'rejected'
                                                : 'pending'
                                        }`}
                                    >
                                        {design.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            handleStatusChange(design.id, 'approved')
                                        }
                                    >
                                        Одобрить
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() =>
                                            handleStatusChange(design.id, 'rejected')
                                        }
                                    >
                                        Отклонить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {designs.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    Нет загруженных дизайнов.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDesigns;

import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { createCollection } from '../../http/productApi';

const CreateCollection = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const addCollection = () => {
        // Отправляем запрос с названием коллекции
        createCollection({ name: value }).then(data => {
            setValue('');
        }).catch(err => {
            console.error("Ошибка при создании коллекции", err);
        });
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить новый тип
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите название типа"} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={addCollection}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCollection;

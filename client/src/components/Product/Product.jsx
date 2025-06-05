import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Для создания ссылок

const Product = ({ products = [], onProductClick }) => {
    return (
      <ListGroup>
        {products.map((product) => (
          <ListGroup.Item key={product.id}>
            <div>
              <h5>{product.name}</h5>
              <p>{product.description}</p>
              <Button variant="warning" as={Link} to={`/products/${product.id}/update`}>
                Редактировать
              </Button>
              <Button
                variant="danger"
                as={Link}
                to={`/products/${product.id}/delete`}
                onClick={() => onProductClick(product.id)}
              >
                Удалить
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };
  

export default Product;

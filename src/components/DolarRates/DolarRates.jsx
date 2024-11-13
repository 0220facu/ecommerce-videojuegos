import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin } from 'antd';
import axios from 'axios';
import './DolarRates.css';

const { Title, Text } = Typography;

const DolarRates = () => {
  const [dolarRates, setDolarRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDolarRates = async () => {
      try {
        const response = await axios.get('http://localhost:5217/api/DolarServicio/leer');
        setDolarRates(response.data);
      } catch (error) {
        console.error('Error al obtener las tasas de dólar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDolarRates();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '2rem auto' }} />;
  }

  return (
    <div className="dolar-rates-container">
      <Row gutter={[16, 16]}>
        {dolarRates.map((rate) => (
          <Col xs={24} sm={12} md={8} lg={6} key={rate.casa}>
            <Card title={rate.nombre} bordered={false} className="dolar-rate-card">
              <Text strong>Compra: </Text>
              <Text>{rate.compra}</Text>
              <br />
              <Text strong>Venta: </Text>
              <Text>{rate.venta}</Text>
              <br />
              <Text type="secondary">Actualizado: {new Date(rate.fechaActualizacion).toLocaleString()}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DolarRates;

import React, { useState } from 'react';
import { Upload, Button, Table, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import XMLParser from 'react-xml-parser';

const GenerarUsuariosDesdeXML = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const propsUpload = {
    beforeUpload: (file) => {
      if (file.type !== 'text/xml' && file.type !== 'application/xml') {
        message.error('Por favor, sube un archivo XML válido.');
        return Upload.LIST_IGNORE;
      }
      setArchivoSeleccionado(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const xml = new XMLParser().parseFromString(e.target.result);
          const usuariosXML = xml.getElementsByTagName('usuario');
          const usuariosData = usuariosXML.map((usuario) => {
            const nombreUsuario = usuario.getElementsByTagName('nombreUsuario')[0]?.value || '';
            const email = usuario.getElementsByTagName('email')[0]?.value || '';
            const password = usuario.getElementsByTagName('password')[0]?.value || '';
            return { nombreUsuario, email, password };
          });
          setUsuarios(usuariosData);
          message.success('Archivo XML cargado correctamente');
        } catch (error) {
          console.error('Error al analizar el XML:', error);
          message.error('Error al analizar el archivo XML');
        }
      };
      reader.readAsText(file);
      // Evitar que se suba el archivo automáticamente
      return false;
    },
    onRemove: () => {
      setUsuarios([]);
      setArchivoSeleccionado(null);
    },
    maxCount: 1,
  };

  const columnas = [
    {
      title: 'Nombre de Usuario',
      dataIndex: 'nombreUsuario',
      key: 'nombreUsuario',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contraseña',
      dataIndex: 'password',
      key: 'password',
    },
  ];

  const crearUsuarios = async () => {
    try {
      // Ajusta la URL del endpoint según tu backend
      const response = await fetch('http://localhost:5217/api/Usuario/crear-multiples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarios),
      });

      if (!response.ok) {
        throw new Error('Error al crear los usuarios');
      }

      message.success('Usuarios creados exitosamente');
      setUsuarios([]);
      setArchivoSeleccionado(null);
    } catch (error) {
      console.error('Error al crear los usuarios:', error);
      message.error('Error al crear los usuarios');
    }
  };

  return (
    <Card style={{ margin: '20px' }}>
      <h2>Generar Usuarios desde XML</h2>
      <Upload {...propsUpload} fileList={archivoSeleccionado ? [archivoSeleccionado] : []}>
        <Button icon={<UploadOutlined />}>Seleccionar Archivo XML</Button>
      </Upload>
      {usuarios.length > 0 && (
        <>
          <Table
            dataSource={usuarios}
            columns={columnas}
            rowKey={(record) => record.email}
            style={{ marginTop: '20px' }}
            pagination={false}
          />
          <Button type="primary" onClick={crearUsuarios} style={{ marginTop: '20px' }}>
            Crear Usuarios
          </Button>
        </>
      )}
    </Card>
  );
};

export default GenerarUsuariosDesdeXML;

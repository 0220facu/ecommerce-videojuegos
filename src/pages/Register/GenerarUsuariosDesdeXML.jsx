import React, { useState } from 'react';
import { Upload, Button, Table, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import XMLParser from 'react-xml-parser';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

const GenerarUsuariosDesdeXML = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const { register } = useAuth(); // Utiliza la función de registro del contexto de autenticación

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
            const email = usuario.getElementsByTagName('email')[0]?.value || '';
            const password = usuario.getElementsByTagName('password')[0]?.value || '';
            return { email, password };
          });
          setUsuarios(usuariosData);
          message.success('Archivo XML cargado correctamente');
        } catch (error) {
          console.error('Error al analizar el XML:', error);
          message.error('Error al analizar el archivo XML');
        }
      };
      reader.readAsText(file);
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
    for (const usuario of usuarios) {
      const { email, password } = usuario;
      try {
        await register(email, password); // Llama a la función `register` del contexto
        message.success(`Usuario ${email} registrado exitosamente`);
      } catch (error) {
        console.error(`Error al registrar ${email}:`, error);
        message.error(`Error al registrar ${email}: ${error.message}`);
      }
    }
    // Limpia la lista de usuarios y el archivo seleccionado después de completar el proceso
    setUsuarios([]);
    setArchivoSeleccionado(null);
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

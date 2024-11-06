import React, { useEffect, useState } from 'react';
import { Layout, Tree, Form, Input, Button, Select, Modal, message, Card, Row, Col, Space } from 'antd';
import NavMenu from '../../components/NavMenu/NavMenu';
import translationService from '../../services/translationService';
import './Permisos.css';

const { Option } = Select;
const { confirm } = Modal;
const { Content } = Layout;

const Permisos = () => {
  const [arbolPermisos, setArbolPermisos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [permisosSimples, setPermisosSimples] = useState([]);
  const [permisosUsuarioDirectos, setPermisosUsuarioDirectos] = useState([]);
  const [formCrearPermiso] = Form.useForm();
  const [formAsociarPermiso] = Form.useForm();
  const [formQuitarPermiso] = Form.useForm();
  const [language, setLanguage] = useState(translationService.getLanguage());
  const [formAsociarPermisos] = Form.useForm(); // Formulario nuevo para asociar permisos
  const [formQuitarPermisos] = Form.useForm(); // Formulario nuevo para desasociar permisos

  useEffect(() => {
    cargarPermisos();
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const observer = {
      update: (newLanguage) => {
        setLanguage(newLanguage);
      },
    };
    translationService.subscribe(observer);
    return () => {
      translationService.unsubscribe(observer);
    };
  }, []);

  const cargarPermisos = async () => {
    try {
      // Obtener permisos compuestos con sus hijos
      const responsePermisosCompuestos = await fetch(
        'http://localhost:5217/api/Permiso/leer-permisos-compuestos'
      );
      if (!responsePermisosCompuestos.ok) {
        throw new Error('Error al obtener permisos compuestos');
      }
      const permisosCompuestosData = await responsePermisosCompuestos.json();

      // Transformar los permisos al formato del Tree
      const arbol = transformarPermisosAArbol(permisosCompuestosData);
      setArbolPermisos(arbol);

      // Obtener todos los permisos simples para las listas desplegables
      const responsePermisosSimples = await fetch(
        'http://localhost:5217/api/Permiso/leer-permisos-compuestos-simples'
      );
      if (!responsePermisosSimples.ok) {
        throw new Error('Error al obtener permisos simples');
      }
      const permisosSimplesData = await responsePermisosSimples.json();
      setPermisosSimples(permisosSimplesData);
    } catch (error) {
      console.error('Error al cargar permisos:', error);
    }
  };

  const transformarPermisosAArbol = (permisos) => {
    return permisos.map((permiso) => {
      const { idPermiso, nombrePermiso, permisosHijos } = permiso;
      return {
        title: (
          <span>
            {nombrePermiso}
            <Button
              type="link"
              danger
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                eliminarPermiso(idPermiso, nombrePermiso);
              }}
            >
              {translationService.translate('eliminar')}
            </Button>
          </span>
        ),
        key: idPermiso.toString(),
        children: permisosHijos.length > 0 ? transformarPermisosAArbol(permisosHijos) : [],
      };
    });
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5217/api/Usuario/obtener-usuarios');
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const crearPermiso = async (values) => {
    const { nombrePermiso } = values;
    try {
      const response = await fetch(
        `http://localhost:5217/api/Permiso/insertar/${encodeURIComponent(nombrePermiso)}`,
        {
          method: 'POST',
        }
      );
      if (!response.ok) {
        throw new Error('Error al crear el permiso');
      }
      message.success(translationService.translate('permisoCreadoExitosamente'));
      formCrearPermiso.resetFields();
      cargarPermisos();
    } catch (error) {
      console.error('Error al crear el permiso:', error);
      message.error(translationService.translate('errorCrearPermiso'));
    }
  };

  const asociarPermiso = async (values) => {
    const { nombreUsuario, idPermiso } = values;
    try {
      const response = await fetch(
        `http://localhost:5217/api/Permiso/asociar/${encodeURIComponent(nombreUsuario)}/${idPermiso}`,
        {
          method: 'POST',
        }
      );
      if (!response.ok) {
        throw new Error('Error al asociar el permiso');
      }
      message.success(translationService.translate('permisoAsociadoExitosamente'));
      formAsociarPermiso.resetFields();
    } catch (error) {
      console.error('Error al asociar el permiso:', error);
      message.error(translationService.translate('errorAsociarPermiso'));
    }
  };

  const quitarPermiso = async (values) => {
    const { nombreUsuario, idPermiso } = values;
    try {
      const response = await fetch(
        `http://localhost:5217/api/Permiso/quitar/${encodeURIComponent(nombreUsuario)}/${idPermiso}`,
        {
          method: 'POST',
        }
      );
      if (!response.ok) {
        throw new Error('Error al quitar el permiso');
      }
      message.success(translationService.translate('permisoQuitadoExitosamente'));
      // Actualizar la lista de permisos directos del usuario
      handleUsuarioSeleccionado(nombreUsuario);
      formQuitarPermiso.resetFields();
    } catch (error) {
      console.error('Error al quitar el permiso:', error);
      message.error(translationService.translate('errorQuitarPermiso'));
    }
  };

  const eliminarPermiso = (idPermiso, nombrePermiso) => {
    confirm({
      title: `${translationService.translate('confirmarEliminarPermiso')} "${nombrePermiso}"?`,
      onOk: async () => {
        try {
          const response = await fetch(
            `http://localhost:5217/api/Permiso/borrar/${idPermiso}`,
            {
              method: 'DELETE',
            }
          );
          if (!response.ok) {
            throw new Error('Error al eliminar el permiso');
          }
          message.success(translationService.translate('permisoEliminadoExitosamente'));
          cargarPermisos();
        } catch (error) {
          console.error('Error al eliminar el permiso:', error);
          message.error(translationService.translate('errorEliminarPermiso'));
        }
      },
    });
  };

  // Función para manejar la selección de un usuario en "Quitar Permiso de Usuario"
  const handleUsuarioSeleccionado = async (nombreUsuario) => {
    if (!nombreUsuario) {
      setPermisosUsuarioDirectos([]);
      formQuitarPermiso.setFieldsValue({ idPermiso: undefined });
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5217/api/Permiso/leer-permiso-usuario/${encodeURIComponent(nombreUsuario)}`
      );
      if (!response.ok) {
        throw new Error('Error al obtener permisos del usuario');
      }
      const permisosData = await response.json();
      // Extraer los permisos asignados directamente al usuario
      const permisosDirectos = extraerPermisosDirectos(permisosData);
      setPermisosUsuarioDirectos(permisosDirectos);
      formQuitarPermiso.setFieldsValue({ idPermiso: undefined });
    } catch (error) {
      console.error('Error al cargar permisos del usuario:', error);
    }
  };

  // Función para extraer los permisos asignados directamente al usuario
  const extraerPermisosDirectos = (permisos) => {
    // Los permisos asignados directamente están en el nivel superior
    return permisos.map((permiso) => ({
      idPermiso: permiso.idPermiso,
      nombrePermiso: permiso.nombrePermiso,
    }));
  };
  const asociarPermisoAPermiso = async (values) => {
    const { idPermisoPadre, idPermisoHijo } = values;
    try {
      const response = await fetch(
        `http://localhost:5217/api/Permiso/AsociarPermiso`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPadre: idPermisoPadre,
            idHijo: idPermisoHijo,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Error al asociar el permiso al permiso');
      }
      message.success(translationService.translate('permisoAsociadoExitosamente'));
      formAsociarPermisos.resetFields();
      cargarPermisos();
    } catch (error) {
      console.error('Error al asociar el permiso al permiso:', error);
      message.error(translationService.translate('errorAsociarPermiso'));
    }
  };

  const quitarPermisoAPermiso = async (values) => {
    const { idPermisoPadre, idPermisoHijo } = values;
    try {
      const response = await fetch(
        `http://localhost:5217/api/Permiso/quitar-permiso/${idPermisoPadre}/${idPermisoHijo}`,
        {
          method: 'POST',
        }
      );
      if (!response.ok) {
        throw new Error('Error al quitar el permiso del permiso');
      }
      message.success(translationService.translate('permisoQuitadoExitosamente'));
      formQuitarPermisos.resetFields();
      cargarPermisos();
    } catch (error) {
      console.error('Error al quitar el permiso del permiso:', error);
      message.error(translationService.translate('errorQuitarPermiso'));
    }
  };
  return (
    <>
      <NavMenu />
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '2rem' }}>
          <h2 className="permisos-title">{translationService.translate('gestionPermisos')}</h2>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card title={translationService.translate('listaPermisos')} bordered={false}>
                <Tree
                  treeData={arbolPermisos}
                  onSelect={(selectedKeys, info) => {
                    console.log('Seleccionado:', selectedKeys, info);
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} md={16}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card title={translationService.translate('crearNuevoPermiso')} bordered={false}>
                  <Form form={formCrearPermiso} onFinish={crearPermiso} layout="inline">
                    <Form.Item
                      name="nombrePermiso"
                      rules={[{ required: true, message: translationService.translate('ingreseNombrePermiso') }]}
                    >
                      <Input placeholder={translationService.translate('nombrePermiso')} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        {translationService.translate('crearPermiso')}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                <Card title={translationService.translate('asociarPermisoUsuario')} bordered={false}>
                  <Form form={formAsociarPermiso} onFinish={asociarPermiso} layout="vertical">
                    <Form.Item
                      name="nombreUsuario"
                      label={translationService.translate('seleccioneUsuario')}
                      rules={[{ required: true, message: translationService.translate('seleccioneUsuario') }]}
                    >
                      <Select placeholder={translationService.translate('seleccioneUsuario')}>
                        {usuarios.map((usuario) => (
                          <Option key={usuario.nombreUsuario} value={usuario.nombreUsuario}>
                            {usuario.nombreUsuario}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="idPermiso"
                      label={translationService.translate('seleccionePermiso')}
                      rules={[{ required: true, message: translationService.translate('seleccionePermiso') }]}
                    >
                      <Select placeholder={translationService.translate('seleccionePermiso')}>
                        {permisosSimples.map((permiso) => (
                          <Option key={permiso.idPermiso} value={permiso.idPermiso}>
                            {permiso.nombrePermiso}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        {translationService.translate('asociarPermiso')}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card title={translationService.translate('asociarPermisoAPermiso')} bordered={false}>
                  <Form form={formAsociarPermisos} onFinish={asociarPermisoAPermiso} layout="vertical">
                    <Form.Item
                      name="idPermisoPadre"
                      label={translationService.translate('seleccionePermisoPadre')}
                      rules={[
                        { required: true, message: translationService.translate('seleccionePermisoPadre') },
                      ]}
                    >
                      <Select placeholder={translationService.translate('seleccionePermisoPadre')}>
                        {permisosSimples.map((permiso) => (
                          <Option key={permiso.idPermiso} value={permiso.idPermiso}>
                            {permiso.nombrePermiso}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="idPermisoHijo"
                      label={translationService.translate('seleccionePermisoHijo')}
                      rules={[
                        { required: true, message: translationService.translate('seleccionePermisoHijo') },
                      ]}
                    >
                      <Select placeholder={translationService.translate('seleccionePermisoHijo')}>
                        {permisosSimples.map((permiso) => (
                          <Option key={permiso.idPermiso} value={permiso.idPermiso}>
                            {permiso.nombrePermiso}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        {translationService.translate('asociarPermiso')}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card title={translationService.translate('quitarPermisoUsuario')} bordered={false}>
                  <Form form={formQuitarPermiso} onFinish={quitarPermiso} layout="vertical">
                    <Form.Item
                      name="nombreUsuario"
                      label={translationService.translate('seleccioneUsuario')}
                      rules={[{ required: true, message: translationService.translate('seleccioneUsuario') }]}
                    >
                      <Select
                        placeholder={translationService.translate('seleccioneUsuario')}
                        onChange={handleUsuarioSeleccionado}
                      >
                        {usuarios.map((usuario) => (
                          <Option key={usuario.nombreUsuario} value={usuario.nombreUsuario}>
                            {usuario.nombreUsuario}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="idPermiso"
                      label={translationService.translate('seleccionePermiso')}
                      rules={[{ required: true, message: translationService.translate('seleccionePermiso') }]}
                    >
                      <Select
                        placeholder={translationService.translate('seleccionePermiso')}
                        disabled={permisosUsuarioDirectos.length === 0}
                      >
                        {permisosUsuarioDirectos.map((permiso) => (
                          <Option key={permiso.idPermiso} value={permiso.idPermiso}>
                            {permiso.nombrePermiso}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" danger>
                        {translationService.translate('quitarPermiso')}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Space>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default Permisos;

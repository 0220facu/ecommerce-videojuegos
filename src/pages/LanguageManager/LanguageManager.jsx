import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Card, Row, Col, Select, Space, Modal } from 'antd';
import translationService from '../../services/translationService';
import './LanguageManager.css';
import NavMenu from '../../components/NavMenu/NavMenu';

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

const LanguageManager = () => {
  const [languages, setLanguages] = useState(Object.keys(translationService.translations));
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [newLanguageCode, setNewLanguageCode] = useState('');
  const [newTranslationKey, setNewTranslationKey] = useState('');
  const [newTranslationValue, setNewTranslationValue] = useState('');
  const [translations, setTranslations] = useState(translationService.translations[selectedLanguage] || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTranslations(translationService.translations[selectedLanguage] || {});
  }, [selectedLanguage]);

  useEffect(() => {
    // Suscribirse a cambios de idiomas
    const observer = {
      updateLanguages: (newLanguages) => {
        setLanguages(newLanguages);
      }
    };
    translationService.subscribeLanguages(observer);

    return () => {
      translationService.unsubscribeLanguages(observer);
    };
  }, []);

  const handleAddLanguage = () => {
    if (newLanguageCode && !languages.includes(newLanguageCode)) {
      const spanishKeys = translationService.translations['es'] || {};
      const newLanguageTranslations = Object.fromEntries(Object.keys(spanishKeys).map((key) => [key, '']));
      translationService.addLanguage(newLanguageCode, newLanguageTranslations);
      setNewLanguageCode('');
    } else {
      alert('El código del idioma ya existe o es inválido.');
    }
  };

  const handleDeleteLanguage = () => {
    confirm({
      title: `¿Estás seguro de que quieres eliminar el idioma "${selectedLanguage}"?`,
      onOk: () => {
        translationService.removeLanguage(selectedLanguage);
        const newSelectedLanguage = languages[0] || 'es';
        setSelectedLanguage(newSelectedLanguage);
        setTranslations(translationService.translations[newSelectedLanguage] || {});
        translationService.setLanguage(newSelectedLanguage);
      },
      onCancel() {},
    });
  };

  const handleAddOrUpdateTranslation = () => {
    if (newTranslationKey && newTranslationValue) {
      translationService.addTranslation(selectedLanguage, newTranslationKey, newTranslationValue);
      setTranslations({
        ...translations,
        [newTranslationKey]: newTranslationValue,
      });
      setNewTranslationKey('');
      setNewTranslationValue('');
      setIsEditing(false);
    } else {
      alert('La clave o el valor de traducción están vacíos.');
    }
  };

  const handleEditTranslation = (key, value) => {
    setNewTranslationKey(key);
    setNewTranslationValue(value);
    setIsEditing(true);
  };

  const handleDeleteTranslation = (key) => {
    confirm({
      title: `¿Estás seguro de que quieres eliminar la clave "${key}"?`,
      onOk: () => {
        const updatedTranslations = { ...translations };
        delete updatedTranslations[key];
        setTranslations(updatedTranslations);
        translationService.translations[selectedLanguage] = updatedTranslations;
        translationService.saveToLocalStorage();
      },
      onCancel() {},
    });
  };

 

  return (
    <>
      <NavMenu />
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '2rem' }}>
          <h2>Gestión de Idiomas</h2>
          <Row gutter={[16, 16]}>
            {/* Columna para Crear Idioma */}
            <Col xs={24} md={8}>
              <Card title="Crear Nuevo Idioma" bordered={false}>
                <Form layout="vertical">
                  <Form.Item>
                    <Input
                      placeholder="Código de idioma (ej: fr, de)"
                      value={newLanguageCode}
                      onChange={(e) => setNewLanguageCode(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={handleAddLanguage} block>
                      Agregar Idioma
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Columna para Seleccionar Idioma y Gestionar Traducciones */}
            <Col xs={24} md={16}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Seleccionar Idioma */}
                <Card title="Seleccionar Idioma para Gestionar Traducciones" bordered={false}>
                  <Form layout="vertical">
                    <Form.Item>
                      <Select
                        value={selectedLanguage}
                        onChange={(value) => setSelectedLanguage(value)}
                        style={{ width: '100%' }}
                      >
                        {languages.map((lang) => (
                          <Option key={lang} value={lang}>
                            {lang}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="danger" onClick={handleDeleteLanguage} block>
                        Eliminar Idioma
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>

                {/* Formulario para Agregar o Modificar Traducción */}
                <Card title={isEditing ? "Editar Traducción" : "Agregar Nueva Traducción"} bordered={false}>
                  <Form layout="vertical">
                    <Form.Item label="Clave de Traducción">
                      <Input
                        placeholder="Clave de traducción"
                        value={newTranslationKey}
                        onChange={(e) => setNewTranslationKey(e.target.value)}
                        disabled={isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Valor de Traducción">
                      <Input
                        placeholder="Valor de traducción"
                        value={newTranslationValue}
                        onChange={(e) => setNewTranslationValue(e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={handleAddOrUpdateTranslation} block>
                        {isEditing ? "Guardar Cambios" : "Agregar Traducción"}
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Space>
            </Col>

            {/* Columna para Mostrar y Eliminar Traducciones */}
            <Col xs={24}>
              <Card title={`Traducciones de ${selectedLanguage.toUpperCase()}`} bordered={false}>
                <ul className="translation-list">
                  {Object.entries(translations).map(([key, value]) => (
                    <li key={key} className="translation-item">
                      <strong>{key}:</strong> {value}
                      <Button type="link" onClick={() => handleEditTranslation(key, value)}>
                        Editar
                      </Button>
                      <Button type="link" danger onClick={() => handleDeleteTranslation(key)}>
                        Eliminar
                      </Button>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default LanguageManager;

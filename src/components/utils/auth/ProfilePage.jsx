import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ProfilePage = () => {
  const { isAuthenticated, user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los campos del formulario
  const [document, setDocument] = useState(user?.document || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [birthdate, setBirthdate] = useState(user?.birthdate || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [touched, setTouched] = useState({}); // Estado para campos "tocados"

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/'); // Redirige a la página de inicio si el usuario no está autenticado
    } else {
      setDocument(user?.document || '');
      setName(user?.name || '');
      setEmail(user?.email || '');
      setBirthdate(user?.birthdate || '');
    }
  }, [isAuthenticated, navigate, user]);

  const validateField = (field, value) => {
    const errorMessages = {
      fullName: 'El nombre debe tener al menos 8 caracteres.',
      idNumber: 'El número de identificación debe tener al menos 4 dígitos y no contener letras.',
      email: 'Por favor, ingrese un email válido.',
      birthdate: 'Debes tener al menos 18 años para registrarte.',
      password: 'La contraseña debe contener al menos 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      confirmPassword: 'Las contraseñas no coinciden.',
    };

    const validations = {
      fullName: value.length >= 8,
      idNumber: /^[0-9]{4,}$/.test(value),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      birthdate: value && new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(value),
      confirmPassword: value === password,
    };

    return validations[field] ? '' : errorMessages[field];
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ejecuta validación final antes de enviar
    const newErrors = {
      fullName: validateField('fullName', name),
      idNumber: validateField('idNumber', document),
      email: validateField('email', email),
      birthdate: validateField('birthdate', birthdate),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }

    try {
      updateProfile({ document, name, email, birthdate, password, confirmPassword });
      setSuccess('Perfil actualizado correctamente.');
      setErrors({});
    } catch (error) {
      setErrors({ global: 'Error al actualizar el perfil.' });
      console.log(error)
    }
  };

  return (
    <div className="container col p-5 mt-3" style={{ minHeight: "100vh", marginRight : "850px"}}>
        <h1>Editar Perfil</h1>
      <div   className='row  '> 


      {errors.global && <Alert variant="danger">{errors.global}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBasicDocument">
              <Form.Label>Número de Documento</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingresa tu número de documento"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                onBlur={() => handleBlur('idNumber', document)}
                isInvalid={!!errors.idNumber && touched.idNumber}
                style={{ maxWidth: '80%' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.idNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('fullName', name)}
                isInvalid={!!errors.fullName && touched.fullName}
                style={{ maxWidth: '80%' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password', password)}
                isInvalid={!!errors.password && touched.password}
                style={{ maxWidth: '80%' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email', email)}
                isInvalid={!!errors.email && touched.email}
                style={{ maxWidth: '80%' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthdate">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                placeholder="Ingresa tu fecha de nacimiento"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                onBlur={() => handleBlur('birthdate', birthdate)}
                isInvalid={!!errors.birthdate && touched.birthdate}
                style={{ maxWidth: '80%' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.birthdate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                isInvalid={!!errors.confirmPassword && touched.confirmPassword}
                style={{ maxWidth: '80%' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>
    </div>
      </div>
      
  );
};

export default ProfilePage;

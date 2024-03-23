import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonButtons,
  IonMenuButton,
} from '@ionic/react';
import { register } from '../utils/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const RegisterPost = async (e: React.MouseEvent) => {
    e.preventDefault();

    const response = await register(name, email, password);

    if (response.message === 'success') {
      localStorage.setItem('token', 'Bearer ' + response.token);
      toast.success('Başarıyla kayıt olundu', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      window.location.href = '/login';
    } else {
      toast.info(response.message, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Üye Ol</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="container">
          <div className="main-frame">
            <div className="form">
              <IonInput
                type="text"
                placeholder="Kullanıcı Adı"
                value={name}
                onIonChange={(e) => setName(e.detail.value!)}
              />
              <IonInput
                type="email"
                placeholder="E-posta adresi"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
              />
              <IonInput
                type="password"
                placeholder="Şifre"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
              />
              <IonButton expand="full" onClick={RegisterPost}>
                Kayıt Ol
              </IonButton>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link to="/login">Giriş yapmak için tıklayınız</Link>
        </div>
        <ToastContainer />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
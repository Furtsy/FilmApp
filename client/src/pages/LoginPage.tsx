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
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { login } from '../utils/api';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LoginPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('E-posta ve şifre alanları boş bırakılamaz!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }

    const response = await login(email, password);

    if (response.message === 'success') {
      localStorage.setItem('token', 'Bearer ' + response.token);
      toast.success('Başarıyla Giriş Yapıldı', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      window.location.href = '/me';
    } else {
      toast.error(response.message, {
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
          <IonTitle>Giriş Yap</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <form onSubmit={LoginPost}>
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
                <IonButton expand="full" type="submit">
                  Giriş Yap
                </IonButton>
              </form>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-text-center">
              <Link to="/register">Üye değil misiniz? Üye olun.</Link>
            </IonCol>
          </IonRow>
        </IonGrid>
        <ToastContainer />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonButtons, IonMenuButton } from '@ionic/react';

const LogoutPage: React.FC = () => {

  useEffect(() => {
    localStorage.removeItem('token');
    window.location.href = '/'
  }, []);

  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Çıkış</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent className="ion-padding">
    <div id="container">
      <strong>Çıkış Yapılıyor</strong>
    </div>
    </IonContent>
  </IonPage>
  );
};

export default LogoutPage;
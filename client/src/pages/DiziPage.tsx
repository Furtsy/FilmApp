import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useParams } from 'react-router';

const DiziPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      <IonContent>
        <h1>{name}</h1>
        {/* Dizi içeriğini buraya ekleyin */}
      </IonContent>
    </IonPage>
  );
};

export default DiziPage;

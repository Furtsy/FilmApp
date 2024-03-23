import React, { useState, useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonInput, IonRow, IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonCardTitle,
  IonMenuButton,
  IonButtons,
  IonSelect,
  IonSelectOption, } from '@ionic/react';
import { deleteIcerik, getIcerikler, updateIcerik } from '../../utils/api';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

interface RootState {
  user: {
    email: string;
    ad: string;
    userid: string;
    admin: boolean;
    owner: boolean;
  };
}

const İcerikGuncellePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state);
  const [icerikler, setIcerikler] = useState([]);
  const [selectedIcerikMap, setSelectedIcerikMap] = useState({});

  const headers = {
    Authorization: `${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getIcerikler();
      setIcerikler(response);
    } catch (error) {
      console.error('İçerikleri getirme hatası: ', error);
    }
  };

  const handleGuncelle = async (id: any) => {
    try {
      if (selectedIcerikMap[id]) {
        const { name, description } = selectedIcerikMap[id];
        await updateIcerik(id, name, description, headers);
        fetchData();
      }
    } catch (error) {
      console.error('İçerik güncelleme hatası: ', error);
    }
  };

  const handleSil = async (id: any) => {
    try {
      await deleteIcerik(id, headers);
      fetchData();
    } catch (error) {
      console.error('İçerik silme hatası: ', error);
    }
  };

  if (!user.owner) return <Redirect to="/" />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>İçerik Güncelleme Sayfası</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {icerikler.map((icerik) => (
            <IonRow key={icerik._id}>
              <IonCol size="12" sizeMd="6">
                <IonCard>
                  <IonCardContent>
                    <IonInput
                      value={selectedIcerikMap[icerik._id]?.name || icerik.name}
                      onIonChange={(e) => setSelectedIcerikMap({ ...selectedIcerikMap, [icerik._id]: { ...selectedIcerikMap[icerik._id], name: e.detail.value } })}
                    />
                    <IonInput
                      value={selectedIcerikMap[icerik._id]?.description || icerik.description}
                      onIonChange={(e) => setSelectedIcerikMap({ ...selectedIcerikMap, [icerik._id]: { ...selectedIcerikMap[icerik._id], description: e.detail.value } })}
                    />
                    <div>
                      <IonButton onClick={() => handleGuncelle(icerik._id)}>Kaydet</IonButton>
                      <IonButton onClick={() => setSelectedIcerikMap({ ...selectedIcerikMap, [icerik._id]: null })}>İptal</IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default İcerikGuncellePage;
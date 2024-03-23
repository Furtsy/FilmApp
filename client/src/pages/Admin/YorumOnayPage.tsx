import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonMenuButton,
  IonButtons,
  IonSearchbar,
} from '@ionic/react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateYorumDurum, deleteyorum, getAdminYorumlar } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface yorumlar {
  _id: string;
  userName: string;
  icerik: string;
  filmId: number;
  durum: boolean;
  date: string;
}

interface RootState {
  user: {
    email: string;
    ad: string;
    userid: string;
    admin: boolean;
    owner: boolean;
  };
}

const YorumOnayPage: React.FC = () => {
  
  const { user } = useSelector((state: RootState) => state);
  const [yorumlar, setyorumlar] = useState<yorumlar[]>([]);
  const [filtrelenmisyorumlar, setFiltrelenmisyorumlar] = useState<yorumlar[]>([]);

  console.log(user)
  if (!user.admin && !user.owner) return <Redirect to="/" />;
  
  useEffect(() => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };

    getAdminYorumlar(headers)
      .then((response) => {
        const falseYorumlar = response.filter((yorum:any) => yorum.durum == false);
        setyorumlar(falseYorumlar);
        setFiltrelenmisyorumlar(falseYorumlar);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });

        console.error('Yorumlar getirirken hata oluştu: ', error);
      });
  }, []);

  const handleyorumlarSil = (yorumlarId: string) => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };

    deleteyorum(yorumlarId, headers)
      .then(() => {
        setyorumlar(yorumlar.filter((yorumlar) => yorumlar._id !== yorumlarId));
        setFiltrelenmisyorumlar(filtrelenmisyorumlar.filter((yorumlar) => yorumlar._id !== yorumlarId));
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      console.error('Yorum silme hatası: ', error);
      });
  };


  const handleyorumlarDurum = (yorumlarId: string) => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };

    updateYorumDurum(yorumlarId, true, headers)
      .then(() => {
        setyorumlar(yorumlar.filter((yorumlar) => yorumlar._id !== yorumlarId));
        setFiltrelenmisyorumlar(filtrelenmisyorumlar.filter((yorumlar) => yorumlar._id !== yorumlarId));
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      console.error('Yorum düzenleme hatası: ', error);
      });
  };

  const handleArama = (aramaMetni: string) => {
    const filtrelenmis = yorumlar.filter((yorumlar) => yorumlar.icerik.includes(aramaMetni) || yorumlar.userName.includes(aramaMetni));
    setFiltrelenmisyorumlar(filtrelenmis);
  };

  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Yorum Onay Sayfası</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar onIonInput={(e) => handleArama(e.detail.value || '')} placeholder='Yorum Ara'/>
        {filtrelenmisyorumlar.map((yorumlar) => (
          <IonCard key={yorumlar._id}>
            <IonCardHeader>
              <IonCardTitle>{yorumlar.userName}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Yorumu yazan: {yorumlar.userName}</p>
              <p>Yorum: {yorumlar.icerik}</p>
              <p>Date: {yorumlar.date}</p>
              <IonButton onClick={() => handleyorumlarSil(yorumlar._id)} color="danger">Yorumu Sil</IonButton>
              <IonButton onClick={() => handleyorumlarDurum(yorumlar._id)} color="success">Yorumu Onayla</IonButton>
            </IonCardContent>
          </IonCard>
        ))}
        <ToastContainer />
      </IonContent>
    </IonPage>
  );
};

export default YorumOnayPage;
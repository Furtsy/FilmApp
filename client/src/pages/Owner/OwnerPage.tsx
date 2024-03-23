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
import { ownergetKullanici, ownerdeleteKullanici, ownerBanlaKullanici, ownerAdminKullanici } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Kullanici {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  userid: string;
  owner: boolean;
  ban: boolean;
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

const OwnerSayfasi: React.FC = () => {
  const { user } = useSelector((state: RootState) => state);
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [filtrelenmisKullanicilar, setFiltrelenmisKullanicilar] = useState<Kullanici[]>([]);

  useEffect(() => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };

    ownergetKullanici(headers)
      .then((response) => {
        setKullanicilar(response);
        setFiltrelenmisKullanicilar(response);
      })
      .catch((error) => {ownerAdminKullanici
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

        console.error('Kullanıcıları getirirken hata oluştu: ', error);
      });
  }, []);

  const handleKullaniciSil = (kullaniciId: string) => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };

    ownerdeleteKullanici(kullaniciId, headers)
      .then(() => {
        setKullanicilar(kullanicilar.filter((kullanici) => kullanici._id !== kullaniciId));
        setFiltrelenmisKullanicilar(filtrelenmisKullanicilar.filter((kullanici) => kullanici._id !== kullaniciId));
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
      console.error('Kullanıcıyı silme hatası: ', error);
      });
  };

  const handleBanDurumuDegistir = (kullaniciId: string, banDurumu: boolean) => {
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };

    ownerBanlaKullanici(kullaniciId, banDurumu, headers)
      .then(() => {
        setKullanicilar(kullanicilar.map((kullanici) => (kullanici._id === kullaniciId ? { ...kullanici, ban: banDurumu } : kullanici)));
        setFiltrelenmisKullanicilar(filtrelenmisKullanicilar.map((kullanici) => (kullanici._id === kullaniciId ? { ...kullanici, ban: banDurumu } : kullanici)));
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
        console.error('Banlama hatası: ', error);
      });
  };

  const handleAdminDurumuDegistir = (kullaniciId: string, adminDurumu: boolean) => {
    const header = {
        Authorization: `${localStorage.getItem('token')}`,
    }
     ownerAdminKullanici(kullaniciId, adminDurumu, header)
        .then(() => {
            setKullanicilar(kullanicilar.map((kullanici) => (kullanici._id === kullaniciId ? { ...kullanici, admin: adminDurumu } : kullanici)));
            setFiltrelenmisKullanicilar(filtrelenmisKullanicilar.map((kullanici) => (kullanici._id === kullaniciId ? { ...kullanici, admin: adminDurumu } : kullanici)));
        }).catch((error) => {
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
            console.error('admin hatası: ', error);
          });
  }

  const handleArama = (aramaMetni: string) => {
    const filtrelenmis = kullanicilar.filter((kullanici) => kullanici.email.includes(aramaMetni) || kullanici.name.includes(aramaMetni));
    setFiltrelenmisKullanicilar(filtrelenmis);
  };

  if (!user.owner) return <Redirect to="/" />;
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Owner Sayfası</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar onIonInput={(e) => handleArama(e.detail.value || '')} placeholder='Kullanıcı Ara'/>
        {filtrelenmisKullanicilar.map((kullanici) => (
          <IonCard key={kullanici._id}>
            <IonCardHeader>
              <IonCardTitle>{kullanici.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Kullanıcı Adı: {kullanici.name}</p>
              <p>E-posta: {kullanici.email}</p>
              <p>Userid: {kullanici.userid}</p>
              <p>Owner: {kullanici.owner ? 'Evet' : 'Hayır' }</p> 
              <p>Admin: {kullanici.admin ? 'Evet' : 'Hayır'}</p>
              <p>Ban: {kullanici.ban ? 'Banlı' : 'Banlı Değil'}</p>
              <IonButton onClick={() => handleKullaniciSil(kullanici._id)}>Kullanıcıyı Sil</IonButton>
              <IonButton onClick={() => handleBanDurumuDegistir(kullanici._id, !kullanici.ban)}>
                {kullanici.ban ? 'Banı Kaldır' : 'Banla'}
              </IonButton>
              <IonButton onClick={() => handleAdminDurumuDegistir(kullanici._id, !kullanici.admin)}>
                {kullanici.admin ? 'Adminliği al' : 'Admin yap'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
        <ToastContainer />
      </IonContent>
    </IonPage>
  );
};

export default OwnerSayfasi;
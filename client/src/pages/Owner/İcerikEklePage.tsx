import React, { useState } from 'react';
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
  IonInput,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addIcerik } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RootState {
  user: {
    email: string;
    ad: string;
    userid: string;
    admin: boolean;
    owner: boolean;
  };
}

const İcerikEklePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  }

  const handleEkleClick = async () => {
    try {
      if (!image) return toast.error('Resim ekleyiniz.');
      console.log(image);
      const headers = {
        Authorization: `${localStorage.getItem('token')}`,
      };

      const response = await addIcerik(name, description, image, headers);

      toast.success(response.message, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      toast.error('İçerik eklenirken bir hata oluştu.', {
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

  if (!user.owner) return <Redirect to="/" />;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>İçerik Ekleme Sayfası</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>İçerik Bilgileri</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              placeholder="İsim"
              value={name}
              onIonChange={(e) => setName(e.detail.value!)}
            />
            <IonInput
              placeholder="Açıklama"
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
            />
              <IonSelectOption value="movie">Film</IonSelectOption>
              <IonSelectOption value="tv">TV</IonSelectOption>
            
              <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
  <img
    src={image as string}
    alt="Resim önizleme"
    style={{ maxWidth: '100%', maxHeight: '200px' }}
  />
)}
            <IonButton expand="full" onClick={handleEkleClick}>
              Ekle
            </IonButton>
          </IonCardContent>
        </IonCard>
        <ToastContainer />
      </IonContent>
    </IonPage>
  );
};

export default İcerikEklePage;
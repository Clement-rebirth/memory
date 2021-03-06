import React, { useContext, useEffect, useRef, useState } from 'react';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import { UserContext } from '../../providers/UserProvider';
import { getAuth, signOut } from 'firebase/auth';
import Manager from '../../services/firebase/Manager';

import { Navigate } from 'react-router-dom';

import './Admin.scss';

const Admin = () => {

  const [imageName, setImageName] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState(false);
  const [imagesSrc, setImagesSrc] = useState(false);

  let fileInputRef = useRef(null);
  let { user, setUser } = useContext(UserContext);

  useEffect(() => {
    let imagesManager = new Manager('images');

    imagesManager.getAll(snapshot => {
      let data = snapshot.val();
      setImagesSrc(data ? data : false);
    });
  }, []);

  const deleteImage = (id, imageName) => {
    if (!window.confirm('Supprimer l\'image ?')) return;

    // delete image from firebase storage
    const storage = getStorage();
    const imageRef = ref(storage, `memory-images/${imageName}`);

    deleteObject(imageRef)
      .then(() => {
        // delete image from the db
        let imageManager = new Manager(`images/${id}`);
        imageManager.delete(() => alert(`L'image a bien été supprimée`));
      })
      .catch(error => console.error(error));
  };

  const handleSignOut = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => setUser(false))
      .catch(error => console.error(error));
  };

  const handleImageChange = e => {
    setPreviewImageSrc(URL.createObjectURL(e.target.files[0]));
    setImageName(e.target.files[0].name);
  };

  const handleSubmit = e => {
    e.preventDefault();

    let file = fileInputRef.current.files[0];

    // if an image hasn't been uploaded
    if (!file) {
      alert(`Vous n'avez pas sélectionné d'image !`);
      return;
    }

    // if file size is more than 1mo
    if (file.size > 1024000) {
      alert(`L'image ne doit pas dépasser 1mo`);
      return;
    }

    const storage = getStorage();
    const memoryImageRef = ref(storage, `memory-images/${file.name}`);

    uploadBytes(memoryImageRef, file)
      .then(snapshot => {
        let imageName = snapshot.metadata.name;
        setImageName(imageName);

        let imagesManager = new Manager('images');
        imagesManager.add({ imageName: imageName });

        setImageName(false);
        setPreviewImageSrc(false);
        fileInputRef.current.value = '';
      })
      .catch(error => {
        console.error(error);
        return;
      });
  };
  
  if (user === false) return <Navigate to='/login' />;

  return (
    <div className='admin container'>
      <header>
        <h1>Admin</h1>
        <button className='sign-out' onClick={handleSignOut}>Déconnexion</button>
      </header>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='image'>Sélectionner une image pour le jeu</label>
          <input type='file' name='image' id='image' ref={fileInputRef} onChange={handleImageChange} />
        </div>

        { previewImageSrc && 
          <div className='image-preview'>
            <img 
              src={previewImageSrc}
              alt={imageName} />
          </div>
        }
        
        <button>Ajouter une image</button>
      </form>
          
      <h2>Liste des images</h2>

      <div className='images'>
        { imagesSrc === false &&
          <p className='no-images'>Vous n'avez pas d'image</p>
        }
        { Object.keys(imagesSrc).length > 0 && 
          Object.keys(imagesSrc).map(key => (
            <div key={key} className='image-container'>
              <img src={`https://firebasestorage.googleapis.com/v0/b/memory-7dc6f.appspot.com/o/memory-images%2F${imagesSrc[key].imageName}?alt=media`} alt={imagesSrc[key].imageName} />
              <button onClick={() => deleteImage(key, imagesSrc[key].imageName)}><span className='material-symbols-rounded'>delete</span></button>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;

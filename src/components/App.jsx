import React, { useState, useEffect } from 'react';
import { findImage } from 'services/api';
import Loader from './Loader';
import Modal from './Modal';
import Button from './Button';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import swal from 'sweetalert';
import '../css/styles.css';

export function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [querry, setQuerry] = useState('');
  const [modalImageUrl, setModalImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const FetchPostByQuerry = async () => {
    try {
      setIsLoading(true);
      const newImages = await findImage(querry, page);
      if (newImages.length === 0) {
        swal(
          'Oops',
          `Sorry, no images found for the query "${querry}"`,
          'error'
        );
      } else {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        setPage(page + 1);
        setHasMoreImages(updatedImages.length >= 12);
      }
    } catch (error) {
      setError(error.message);
      swal('Error', 'Error 404 - "Not Found"', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (querry !== '') {
      FetchPostByQuerry();
    }
  }, [querry]);

  const loadMoreImages = () => {
    setIsLoading(true);

    findImage(querry, page)
      .then(newImages => {
        setImages(prevImages => [...prevImages, ...newImages]);
        setPage(page + 1);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
        setHasMoreImages(false);
      });
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    setPage(1);
    const query = e.currentTarget.elements.searchImage.value;
    setQuerry(query);
    setImages([]);
    e.currentTarget.reset();
  };

  const openModal = imageUrl => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImageUrl(null);
    setIsModalOpen(false);
  };

  const showPosts = images.length > 0;

  return (
    <>
      <Searchbar handleSearchSubmit={handleSearchSubmit} />
      {isLoading && <Loader />}
      {error ? (
        setHasMoreImages(false)
      ) : (
        <ImageGallery
          images={images}
          openModal={openModal}
          showPosts={showPosts}
        />
      )}
      {showPosts && hasMoreImages && (
        <Button onClick={loadMoreImages} showButton={!isLoading} />
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          imageUrl={modalImageUrl}
          onClose={closeModal}
        />
      )}
    </>
  );
}

import React, { useState } from 'react';

import Logo from '../../components/Logo/Logo';
import Rank from '../../components/Rank/Rank';
import ImageLinkForm from '../../components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition';

const Home = ({ user, setCount }) => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [boxes, setBoxes] = useState([]);

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = async () => {
    setImageUrl(input);
    try {
      const imageUrlRes = await fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${window.sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          input,
        }),
      });
      const imageUrlData = await imageUrlRes.json();
      if (imageUrlData) {
        try {
          const imageRes = await fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${window.sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              id: user.id,
              count: imageUrlData.outputs
                ? imageUrlData.outputs[0].data.regions.length
                : 0,
            }),
          });
          const count = await imageRes.json();
          setCount(count);
        } catch (err) {
          console.log('image error:', err);
        }
      }
      displayFaceBoxes(calculateFaceLocations(imageUrlData));
    } catch (err) {
      console.log('image url error:', err);
    }
  };

  const calculateFaceLocations = (data) => {
    if (data && data.outputs) {
      const clarifaiFaces = data.outputs[0].data.regions;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      const faceBoxes = clarifaiFaces.map((face) => {
        const currentBox = face.region_info.bounding_box;
        return {
          id: face.id,
          leftCol: currentBox.left_col * width,
          topRow: currentBox.top_row * height,
          rightCol: width - currentBox.right_col * width,
          bottomRow: height - currentBox.bottom_row * height,
        };
      });
      return faceBoxes;
    }
    return;
  };

  const displayFaceBoxes = (boxes) => {
    if (boxes) {
      setBoxes(boxes);
    }
  };

  return (
    <div>
      <Logo />
      <Rank name={user.name} entries={user.entries} />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
    </div>
  );
};

export default Home;

import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import '../../Styles/NewPostPage.css';
import {PlantService} from '../../Services/PlantService';
import {SpeciesService} from '../../Services/SpeciesService';
import {Species} from '../../Interfaces/Species';

const NewPlant = ({onClose}: { onClose?: () => void }) => {
    const [formData, setFormData] = useState({
        plantName: '',
        speciesId: 0,
        images: [] as File[],
        plantingDate: '',
        description: '',
        image: null as File | null
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);

    useEffect(() => {
        SpeciesService.fetchSpecies()
            .then(fetchedSpecies => setSpecies(fetchedSpecies))
            .catch(error => console.error('Error fetching species:', error));
    }, []);

    const handleSpeciesChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            speciesId: Number(e.target.value),
        });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                image: e.target.files[0],
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prevImagePreviews => [...prevImagePreviews, reader.result as string]);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
        alert('Please fill in all required fields.');
        return;
    }

    const newPlant = {
        id: 0,
        ownerId: JSON.parse(localStorage.getItem('user') as string).id,
        currentState: "none",
        speciesId: formData.speciesId,
    };

    try {
        const response = await PlantService.createPlant(newPlant);
        if (response) {
            const uploadData = new FormData();
            if (formData.image) {
                uploadData.append("file", formData.image);
                uploadData.append("entityId", response.id.toString());
                uploadData.append("userId", newPlant.ownerId.toString());

                const uploadResponse = await fetch('http://localhost:4000/api/medias/upload/plant', {
                    method: 'POST',
                    body: uploadData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await uploadResponse.text();
                console.log(result);
            }
        }
    } catch (error) {
        console.error('Error during the file upload:', error);
    }

    setFormData({
        plantName: '',
        speciesId: 0,
        images: [],
        plantingDate: '',
        description: '',
        image: null
    });
    setImagePreviews([]);

    if (onClose) onClose();
};

    const validateForm = (): boolean => {
        return formData.speciesId !== 0 && formData.images.length > 0;
    };

    const handleCancel = () => {
        if (onClose) onClose();
    };

    const handleClearForm = () => {
        setFormData({
            plantName: '',
            speciesId: 0,
            images: [],
            plantingDate: '',
            description: '',
            image: null as File | null
        });
        setImagePreviews([]);
    };

    return (
        <div className="newPostContainer">
            <form onSubmit={handleSubmit} className="newPostForm">
                <input type="text" name="plantName" placeholder="Plant Name" value={formData.plantName}
                       onChange={handleInputChange} className="newPostInput"/>
                <select name="speciesId" onChange={handleSpeciesChange} required className="newPostInput">
                    {species.map(specie => (
                        <option key={specie.id} value={specie.id}>
                            {specie.name}
                        </option>
                    ))}
                </select>
                <input type="file" name="images" accept="image/*" onChange={handleImageChange} multiple required
                       className="newPostInput"/>
                {imagePreviews.map((preview, index) => <img key={index} src={preview} alt="Preview"
                                                            className="newPostImagePreview"/>)}
                <input type="date" name="plantingDate" value={formData.plantingDate} onChange={handleInputChange}
                       className="newPostInput"/>
                <textarea name="description" placeholder="Description" value={formData.description}
                          onChange={handleInputChange} className="newPostTextarea"/>
                <button type="submit" className="newPostButton">Submit</button>
                <button type="button" onClick={handleCancel} className="newPostButton">Cancel</button>
                <button type="button" onClick={handleClearForm} className="newPostButton">Clear</button>
            </form>
        </div>
    );
};

export default NewPlant;
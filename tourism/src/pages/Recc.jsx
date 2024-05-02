import axios from "axios"
import { useState } from "react";
import { cuisineRecc, flaskTrial } from "../util/APIroutes";


function Recc() {
    const [formData, setFormData] = useState({
        mealPreference: '',
        location: '',
        cuisines: [],
      });
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        
        try {
        //   const { data } = await axios.post(flaskTrial, formData);
          const { data } = await axios.post(cuisineRecc, formData);
          console.log(data);
        } catch (err) {
          console.log("recc error : ", err);
        }
      }

      const handleCuisineChange = (event) => {
        const { value } = event.target;
        const cuisines = [...formData.cuisines];
        if (cuisines.includes(value)) {
          // If cuisine is already selected, remove it
          const index = cuisines.indexOf(value);
          cuisines.splice(index, 1);
        } else {
          // If cuisine is not selected, add it
          cuisines.push(value);
        }
        setFormData({
          ...formData,
          cuisines,
        });
      };
    
    
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Meal Preference:
            <select name="mealPreference" value={formData.mealPreference} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Location:
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            Cuisine:
            <select multiple name="cuisines" value={formData.cuisines} onChange={handleCuisineChange}>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              {/* Add more cuisine options here */}
            </select>
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Recc
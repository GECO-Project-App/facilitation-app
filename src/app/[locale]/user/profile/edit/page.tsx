'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {supabase} from '@/lib/supabase/supabaseClient';
import DialogView from '@/components/modal/DialogView';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (  
    <form onSubmit={handleSubmit} className="h-96 flex flex-col justify-between">
      <div className="space-y-4 px-4">
        <div className="space-y-2">
          <Input
            id="edit-firstNamr"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Input
            id="edit-lastName"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="h-12 rounded-full"
          />
        </div>
        
      </div>
      <div className="mt-14 flex justify-center pb-6">
      <Button type="submit">Submit</Button>
      </div>
    </form> 
    );
};

export default EditProfile;

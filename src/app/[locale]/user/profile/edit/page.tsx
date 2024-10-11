'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useUserStore} from '@/store/userStore';
import {supabase} from '@/lib/supabase/supabaseClient';

const EditProfile = () => {
  const {user} = useUserStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const InsertData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      authId: user?.id,
      email: user?.email,
    };
    console.log(InsertData);
  const { error } = await supabase
  .from('users')
  .insert(InsertData)

  if (error) {
    console.error('Error updating profile:', error);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto h-full max-w-[600px] overflow-hidden p-4">
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <Input
              id="edit-firstNamr"
              name="firstName"
              type="text"
              placeholder="Enter your First name"
              value={formData.firstName}
              onChange={handleChange}
            //   required
              className="h-12 rounded-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="edit-lastName"
              name="lastName"
              type="text"
              placeholder="Enter your Last name"
              value={formData.lastName}
              onChange={handleChange}
            //   required
              className="h-12 rounded-full"
            />
          </div>
        </div>
        <div className="mt-14 flex justify-center pb-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </>
  );
};

export default EditProfile;

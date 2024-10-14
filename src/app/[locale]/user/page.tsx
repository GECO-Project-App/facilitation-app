import SignUp from './SignUp';
import LogIn from './LogIn';
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs/tabs';
import {useTranslations} from 'next-intl';

const AuthPage = () => {
  const t = useTranslations('authenticate');

 return (
    <Tabs defaultValue="login" className="mx-auto h-full max-w-[600px] overflow-hidden p-4">
      <TabsList className="m-auto mt-10 grid h-12 w-80 grid-cols-2 rounded-full bg-lightBlue">
        <TabsTrigger
          value="login"
          className="text-black h-10 rounded-full border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black">
          {t('logIn')}
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="text-black h-10 rounded-full border-black data-[state=active]:border-2 data-[state=active]:bg-green data-[state=active]:text-black">
          {t('signUp')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-10 h-full">
        <LogIn />
      </TabsContent>
      <TabsContent value="signup" className="mt-10 h-full">
        <SignUp />
      </TabsContent>
    </Tabs>
  );
};

export default AuthPage;

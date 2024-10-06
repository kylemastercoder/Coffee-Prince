import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <div className="bg-[url('/images/about.jpg')] h-screen w-full flex items-center flex-col justify-center m-auto overflow-hidden bg-no-repeat bg-cover bg-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;

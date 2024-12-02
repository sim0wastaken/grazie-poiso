import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/firebase/AuthContext'; // Make sure to import correctly
import { Button } from '@/components/ui/button';

function Home() {
  const authContext = useAuth();
  const currentUser = authContext?.currentUser; // Safely access currentUser
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="p-4">
        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Beh oramai che sei qui, che ne dici di fare un giro? Sentiti a casa🥳
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Prima però devo chiederti di effettuare il login.. ti ringrazio🫰
        </p>
        <p className="text-sm text-muted-foreground">Hai ricevuto un link personale? Puoi usarlo per tornare indietro</p>
        <br />
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    </div>
  );
}

export default Home;

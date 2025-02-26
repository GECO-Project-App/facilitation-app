import {useNotification} from '@/lib/providers/notifications/useNotification';
import {Button} from './ui/button';

const NotificationSubscriptionStatus = () => {
  const {isSubscribed, handleSubscribe, handleUnsubscribe, isGranted, isDenied, errorMessage} =
    useNotification();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Push Notification Subscription</h1>

      {isDenied && (
        <p className="text-red text-center mb-4">
          You have denied permission for push notifications. To enable, please update your browser
          settings.
        </p>
      )}

      {errorMessage && <p className="text-red text-center mb-4">Error: {errorMessage}</p>}

      <div className="flex flex-col gap-4">
        {!isSubscribed && (
          <Button
            onClick={handleSubscribe}
            className="w-full bg-blue text-white py-2 px-4 rounded-lg hover:bg-blue transition"
            disabled={isDenied}>
            Subscribe to Push Notifications
          </Button>
        )}

        {isGranted && isSubscribed && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-green font-semibold">You are subscribed!</p>

            <Button onClick={handleUnsubscribe} className="w-full bg-red text-white">
              Unsubscribe from Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSubscriptionStatus;

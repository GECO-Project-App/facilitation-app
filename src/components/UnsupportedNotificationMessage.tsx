import Image from 'next/image';

export const UnsupportedNotificationMessage = () => {
  return (
    <div className="p-6 w-full max-w-md">
      <p className="text-red text-center mb-6">
        Push notifications are not supported in this browser. Consider adding to the home screen
        (PWA) if on iOS.
      </p>
      <Image
        src="/assets/pwa_ios.jpg"
        width={10000}
        height={10000}
        alt="Push Notification"
        className="h-auto w-auto"
      />
    </div>
  );
};

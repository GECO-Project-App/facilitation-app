import fs from 'fs';
import webPush from 'web-push';

const vapidKeys = webPush.generateVAPIDKeys();

const envData = `
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
NEXT_PUBLIC_VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`;

fs.writeFileSync('.env', envData, { flag: 'w' });

console.log('#### VAPID keys generated and saved to .env file ### \n');
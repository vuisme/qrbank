import { useRouter } from 'next/router';
import GenerateQR from './[amount]'; // Import your existing GenerateQR component

export default function UserIndexPage() {
    const router = useRouter();
    const { user } = router.query;

    // Redirect or render GenerateQR with default amount
    return <GenerateQR user={user} amount="0" />; // Pass default amount "0"
}